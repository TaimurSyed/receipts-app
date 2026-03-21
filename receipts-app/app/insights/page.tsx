import Link from "next/link";
import { GenerateInsightsButton } from "@/components/insights/generate-insights-button";
import { InsightCard } from "@/components/insights/insight-card";
import { getEvidenceSnippets, getInsights } from "@/lib/insights";

export default async function InsightsPage() {
  const insights = await getInsights();
  const evidenceIds = [...new Set(insights.flatMap((insight) => insight.evidence))];
  const evidenceMap = await getEvidenceSnippets(evidenceIds);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Receipts insights</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Signals, contradictions, and weekly receipts</h1>
          <p className="mt-3 max-w-2xl text-zinc-400">
            This should read less like a dashboard and more like something that actually noticed how your week moved.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <GenerateInsightsButton />
          <Link href="/app" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
            Back to app
          </Link>
        </div>
      </div>

      {insights.length === 0 ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-zinc-400">
          No insights yet. Save more entries or generate them once the AI layer is connected.
        </div>
      ) : (
        <div className="grid gap-5">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} evidenceMap={evidenceMap} />
          ))}
        </div>
      )}
    </main>
  );
}
