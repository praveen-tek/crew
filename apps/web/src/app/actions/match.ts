"use server";

import { getAuthenticatedSession } from "@/lib/auth/auth";
import { db } from "@/db";
import {
  matchRequest,
  matchResult,
  aatmodayGroup,
  aatmodayEvent,
} from "@/db/schema";
import {
  checkRateLimit,
  validateAndSanitizeInterestText,
  generateMatches,
} from "@/lib/matching";
import { desc, eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Server action to process user interest text and generate AI matches
 */
export async function submitInterestMatch(interestText: string): Promise<ActionResult<{ matchRequestId: string }>> {
  try {
    const session = await getAuthenticatedSession();
    if (!session || !session.user) {
      return { success: false, error: "You must be signed in to generate matches." };
    }

    const userId = session.user.id;

    // Rate limiting check
    const rateLimit = checkRateLimit(userId);
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: `Rate limit reached. Please wait ${rateLimit.retryAfterSeconds || 30} seconds before submitting again.`,
      };
    }

    // Input validation & sanitization
    const sanitizedText = validateAndSanitizeInterestText(interestText);

    // Run AI Matching
    const recommendations = await generateMatches(sanitizedText);
    if (!recommendations || recommendations.length === 0) {
      return { success: false, error: "Could not generate matches for this prompt. Please try describing more details." };
    }

    const requestId = randomUUID();

    // Persist match_request
    await db.insert(matchRequest).values({
      id: requestId,
      userId: userId,
      interestText: sanitizedText,
      createdAt: new Date(),
    });

    // Persist match_result entries
    for (const rec of recommendations) {
      await db.insert(matchResult).values({
        id: randomUUID(),
        matchRequestId: requestId,
        groupId: rec.groupId,
        eventId: rec.eventId,
        score: rec.score,
        reasoning: rec.reasoning,
        icebreaker: rec.icebreaker,
        rank: rec.rank,
        createdAt: new Date(),
      });
    }

    return {
      success: true,
      data: { matchRequestId: requestId },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("submitInterestMatch error:", err);
    return { success: false, error: message };
  }
}

/**
 * Server action to get match results for a specific request ID
 */
export async function getMatchRequestDetails(requestId: string) {
  try {
    const session = await getAuthenticatedSession();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Fetch the match request
    const requests = await db
      .select()
      .from(matchRequest)
      .where(eq(matchRequest.id, requestId))
      .limit(1);

    if (requests.length === 0) {
      return { success: false, error: "Match request not found." };
    }

    const req = requests[0];

    // Verify ownership
    if (req.userId !== session.user.id) {
      return { success: false, error: "Access denied." };
    }

    // Fetch the match results joined with groups and events
    const results = await db
      .select({
        id: matchResult.id,
        groupId: matchResult.groupId,
        groupName: aatmodayGroup.name,
        groupDescription: aatmodayGroup.description,
        groupCategory: aatmodayGroup.category,
        groupTags: aatmodayGroup.tags,
        eventId: matchResult.eventId,
        eventName: aatmodayEvent.name,
        eventDescription: aatmodayEvent.description,
        eventLocation: aatmodayEvent.location,
        eventStartsAt: aatmodayEvent.startsAt,
        score: matchResult.score,
        reasoning: matchResult.reasoning,
        icebreaker: matchResult.icebreaker,
        rank: matchResult.rank,
      })
      .from(matchResult)
      .innerJoin(aatmodayGroup, eq(matchResult.groupId, aatmodayGroup.id))
      .leftJoin(aatmodayEvent, eq(matchResult.eventId, aatmodayEvent.id))
      .where(eq(matchResult.matchRequestId, requestId))
      .orderBy(matchResult.rank);

    return {
      success: true,
      data: {
        request: req,
        results,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load matches.";
    return { success: false, error: message };
  }
}

/**
 * Server action to get the user's past match requests history
 */
export async function getUserMatchHistory() {
  try {
    const session = await getAuthenticatedSession();
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const requests = await db
      .select()
      .from(matchRequest)
      .where(eq(matchRequest.userId, session.user.id))
      .orderBy(desc(matchRequest.createdAt));

    // For each request, get the top match summary
    const enrichedHistory = await Promise.all(
      requests.map(async (req) => {
        const topMatches = await db
          .select({
            groupName: aatmodayGroup.name,
            groupCategory: aatmodayGroup.category,
            score: matchResult.score,
          })
          .from(matchResult)
          .innerJoin(aatmodayGroup, eq(matchResult.groupId, aatmodayGroup.id))
          .where(eq(matchResult.matchRequestId, req.id))
          .orderBy(matchResult.rank)
          .limit(3);

        return {
          ...req,
          topMatches,
        };
      }),
    );

    return {
      success: true,
      data: enrichedHistory,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load history.";
    return { success: false, error: message };
  }
}
