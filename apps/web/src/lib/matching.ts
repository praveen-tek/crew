import { db } from "@/db";
import { aatmodayGroup, aatmodayEvent } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface CatalogGroupWithEvents {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  events: {
    id: string;
    name: string;
    description: string;
    location: string | null;
    startsAt: Date | null;
  }[];
}

export interface MatchRecommendation {
  groupId: string;
  groupName: string;
  groupCategory: string;
  eventId: string | null;
  eventName: string | null;
  score: number; // 0.0 to 1.0
  reasoning: string;
  icebreaker: string;
  rank: number;
}

import { and, gte } from "drizzle-orm";
import { matchRequest } from "@/db/schema";

export const DAILY_MATCH_LIMIT = 5;

/**
 * Checks if the user has reached their daily limit of 5 AI match requests per day
 */
export async function checkDailyRateLimit(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetHours?: number;
}> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const past24hRequests = await db
    .select({
      id: matchRequest.id,
      createdAt: matchRequest.createdAt,
    })
    .from(matchRequest)
    .where(
      and(
        eq(matchRequest.userId, userId),
        gte(matchRequest.createdAt, oneDayAgo)
      )
    )
    .orderBy(matchRequest.createdAt);

  const count = past24hRequests.length;
  const remaining = Math.max(0, DAILY_MATCH_LIMIT - count);

  if (count >= DAILY_MATCH_LIMIT) {
    const oldest = past24hRequests[0].createdAt;
    const resetTime = new Date(oldest.getTime() + 24 * 60 * 60 * 1000);
    const msUntilReset = Math.max(0, resetTime.getTime() - Date.now());
    const resetHours = Math.ceil(msUntilReset / (1000 * 60 * 60));
    return {
      allowed: false,
      remaining: 0,
      resetHours: Math.max(1, resetHours),
    };
  }

  return {
    allowed: true,
    remaining,
  };
}

export function validateAndSanitizeInterestText(input: unknown): string {
  if (typeof input !== "string") {
    throw new Error("Interest description must be text.");
  }

  // Strip control chars and basic HTML tags to prevent XSS / prompt injection
  const sanitized = input
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, "")
    .trim();

  if (sanitized.length < 5) {
    throw new Error("Please write at least a few words describing your interests (minimum 5 characters).");
  }

  if (sanitized.length > 2000) {
    throw new Error("Interest description is too long (maximum 2000 characters).");
  }

  return sanitized;
}

/**
 * Retrieves the full Aatmoday catalog of groups and events via Drizzle ORM
 */
export async function getFullCatalog(): Promise<CatalogGroupWithEvents[]> {
  const groups = await db.select().from(aatmodayGroup);
  const events = await db.select().from(aatmodayEvent);

  return groups.map((g) => ({
    ...g,
    events: events.filter((e) => e.groupId === g.id),
  }));
}

/**
 * Core LLM Matching function
 */
export async function generateMatches(interestText: string): Promise<MatchRecommendation[]> {
  const catalog = await getFullCatalog();
  if (catalog.length === 0) {
    throw new Error("No Aatmoday groups found in catalog. Please run database seeding.");
  }

  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    try {
      return await matchWithGemini(interestText, catalog, geminiKey);
    } catch (err) {
      console.warn("Gemini API matching error, falling back to intelligent semantic matcher:", err);
    }
  }

  if (openAiKey) {
    try {
      return await matchWithOpenAI(interestText, catalog, openAiKey);
    } catch (err) {
      console.warn("OpenAI API matching error, falling back to intelligent semantic matcher:", err);
    }
  }

  // Fallback intelligent semantic scoring engine
  return matchWithSemanticEngine(interestText, catalog);
}

/**
 * Gemini API matching with structured JSON
 */
