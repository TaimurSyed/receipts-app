import type { InsightRecord } from "@/lib/insights";

const labels: Record<string, string> = {
  pattern: "Pattern",
  contradiction: "Contradiction",
  weekly_receipt: "Weekly receipt",
};

export function InsightCard({ insight }: { insight: InsightRecord }) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-amber-200">
          {labels[insight.type] ?? insight.type}
        </span>
        <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">{insight.confidence} confidence</span>
        {insight.createdAt ? (
          <span className="text-xs uppercase tracking-[0.18em] text-zinc-600">
            {new Date(insight.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        ) : null}
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-white">{insight.title}</h2>
      <p className="mt-3 max-w-3xl leading-7 text-zinc-400">{insight.body}</p>
      <p className="mt-4 text-sm text-zinc-500">
        Evidence: {insight.evidence.length > 0 ? insight.evidence.join(", ") : "No linked entries yet"}
      </p>
    </article>
  );
}
