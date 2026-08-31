"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Copy,
  Check,
  Calendar,
  MapPin,
  Tag,
  ArrowLeft,
  RotateCcw,
  History,
  MessageSquareQuote,
  ShieldAlert,
  Flame,
} from "lucide-react";
import { motion } from "motion/react";

export interface MatchResultItem {
  id: string;
  groupId: string;
  groupName: string;
  groupDescription: string;
  groupCategory: string;
  groupTags: string[];
  eventId: string | null;
  eventName: string | null;
  eventDescription: string | null;
  eventLocation: string | null;
  eventStartsAt: Date | null;
  score: number;
  reasoning: string;
  icebreaker: string;
  rank: number;
}

interface MatchResultsViewProps {
  requestId: string;
  interestText: string;
  createdAt: Date;
  results: MatchResultItem[];
}

export function MatchResultsView({
  interestText,
  createdAt,
  results,
}: MatchResultsViewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyIcebreaker = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId(null);
      }, 2500);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const formatScorePercentage = (score: number) => {
    return Math.round(score * 100);
  };

  const getScoreColor = (score: number) => {
    const pct = score * 100;
    if (pct >= 90) return "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800";
    if (pct >= 80) return "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800";
    return "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800";
  };

  return (
    <div className="w-full max-w-4xl space-y-8">
      {/* Top Action & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/match"
          className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>New Match Search</span>
        </Link>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            render={
              <Link href="/dashboard">
                <History className="h-4 w-4" />
                <span>History</span>
              </Link>
            }
          />
          <Button
            size="sm"
            className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
            render={
              <Link href="/match">
                <RotateCcw className="h-4 w-4" />
                <span>Re-run with new prompt</span>
              </Link>
            }
          />
        </div>
      </div>

      {/* Query Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-200/80 bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-background p-6 shadow-sm dark:border-blue-900/40 dark:from-blue-950/30 dark:via-indigo-950/20">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Your Interest Prompt
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">
                {new Date(createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="text-base font-medium italic text-foreground sm:text-lg">
              "{interestText}"
            </p>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Top AI Recommendations ({results.length})
          </h2>
          <p className="text-sm text-muted-foreground">
            Ranked by interest alignment, active projects, and upcoming campus events.
          </p>
        </div>
      </div>

      {/* Results Cards List */}
      <div className="space-y-6">
        {results.map((match, idx) => {
          const isCopied = copiedId === match.id;
          const matchPercent = formatScorePercentage(match.score);

          return (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-lg transition-all duration-200 hover:border-blue-300/80 hover:shadow-xl dark:hover:border-blue-800/80 sm:p-8"
            >
              {/* Header row: Rank badge + Group Name + Match Score */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 pb-5">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary font-mono text-sm font-bold text-foreground">
                    #{match.rank}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                      {match.groupName}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-md bg-blue-100/80 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        {match.groupCategory}
                      </span>
                      {match.groupTags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Score Pill */}
                <div
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-bold shadow-xs ${getScoreColor(
                    match.score,
                  )}`}
                >
                  <Flame className="h-4 w-4" />
                  <span>{matchPercent}% Match</span>
                </div>
              </div>

              {/* Group Description */}
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {match.groupDescription}
              </p>

              {/* AI Match Reasoning Box */}
              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-950/20">
                <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Why this fits you
                </div>
                <p className="text-sm font-medium leading-relaxed text-foreground">
                  {match.reasoning}
                </p>
              </div>

              {/* Matched Upcoming Event if present */}
              {match.eventName && (
                <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 dark:border-indigo-900/30 dark:bg-indigo-950/20 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Recommended Upcoming Event</span>
                    </div>
                    <div className="font-semibold text-foreground">
                      {match.eventName}
                    </div>
                    {match.eventDescription && (
                      <p className="text-xs text-muted-foreground">
                        {match.eventDescription}
                      </p>
                    )}
                  </div>
                  {match.eventLocation && (
                    <div className="flex items-center gap-1.5 self-start text-xs text-muted-foreground sm:self-center">
                      <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                      <span>{match.eventLocation}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Icebreaker Card */}
              <div className="mt-5 rounded-2xl border-2 border-dashed border-border/80 bg-secondary/30 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
                    <MessageSquareQuote className="h-4 w-4 text-blue-600" />
                    <span>Personalized Icebreaker</span>
                  </div>

                  <Button
                    type="button"
                    variant={isCopied ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCopyIcebreaker(match.id, match.icebreaker)}
                    className={`gap-1.5 rounded-xl transition-all duration-200 ${
                      isCopied
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "hover:border-blue-500 hover:text-blue-600"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Icebreaker</span>
                      </>
                    )}
                  </Button>
                </div>

                <p className="mt-3 font-mono text-sm leading-relaxed text-foreground/90 select-all">
                  "{match.icebreaker}"
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
