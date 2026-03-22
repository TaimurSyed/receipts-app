import { DeletableEvidenceCard } from "@/components/insights/deletable-evidence-card";
import type { EvidenceSnippet, InsightRecord } from "@/lib/insights";

type InsightCardProps = {
  insight: InsightRecord;
  evidenceMap?: Record<string, EvidenceSnippet>;
  variant?: "note" | "journal" | "margin";
};

const intros: Record<string, string> = {
  pattern: "A thread in the margin:",
  contradiction: "A tension worth underlining:",
  weekly_receipt: "What this page seems to be saying:",
};

export function InsightCard({ insight, evidenceMap, variant = "note" }: InsightCardProps) {
  const isJournal = variant === "journal";
  const isMargin = variant === "margin";

  return (
    <article
      className={
        isJournal
          ? "rounded-[2rem] bg-transparent"
          : isMargin
            ? "w-full bg-transparent"
            : "living-note note-stack-b notebook-panel w-full rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/8 to-white/[0.03] p-6"
      }
    >
      {!isJournal ? <p className={isMargin ? "text-[11px] uppercase tracking-[0.2em] text-amber-200/60" : "text-sm italic leading-6 text-zinc-500"}>{intros[insight.type] ?? "What your entries suggest:"}</p> : null}
      <h2 className={isJournal ? "text-3xl font-semibold tracking-tight text-amber-50" : isMargin ? "mt-2 font-serif text-xl text-[#f1e7d4]" : "mt-2 text-2xl font-semibold tracking-tight text-white"}>
        {insight.title}
      </h2>
      <p className={isJournal ? "mt-5 max-w-3xl whitespace-pre-line font-serif text-[18px] leading-9 text-zinc-200" : isMargin ? "mt-3 max-w-3xl whitespace-pre-line text-[15px] leading-7 text-zinc-300" : "mt-4 max-w-3xl whitespace-pre-line text-[15px] leading-8 text-zinc-300"}>
        {insight.body}
      </p>

      <details className={isMargin ? "receipt-reveal mt-4 rounded-[1rem] border border-white/10 bg-black/10 px-3 py-3" : "receipt-reveal mt-6 rounded-[1.4rem] border border-white/10 bg-black/15 px-4 py-4"}>
        <summary className="cursor-pointer list-none text-sm font-medium text-zinc-300">
          Open the quoted notes underneath
        </summary>
        <div className="mt-4 space-y-4">
          {insight.evidence.length > 0 ? (
            insight.evidence.map((entryId, index) => {
              const evidence = evidenceMap?.[entryId];
              if (!evidence) {
                return (
                  <div key={entryId} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="font-medium text-white">This note was deleted after the insight was generated</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      The insight still remembers that something mattered here, but the original note is gone now.
                    </p>
                  </div>
                );
              }

              const relatedHref = `/app/timeline?relatedTo=${encodeURIComponent(entryId)}`;

              return (
                <DeletableEvidenceCard
                  key={entryId}
                  entryId={entryId}
                  evidence={evidence}
                  relatedHref={relatedHref}
                />
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
