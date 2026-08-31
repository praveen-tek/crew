"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";
import { Compass, History, LogOut, Sparkles, User } from "lucide-react";

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="Crew Logo"
            width={28}
            height={28}
            className="h-auto w-auto"
            priority
          />
          <span className="text-xl font-bold tracking-tight text-foreground">
            Crew
          </span>
          <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
            Aatmoday
          </span>
        </Link>

        {/* Links */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button
            variant={pathname.startsWith("/match") ? "secondary" : "ghost"}
            size="sm"
            className="gap-2"
            render={
              <Link href="/match">
                <Compass className="h-4 w-4 text-blue-600" />
                <span>Match</span>
              </Link>
            }
          />
          <Button
            variant={pathname.startsWith("/dashboard") ? "secondary" : "ghost"}
            size="sm"
            className="gap-2"
            render={
              <Link href="/dashboard">
                <History className="h-4 w-4 text-blue-600" />
                <span>History</span>
              </Link>
            }
          />
        </nav>

        {/* User profile & sign out */}
        <div className="flex items-center gap-3">
          {session?.user ? (
            <div className="flex items-center gap-3">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="h-8 w-8 rounded-full border border-border object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <User className="h-4 w-4" />
                </div>
              )}
              <span className="hidden text-sm font-medium text-foreground sm:inline-block">
                {session.user.name || session.user.email}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleSignOut}
                title="Sign out"
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              render={<Link href="/sign-in">Sign In</Link>}
            />
          )}
        </div>
      </div>
    </header>
  );
}
