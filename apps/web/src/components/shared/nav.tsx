"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { Compass, Sparkles, User } from "lucide-react";

export function Nav() {
  const { data: session } = authClient.useSession();

  return (
    <header className="relative z-10 flex w-full max-w-6xl items-center justify-between px-6 py-8">
      <Link href="/" className="flex items-center gap-2.5">
        <Image
          src="/logo.svg"
          alt="Crew logo"
          width={28}
          height={28}
          className="h-7 w-7"
          priority
        />
        <span className="text-2xl font-bold tracking-tight text-foreground">
          Crew
        </span>
        <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
          Aatmoday
        </span>
      </Link>

      <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
        <Link href="#how-it-works" className="hover:text-foreground transition-colors">
          How it works
        </Link>
        <Link href="#groups" className="hover:text-foreground transition-colors">
          Campus Groups
        </Link>
        {session?.user && (
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            My History
          </Link>
        )}
      </nav>

      <div className="flex items-center gap-3">
        {session?.user ? (
          <Button
            size="default"
            className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
            render={
              <Link href="/match">
                <Compass className="h-4 w-4" />
                <span>Describe Interests</span>
              </Link>
            }
          />
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              render={<Link href="/sign-in">Sign In</Link>}
            />
            <Button
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700"
              render={<Link href="/sign-up">Get started</Link>}
            />
          </div>
        )}
      </div>
    </header>
  );
}