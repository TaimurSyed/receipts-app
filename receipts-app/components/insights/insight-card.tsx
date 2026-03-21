import { ManageNoteMenu } from "@/components/insights/manage-note-menu";
import type { EvidenceSnippet, InsightRecord } from "@/lib/insights";

type InsightCardProps = {
  insight: InsightRecord;
  evidenceMap?: Record<string, EvidenceSnippet>;
  variant?: "note" | "journal";
};

const intros: Record<string, string> = {
  pattern: "A thread that kept showing up:",
  contradiction: "Something your week kept revealing:",
  weekly_receipt: "What this week kept trying to say:",
};

export function InsightCard({ insight, evidenceMap, variant = "note" }: InsightCardProps) {
  const isJournal = variant === "journal";

  return (
    <article
      className={
        isJournal
          ? "rounded-[2rem] bg-transparent"
          : "rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/8 to-white/[0.03] p-6"
      }
    >
      {!isJournal ? <p className="text-sm italic leading-6 text-zinc-500">{intros[insight.type] ?? "What your entries suggest:"}</p> : null}
      <h2 className={isJournal ? "text-3xl font-semibold tracking-tight text-amber-50" : "mt-2 text-2xl font-semibold tracking-tight text-white"}>
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
                  {evidence?.dateKey ? <ManageNoteMenu entryId={entryId} dateKey={evidence.dateKey} /> : null}
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
