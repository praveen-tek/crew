import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 flex w-full max-w-5xl flex-col items-center justify-between gap-6 border-t border-border/60 px-6 py-16 text-center sm:flex-row sm:text-left">
      <div>
        <div className="flex items-center justify-center gap-2 sm:justify-start">
          <span className="font-bold text-foreground">Crew</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">Aatmoday Hobby Matching</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Built for Code Vidya Hack Day. Helping students find their crew through AI.
        </p>
      </div>
      <Button
        size="lg"
        className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
        render={
          <Link href="/match">
            <Compass className="h-4 w-4" />
            <span>Describe Interests</span>
          </Link>
        }
      />
    </footer>
  );
}