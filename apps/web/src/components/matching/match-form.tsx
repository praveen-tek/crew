"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitInterestMatch } from "@/app/actions/match";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Robot,
  GameController,
  Guitar,
  Mountains,
  Coffee,
  Sword,
  Sparkle,
  ArrowRight,
  Lightbulb,
  Compass,
  Lightning,
  CheckCircle,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";

const SAMPLE_PROMPTS = [
  {
    icon: Robot,
    label: "AI & Robotics",
    text: "I want to build autonomous drones and experiment with edge vision and local LLM agents on microcontrollers.",
  },
  {
    icon: GameController,
    label: "Indie Game Dev & Shaders",
    text: "I love 2D pixel art, Godot engine game design, procedural shaders, and weekend game jams.",
  },
  {
    icon: Guitar,
    label: "Indie Rock & Jamming",
    text: "I play electric guitar and write songs; looking for synth players and drummers for weekly rooftop jamming.",
  },
  {
    icon: Mountains,
    label: "Bouldering & Outdoor Treks",
    text: "Looking for weekend mountain ridge hikes, outdoor bouldering sessions, and sunrise campouts.",
  },
  {
    icon: Coffee,
    label: "Specialty Coffee & Sourdough",
    text: "Passionate about single-origin pour-overs, espresso tasting, and 72-hour sourdough pizza baking.",
  },
  {
    icon: Sword,
    label: "Tabletop D&D & Catan",
    text: "Enjoy deep strategy board games, Friday night Dungeons & Dragons campaigns, and competitive blitz chess.",
  },
];

const LOADING_STEPS = [
  "Parsing your interest description...",
  "Searching the Aatmoday campus catalog...",
  "Analyzing semantic fit & event alignment...",
  "Crafting personalized match reasoning...",
  "Generating natural conversation icebreakers...",
];

export function MatchForm() {
  const router = useRouter();
  const [interestText, setInterestText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!interestText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setLoadingStep(0);

    // Cycle through loading step indicators
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 1100);

    try {
      const res = await submitInterestMatch(interestText);
      clearInterval(interval);

      if (res.success && res.data?.matchRequestId) {
        router.push(`/match/${res.data.matchRequestId}`);
      } else {
        setError(res.error || "Failed to find matches. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err: unknown) {
      clearInterval(interval);
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  const handleSelectSample = (sample: string) => {
    setInterestText(sample);
  };

  return (
    <div className="w-full max-w-3xl">
      <AnimatePresence mode="wait">
        {isSubmitting ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex flex-col items-center justify-center rounded-3xl border border-blue-200/60 bg-gradient-to-b from-blue-50/80 to-card p-12 text-center shadow-xl backdrop-blur-md dark:border-blue-900/40 dark:from-blue-950/30"
          >
            {/* Animated Pulsing Icon */}
            <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 shadow-lg shadow-blue-500/30">
              <Sparkle weight="fill" className="h-10 w-10 animate-pulse text-white" />
              <div className="absolute inset-0 -z-10 animate-ping rounded-3xl bg-blue-400 opacity-25" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Finding Your Perfect Crew
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Our AI is matching your interests with active Aatmoday groups and events.
            </p>

            {/* Step Indicators */}
            <div className="mt-8 w-full max-w-md space-y-3 text-left">
              {LOADING_STEPS.map((step, idx) => {
                const isCurrent = idx === loadingStep;
                const isPast = idx < loadingStep;

                return (
                  <div
                    key={step}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300 ${
                      isCurrent
                        ? "border-blue-500 bg-blue-50/90 font-medium text-blue-900 shadow-sm dark:bg-blue-950/60 dark:text-blue-200"
                        : isPast
                        ? "border-emerald-200 bg-emerald-50/60 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300"
                        : "border-border/40 opacity-40 text-muted-foreground"
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle weight="fill" className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    ) : isCurrent ? (
                      <div className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-blue-600 border-t-transparent dark:border-blue-400" />
                    ) : (
                      <div className="h-5 w-5 shrink-0 rounded-full border-2 border-muted" />
                    )}
                    <span className="text-sm">{step}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="rounded-3xl border border-border/80 bg-card/95 p-6 shadow-xl backdrop-blur-md sm:p-10"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <Compass weight="duotone" className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Describe Your Interests
                </h2>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Write freely — hobbies, specific tech stacks, creative passions, vibes, or projects you want to build.
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Textarea
                  value={interestText}
                  onChange={(e) => setInterestText(e.target.value)}
                  placeholder="e.g. I want to build autonomous robots and edge AI on single-board computers, and I also enjoy late-night acoustic guitar jamming and weekend bouldering..."
                  className="min-h-[160px] resize-y rounded-2xl border-2 border-border/70 p-4 text-base shadow-inner focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10"
                  maxLength={2000}
                />
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Minimum 5 characters. Be as specific as you like!</span>
                  <span className={interestText.length > 1800 ? "text-amber-500" : ""}>
                    {interestText.length}/2000
                  </span>
                </div>
              </div>

              {/* Sample Prompts */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Lightbulb weight="bold" className="h-4 w-4 text-amber-500" />
                  <span>Need inspiration? Try one of these:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_PROMPTS.map((sample) => {
                    const Icon = sample.icon;
                    return (
                      <button
                        key={sample.label}
                        type="button"
                        onClick={() => handleSelectSample(sample.text)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/50 px-3.5 py-1.5 text-xs font-medium text-foreground transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/60 dark:hover:text-blue-300"
                      >
                        <Icon weight="bold" className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        <span>{sample.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="xl"
                disabled={interestText.trim().length < 5 || isSubmitting}
                className="w-full justify-center gap-2 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700"
              >
                <Lightning weight="fill" className="h-5 w-5" />
                <span>Find My Matches & Icebreakers</span>
                <ArrowRight weight="bold" className="h-5 w-5" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
