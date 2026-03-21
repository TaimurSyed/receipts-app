import Link from "next/link";
import { GenerateInsightsButton } from "@/components/insights/generate-insights-button";
import { getInsights } from "@/lib/insights";

export default async function InsightsPage() {
  const insights = await getInsights();

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Receipts insights</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Signals, contradictions, and weekly receipts</h1>
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
            <article key={insight.id} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-amber-200">
                  {insight.type}
                </span>
                <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">{insight.confidence} confidence</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-white">{insight.title}</h2>
              <p className="mt-3 max-w-3xl leading-7 text-zinc-400">{insight.body}</p>
              <p className="mt-4 text-sm text-zinc-500">Evidence: {insight.evidence.join(", ") || "No linked entries yet"}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
