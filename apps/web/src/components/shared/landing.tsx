"use client";

import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/background/dotted-background";
import { Nav } from "./nav";
import { Hero } from "./hero";
import { HowItWorks } from "./how";
import { GroupsCatalog } from "./groups-catalog";
import { Footer } from "./footer";

export function CrewLandingPage() {
  return (
    <main className="bg-background relative flex w-full flex-col items-center overflow-hidden">
      <DotPattern
        className={cn(
          "mask-[radial-gradient(900px_circle_at_center,white,transparent)]",
        )}
      />
      <Nav />
      <Hero />
      <HowItWorks />
      <GroupsCatalog />
      <Footer />
    </main>
  );
}