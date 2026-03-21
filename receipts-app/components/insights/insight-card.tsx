import type { EvidenceSnippet, InsightRecord } from "@/lib/insights";

const labels: Record<string, string> = {
  pattern: "Pattern noticed",
  contradiction: "What didn't match",
  weekly_receipt: "This week's note",
};

const intros: Record<string, string> = {
  pattern: "A thread that kept showing up:",
  contradiction: "Something your week kept revealing:",
  weekly_receipt: "If this week had to confess something, it would probably say this:",
};

type InsightCardProps = {
  insight: InsightRecord;
  evidenceMap?: Record<string, EvidenceSnippet>;
  variant?: "note" | "journal";
};

export function InsightCard({ insight, evidenceMap, variant = "note" }: InsightCardProps) {
  const isJournal = variant === "journal";

  return (
    <article
      className={
        isJournal
          ? "rounded-[2rem] border border-amber-100/10 bg-[#181614] p-8 shadow-panel"
          : "rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/8 to-white/[0.03] p-6"
      }
    >
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

      <p className="mt-5 text-sm italic leading-6 text-zinc-500">{intros[insight.type] ?? "What your entries suggest:"}</p>
      <h2 className={isJournal ? "mt-3 text-3xl font-semibold tracking-tight text-amber-50" : "mt-2 text-2xl font-semibold tracking-tight text-white"}>
        {insight.title}
      </h2>
      <p className={isJournal ? "mt-5 max-w-3xl whitespace-pre-line font-serif text-[18px] leading-9 text-zinc-200" : "mt-4 max-w-3xl whitespace-pre-line text-[15px] leading-8 text-zinc-300"}>
        {insight.body}
      </p>

      <details className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
        <summary className="cursor-pointer list-none text-sm font-medium text-zinc-300">
          Open the receipts underneath
        </summary>
        <div className="mt-4 space-y-3">
          {insight.evidence.length > 0 ? (
            insight.evidence.map((entryId) => {
              const evidence = evidenceMap?.[entryId];
              return (
                <div key={entryId} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">{evidence?.title ?? entryId}</p>
                    <span className="text-xs text-zinc-500">{evidence?.createdAt ?? "linked entry"}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{evidence?.content ?? "Entry snippet unavailable."}</p>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-zinc-500">No linked entries yet.</p>
          )}
        </div>
      </details>
    </article>
  );
}
