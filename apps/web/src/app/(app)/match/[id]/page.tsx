import { getMatchRequestDetails } from "@/app/actions/match";
import { MatchResultsView } from "@/components/matching/match-results-view";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Match Results — Crew",
  description: "View your personalized Aatmoday group matches, reasoning, and icebreakers.",
};

export default async function MatchResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getMatchRequestDetails(id);

  if (!res.success || !res.data) {
    if (res.error === "Unauthorized") {
      redirect(`/sign-in?callbackUrl=/match/${id}`);
    }
    notFound();
  }

  const { request, results } = res.data;

  return (
    <MatchResultsView
      requestId={request.id}
      interestText={request.interestText}
      createdAt={request.createdAt}
      results={results}
    />
  );
}
