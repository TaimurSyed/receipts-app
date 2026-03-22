"use client";

import { useEffect, useState } from "react";
import { InsightCard } from "@/components/insights/insight-card";
import type { EvidenceSnippet, InsightRecord } from "@/lib/insights";

export function SupportingNotesDeck({
  notes,
  evidenceMap,
}: {
  notes: InsightRecord[];
  evidenceMap: Record<string, EvidenceSnippet>;
}) {
  const [open, setOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(notes[0]?.id ?? null);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (notes.length === 0) {
    return (
      <div className="rounded-[2rem] border border-[#4f4338] bg-[#15120f]/80 p-6 text-zinc-400">
        Nothing else strong enough to surface yet. That is fine — this notebook should be selective, not chatty.
      </div>
    );
  }

  const activeInsight = notes.find((insight) => insight.id === openId) ?? notes[0];

  return (
    <>
      <section className="space-y-4">
        <div className="rounded-[1.8rem] border border-[#4f4338] bg-[#15120f]/80 p-4 sm:p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Margin threads</p>
          <p className="mt-2 text-sm leading-7 text-zinc-400">
            Open the side-thread table when you want the deck view, without squeezing it into the weekly spread.
          </p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-xs text-zinc-500">{notes.length} thread{notes.length === 1 ? "" : "s"} nearby</span>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-full border border-[#5a4b3f] bg-[#1a1714] px-4 py-2 text-sm font-semibold text-[#f1e7d4] transition hover:bg-[#211c18]"
            >
              Open margin threads
            </button>
          </div>
        </div>
      </section>

      {open ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6">
          <button
            type="button"
            className="absolute inset-0 bg-black/75 backdrop-blur-[3px]"
            onClick={() => setOpen(false)}
            aria-label="Close margin threads"
          />

          <div className="notebook-page-edge notebook-paper relative z-[1] flex h-[min(90vh,56rem)] w-full max-w-[min(96vw,92rem)] flex-col rounded-[2rem] border border-[#5a4b3f] bg-[linear-gradient(180deg,#17130f_0%,#0f0d0b_100%)] p-4 sm:rounded-[2.4rem] sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-[#5e503f]/35 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Margin threads</p>
                <h3 className="mt-2 font-serif text-3xl text-[#f5ecd8]">A table of nearby side reads</h3>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
                  Flick through the nearby threads here, then drop right back into the weekly page when you’re done.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-[#5a4b3f] px-4 py-2 text-sm font-semibold text-[#f1e7d4] transition hover:bg-white/5"
              >
                Close
              </button>
            </div>

            <div className="-mx-1 overflow-x-auto px-1 pb-3">
              <div className="flex min-w-max gap-4 pr-2">
                {notes.map((insight, index) => {
                  const isSelected = insight.id === activeInsight.id;
                  const preview = insight.body.length > 160 ? `${insight.body.slice(0, 160).trim()}…` : insight.body;

                  return (
                    <button
                      key={insight.id}
                      type="button"
                      onClick={() => setOpenId(insight.id)}
                      className={`w-[280px] shrink-0 rounded-[1.7rem] border px-4 py-4 text-left transition sm:w-[320px] ${
                        isSelected
                          ? "border-[#dbc59b]/45 bg-[#1b1612] shadow-[0_18px_36px_rgba(0,0,0,0.22)]"
                          : "border-[#4f4338] bg-[#15120f]/78 hover:bg-[#1a1511]"
                      } ${index % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.4deg]"}`}
                    >
                      <p className="text-[10px] uppercase tracking-[0.2em] text-amber-200/60">
                        {insight.type === "contradiction" ? "Underlined tension" : insight.type === "pattern" ? "Nearby thread" : "Margin read"}
                      </p>
                      <h4 className="mt-2 font-serif text-xl text-[#f1e7d4]">{insight.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">{preview}</p>
                      <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                        <span>{insight.evidence.length} quoted note{insight.evidence.length === 1 ? "" : "s"}</span>
                        <span className="rounded-full border border-[#5a4b3f] px-2 py-1 text-zinc-300">
                          {isSelected ? "Open" : "Preview"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-2 flex-1 overflow-y-auto pr-1">
              <div className="rounded-[1.8rem] border border-[#4f4338] bg-[#15120f]/80 p-4 sm:p-5">
                <InsightCard insight={activeInsight} evidenceMap={evidenceMap} variant="margin" />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
