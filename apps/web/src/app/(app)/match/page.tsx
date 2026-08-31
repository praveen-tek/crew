import { MatchForm } from "@/components/matching/match-form";
import { Sparkle } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Describe Interests — Crew",
  description: "Describe your passions and get matched with Aatmoday student groups and events.",
};

export default function MatchPage() {
  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
          <Sparkle weight="fill" className="h-3.5 w-3.5" />
          <span>Powered by AI Matchmaking & Icebreakers</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          What are you into?
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          Tell us in your own words. We'll surface your best-fit campus groups, events, and icebreakers.
        </p>
      </div>

      <MatchForm />
    </div>
  );
}
