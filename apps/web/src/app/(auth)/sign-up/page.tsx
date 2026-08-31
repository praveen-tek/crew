import { SignUpPage } from "@/components/authentication/sign-up";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — Crew",
  description: "Create an account on Crew with Google to match with college hobby groups and events.",
};

export default function Page() {
  return <SignUpPage />;
}