async function matchWithGemini(
  interestText: string,
  catalog: CatalogGroupWithEvents[],
  apiKey: string,
): Promise<MatchRecommendation[]> {
  const catalogPrompt = catalog
    .map(
      (g) =>
        `- ID: "${g.id}", Name: "${g.name}", Category: "${g.category}", Tags: [${g.tags.join(", ")}], Description: "${g.description}"${
          g.events.length > 0
            ? `, Events: [${g.events.map((e) => `(ID: "${e.id}", Name: "${e.name}", Starts: "${e.startsAt?.toLocaleDateString()}")`).join("; ")}]`
            : ""
        }`,
    )
    .join("\n");

  const systemInstruction = `You are Crew's AI Matchmaker for college students joining Aatmoday hobby groups and events.
Given a student's free-form interest description and the official Aatmoday catalog, analyze their true passions, learning goals, social vibe, and creative interests.
Select the top 3 to 5 best fitting groups (and specific upcoming events if relevant).
For each match provide:
1. groupId: string (must EXACTLY match one of the catalog group IDs)
2. eventId: string | null (if a specific upcoming event of this group matches, give its ID; otherwise null)
3. score: float between 0.60 and 0.99 (similarity score, higher means better fit)
4. reasoning: 2-3 concise, engaging sentences directly connecting what the student expressed to why this group/event is ideal for them.
5. icebreaker: 1 natural, friendly, non-cringe conversation starter the student can copy and send to the group chat or say at the first meetup.

Output ONLY valid JSON matching this schema:
{
  "matches": [
    {
      "groupId": "grp_...",
      "eventId": "evt_..." or null,
      "score": 0.95,
      "reasoning": "...",
      "icebreaker": "..."
    }
  ]
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${systemInstruction}\n\nCATALOG:\n${catalogPrompt}\n\nSTUDENT INTEREST DESCRIPTION:\n"${interestText}"`,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const contentText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!contentText) {
    throw new Error("Empty response from Gemini API");
  }

  const parsed = JSON.parse(contentText);
  return formatAndValidateMatches(parsed.matches || [], catalog);
}

/**
 * OpenAI API matching
 */
