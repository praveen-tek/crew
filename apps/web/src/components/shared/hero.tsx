import Image from "next/image";
import Link from "next/link";
import { Folder, MousePointer2, Sparkles, ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CornerDot } from "./dots";
import { EdgeHandle } from "./edge";

export function Hero() {
  return (
    <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-6 pb-24 pt-12 text-center">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <MousePointer2 className="h-9 w-9 -translate-y-3 -rotate-12 fill-foreground text-foreground sm:h-11 sm:w-11" />
        <h1 className="text-6xl font-bold tracking-tight text-foreground sm:text-8xl">
          Find Your
        </h1>
        <span className="relative inline-block">
          <span className="relative z-10 rounded-md border-2 border-blue-600 bg-blue-100/70 px-5 py-1.5 font-serif text-6xl italic text-blue-600 sm:text-8xl">
            Crew!
          </span>
          <CornerDot className="-right-2.5 -top-2.5" />
          <CornerDot className="-bottom-2.5 -left-2.5" />
        </span>
      </div>

      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-2xl">
        Describe your passions in plain English and get matched with Aatmoday
        hobby groups and upcoming events built for you — complete with AI reasoning and personalized icebreakers.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button
          size="xl"
          className="gap-2.5 rounded-2xl bg-blue-600 px-8 py-6 text-base font-semibold text-white shadow-xl shadow-blue-500/25 hover:bg-blue-700 sm:text-lg"
          render={
            <Link href="/match">
              <Compass className="h-5 w-5" />
              <span>Describe your interests</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          }
        />
      </div>

      <div className="relative mt-16 w-full max-w-2xl -rotate-1">
        <div className="relative overflow-hidden rounded-sm border-2 border-blue-600 shadow-2xl">
          <Image
            src="/8417399.jpg"
            alt="Student describing their interests"
            width={1200}
            height={1450}
            className="h-auto w-full object-cover"
            priority
          />
        </div>

        <EdgeHandle className="left-1/2 top-0 h-5 w-12 -translate-x-1/2 -translate-y-1/2" />
        <EdgeHandle className="left-1/2 bottom-0 h-5 w-12 -translate-x-1/2 translate-y-1/2" />
        <EdgeHandle className="left-0 top-1/2 h-12 w-5 -translate-x-1/2 -translate-y-1/2" />
        <EdgeHandle className="right-0 top-1/2 h-12 w-5 translate-x-1/2 -translate-y-1/2" />
        <CornerDot className="-left-2.5 -top-2.5" />
        <CornerDot className="-right-2.5 -top-2.5" />
        <CornerDot className="-bottom-2.5 -left-2.5" />
        <CornerDot className="-bottom-2.5 -right-2.5" />

        <div className="absolute -top-8 right-6 rotate-6 rounded-2xl bg-blue-300/90 p-4 shadow-xl backdrop-blur-sm dark:bg-blue-900">
          <Folder className="h-10 w-10 fill-blue-200 text-blue-700 dark:fill-blue-800 dark:text-blue-200" />
        </div>
      </div>
    </div>
  );
}