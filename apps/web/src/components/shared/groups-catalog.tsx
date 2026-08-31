import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Gamepad2,
  Cpu,
  Music,
  Camera,
  Dices,
  Mountain,
  Coffee,
  Sparkles,
  ArrowRight,
  Calendar,
} from "lucide-react";

const FEATURED_GROUPS = [
  {
    icon: Bot,
    name: "Robotics & Embedded Guild",
    category: "Technology",
    tag: "ROS2 & Autonomous Drones",
    description: "Hands-on hardware hackers building line followers, combat bots, and edge vision systems.",
    event: "Hack The Bot: Autonomous Sprint",
  },
  {
    icon: Gamepad2,
    name: "Indie Game Dev Circle",
    category: "Creative Tech",
    tag: "Godot & Pixel Art",
    description: "Game designers, pixel artists, and sound composers collaborating on weekend game jams.",
    event: "48-Hour Campus Game Jam",
  },
  {
    icon: Music,
    name: "Indie Rock & Jam Collective",
    category: "Music",
    tag: "Acoustic & Synth Jams",
    description: "Weekly rooftop jam sessions, original songwriting, and campus live shows.",
    event: "Unplugged Acoustic Jam on the Terrace",
  },
  {
    icon: Mountain,
    name: "Trekking & Outdoor Explorers",
    category: "Adventure",
    tag: "Bouldering & High Peaks",
    description: "Sunrise summit hikes, indoor bouldering, slacklining, and stargazing campouts.",
    event: "Sunrise Ridge Trek & Trail Breakfast",
  },
  {
    icon: Camera,
    name: "Film Photography Society",
    category: "Visual Arts",
    tag: "35mm & Darkroom",
    description: "Analogue film enthusiasts, street portraits, architecture, and photo zines.",
    event: "Golden Hour Campus Street Walk",
  },
  {
    icon: Coffee,
    name: "Specialty Coffee & Culinary",
    category: "Lifestyle",
    tag: "Pour-Overs & Fermentation",
    description: "Single-origin cuppings, sourdough fermentation, and artisan wood-fired pizza.",
    event: "Third-Wave Coffee Cupping Session",
  },
];

export function GroupsCatalog() {
  return (
    <section id="groups" className="relative z-10 w-full max-w-6xl px-6 py-20">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
          <Sparkles className="h-3.5 w-3.5" />
          Aatmoday Campus Ecosystem
        </div>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          Explore Campus Hobby Groups
        </h2>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          Over a dozen active student communities with weekly meetups, hackathons, and projects.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_GROUPS.map((group) => {
          const Icon = group.icon;
          return (
            <div
              key={group.name}
              className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:hover:border-blue-900"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-blue-100 bg-blue-50/60 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300">
                    {group.category}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-foreground">
                  {group.name}
                </h3>
                <p className="mt-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {group.tag}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {group.description}
                </p>
              </div>

              <div className="mt-6 border-t border-border/60 pt-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-blue-500" />
                  <span className="font-medium text-foreground/90 truncate">{group.event}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Button
          size="lg"
          className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
          render={
            <Link href="/match">
              <span>Find your match across all groups</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      </div>
    </section>
  );
}
