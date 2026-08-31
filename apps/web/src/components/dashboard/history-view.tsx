"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Compass,
  ArrowRight,
  Calendar,
  Sparkles,
  Flame,
  MessageSquare,
} from "lucide-react";
import { motion } from "motion/react";

export interface HistoryRequestItem {
  id: string;
  interestText: string;
  createdAt: Date;
  topMatches: {
    groupName: string;
    groupCategory: string;
    score: number;
  }[];
}

interface HistoryViewProps {
  history: HistoryRequestItem[];
}

export function HistoryView({ history }: HistoryViewProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card/60 p-12 text-center shadow-xs">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
          <MessageSquare className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-foreground">No matches yet</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          You haven't run any interest match searches yet. Describe what you're into and get matched with Aatmoday groups!
        </p>
        <Button
          size="lg"
          className="mt-6 gap-2 bg-blue-600 text-white hover:bg-blue-700"
          render={
            <Link href="/match">
              <Compass className="h-4 w-4" />
              <span>Describe Your Interests</span>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Past Match Requests ({history.length})
          </h2>
          <p className="text-sm text-muted-foreground">
            Review your previous searches, recommendations, and conversation starters.
          </p>
        </div>
        <Button
          size="default"
          className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
          render={
            <Link href="/match">
              <Compass className="h-4 w-4" />
              <span>New Match Search</span>
            </Link>
          }
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-1">
        {history.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:hover:border-blue-900"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <p className="text-base font-semibold text-foreground line-clamp-2">
                  "{item.interestText}"
                </p>

                {/* Top Matches Preview Pills */}
                {item.topMatches && item.topMatches.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs text-muted-foreground">Matched:</span>
                    {item.topMatches.map((m, mIdx) => (
                      <span
                        key={mIdx}
                        className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50/70 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300"
                      >
                        <Sparkles className="h-3 w-3 text-blue-500" />
                        {m.groupName} ({Math.round(m.score * 100)}%)
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="shrink-0 pt-2 sm:pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 group-hover:border-blue-500 group-hover:text-blue-600"
                  render={
                    <Link href={`/match/${item.id}`}>
                      <span>View Results</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  }
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