async function matchWithOpenAI(
  interestText: string,
  catalog: CatalogGroupWithEvents[],
  apiKey: string,
): Promise<MatchRecommendation[]> {
  const catalogPrompt = catalog
    .map(
      (g) =>
        `- ID: "${g.id}", Name: "${g.name}", Category: "${g.category}", Tags: [${g.tags.join(", ")}], Description: "${g.description}"${
          g.events.length > 0
            ? `, Events: [${g.events.map((e) => `(ID: "${e.id}", Name: "${e.name}")`).join("; ")}]`
            : ""
        }`,
    )
    .join("\n");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are Crew's AI Matchmaker for college students joining Aatmoday hobby groups and events. Output JSON with a "matches" array containing groupId, eventId (nullable), score (0.60-0.99), reasoning (2-3 sentences), icebreaker (1 natural message).`,
        },
        {
          role: "user",
          content: `CATALOG:\n${catalogPrompt}\n\nSTUDENT INTERESTS:\n"${interestText}"`,
        },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error (${response.status})`);
  }

  const data = await response.json();
  const contentText = data.choices?.[0]?.message?.content;
  const parsed = JSON.parse(contentText);
  return formatAndValidateMatches(parsed.matches || [], catalog);
}

/**
 * Fallback Intelligent Semantic Matching Engine
 */
export function matchWithSemanticEngine(
  interestText: string,
  catalog: CatalogGroupWithEvents[],
): MatchRecommendation[] {
  const queryLower = interestText.toLowerCase();
  const queryTokens = queryLower
    .split(/[\s,.;:!?/()\-+]+/)
    .filter((w) => w.length > 2);

  const scoredGroups = catalog.map((group) => {
    let score = 0.2; // base score

    const groupText = `${group.name} ${group.description} ${group.category} ${group.tags.join(" ")}`.toLowerCase();
    const eventTexts = group.events.map((e) => `${e.name} ${e.description}`).join(" ").toLowerCase();
    const fullGroupText = `${groupText} ${eventTexts}`;

    // Tag exact & partial matches
    for (const tag of group.tags) {
      if (queryLower.includes(tag.toLowerCase())) {
        score += 0.35;
      }
    }

    // Token overlap matches
    for (const token of queryTokens) {
      if (group.tags.some((t) => t.toLowerCase().includes(token))) {
        score += 0.15;
      } else if (groupText.includes(token)) {
        score += 0.08;
      } else if (eventTexts.includes(token)) {
        score += 0.05;
      }
    }

    // Category relevance
    if (queryLower.includes(group.category.toLowerCase())) {
      score += 0.25;
    }

    // Cap score at 0.98, min 0.55
    const normalizedScore = Math.min(0.98, Math.max(0.55, Number(score.toFixed(2))));

    // Select the best matching event if any
    let matchedEvent = group.events[0] || null;
    for (const ev of group.events) {
      const evText = `${ev.name} ${ev.description}`.toLowerCase();
      if (queryTokens.some((tok) => evText.includes(tok))) {
        matchedEvent = ev;
        break;
      }
    }

    // Generate dynamic personalized reasoning
    const matchedAspects = group.tags.filter((t) => queryLower.includes(t.toLowerCase()));
    const aspectStr = matchedAspects.length > 0 ? matchedAspects.join(" & ") : group.category;
    const reasoning = `Based on your interest in ${aspectStr || "hands-on exploration"}, ${group.name} provides an active community tailored for collaborative projects and weekly meetups.${
      matchedEvent ? ` Their upcoming "${matchedEvent.name}" is the perfect starting point.` : ""
    }`;

    // Generate contextual, personalized icebreaker
    const icebreaker = `Hey everyone! I came across ${group.name} while exploring ${aspectStr || group.name} on campus. Super excited to join — what are some of the current projects you guys are working on?`;

    return {
      groupId: group.id,
      groupName: group.name,
      groupCategory: group.category,
      eventId: matchedEvent ? matchedEvent.id : null,
      eventName: matchedEvent ? matchedEvent.name : null,
      score: normalizedScore,
      reasoning,
      icebreaker,
    };
  });

  // Sort descending by score and pick top 4
  scoredGroups.sort((a, b) => b.score - a.score);
  const topMatches = scoredGroups.slice(0, 4);

  return topMatches.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}

function formatAndValidateMatches(
  rawMatches: Array<{
    groupId: string;
    eventId?: string | null;
    score: number;
    reasoning: string;
    icebreaker: string;
  }>,
  catalog: CatalogGroupWithEvents[],
): MatchRecommendation[] {
  const groupMap = new Map(catalog.map((g) => [g.id, g]));

  const validMatches = rawMatches
    .filter((m) => groupMap.has(m.groupId))
    .map((m, index) => {
      const group = groupMap.get(m.groupId)!;
      let matchedEventName: string | null = null;
      let eventId: string | null = m.eventId || null;

      if (eventId) {
        const foundEvent = group.events.find((e) => e.id === eventId);
        if (foundEvent) {
          matchedEventName = foundEvent.name;
        } else if (group.events.length > 0) {
          eventId = group.events[0].id;
          matchedEventName = group.events[0].name;
        } else {
          eventId = null;
        }
      } else if (group.events.length > 0) {
        eventId = group.events[0].id;
        matchedEventName = group.events[0].name;
      }

      return {
        groupId: group.id,
        groupName: group.name,
        groupCategory: group.category,
        eventId,
        eventName: matchedEventName,
        score: Math.min(0.99, Math.max(0.6, Number(m.score) || 0.85)),
        reasoning: m.reasoning || `Strong match for your interests in ${group.name}.`,
        icebreaker: m.icebreaker || `Hey everyone! Excited to get involved with ${group.name}!`,
        rank: index + 1,
      };
    });

  if (validMatches.length === 0) {
    return matchWithSemanticEngine("", catalog);
  }

  return validMatches;
}
