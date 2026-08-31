import { SignInPage } from "@/components/authentication/sign-in";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Crew",
  description: "Sign in to Crew with Google to match with college hobby groups and events.",
};

export default function Page() {
  return <SignInPage />;
}
