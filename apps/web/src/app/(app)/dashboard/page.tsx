import { getUserMatchHistory } from "@/app/actions/match";
import { HistoryView } from "@/components/dashboard/history-view";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard & History — Crew",
  description: "View all your past match requests and recommendations.",
};

export default async function DashboardPage() {
  const res = await getUserMatchHistory();

  if (!res.success || !res.data) {
    redirect("/sign-in?callbackUrl=/dashboard");
  }

  return (
    <div className="w-full max-w-4xl">
      <HistoryView history={res.data} />
    </div>
  );
}
