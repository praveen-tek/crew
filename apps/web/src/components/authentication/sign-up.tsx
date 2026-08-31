"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";

export function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      setError(null);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/match",
      });
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to initialize Google Sign Up. Please verify OAuth setup.");
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-radial from-blue-50/50 via-background to-background px-4 py-16 dark:from-blue-950/20">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
          <div className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
            <Sparkles className="h-3.5 w-3.5" />
            Aatmoday Campus
          </div>
        </div>

        {/* Card */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-8 shadow-xl backdrop-blur-md">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 bg-blue-100/70 p-3 shadow-inner dark:border-blue-900 dark:bg-blue-950">
              <Image
                src="/logo.svg"
                alt="Crew Logo"
                width={36}
                height={36}
                className="h-auto w-auto"
                priority
              />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Join <span className="text-blue-600">Crew</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your account with Google to get matched with the best student groups and icebreakers.
            </p>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-center text-xs text-destructive">
              {error}
            </div>
          )}

          <div className="mt-8 space-y-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full justify-center gap-3 border-2 border-border/80 py-6 text-base font-semibold shadow-sm hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30"
              onClick={handleGoogleSignUp}
              loading={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 256 262"
              >
                <path
                  fill="#4285f4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                />
                <path
                  fill="#34a853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                />
                <path
                  fill="#fbbc05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                />
                <path
                  fill="#eb4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                />
              </svg>
              <span>Continue with Google</span>
            </Button>

            <div className="flex items-center gap-2 pt-2 text-center justify-center text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Fast, secure, passwordless authentication</span>
            </div>
          </div>

          <div className="mt-8 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}