"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ExternalLink, Layers3, X } from "lucide-react";
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

  return (
    <>
      <div className="space-y-4">
        <button
          onClick={() => setOpen(true)}
          className="deck-toggle living-note flex w-full items-center justify-between rounded-[1.7rem] border border-[#4f4338] bg-[#17130f]/85 px-5 py-4 text-left transition hover:bg-[#1b1612]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#5a4b3f] bg-white/[0.04] text-amber-200">
              <Layers3 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Supporting threads</p>
              <h3 className="mt-1 font-serif text-2xl text-[#f1e7d4]">Other things your behavior was saying</h3>
              <p className="mt-1 text-sm text-zinc-400">{notes.length} tucked pages waiting underneath.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-zinc-400">
            <span className="rounded-full border border-[#5a4b3f] px-3 py-1 text-xs uppercase tracking-[0.16em] text-zinc-300">
              Open deck
            </span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </button>

        <div className="deck-stack px-1 pb-1 pt-2">
          {notes.slice(0, 3).map((insight, index) => (
            <div
              key={insight.id}
              className={`deck-card-preview ${index === 0 ? "z-30" : index === 1 ? "z-20" : "z-10"}`}
              style={{
                transform: `translateY(${index * 14}px) scale(${1 - index * 0.03}) rotate(${index % 2 === 0 ? -0.35 : 0.28}deg)`,
              }}
            >
              <div className="pointer-events-none rounded-[1.6rem] border border-[#4f4338] bg-[linear-gradient(180deg,#17130f_0%,#120f0d_100%)] px-5 py-4 shadow-[0_18px_36px_rgba(0,0,0,0.22)]">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{insight.type === "contradiction" ? "Contradiction" : "Thread"}</p>
                <h4 className="mt-2 font-serif text-xl text-[#f1e7d4]">{insight.title}</h4>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">{insight.body}</p>
              </div>
            </div>
          ))}
          {notes.length > 3 ? (
            <div className="pt-[3.6rem] text-center text-sm text-zinc-500">+ {notes.length - 3} more tucked underneath</div>
          ) : (
            <div className="pt-[3.6rem] text-center text-sm text-zinc-500">Tap to open the deck</div>
          )}
        </div>
      </div>

      {open ? (
        <div className="deck-overlay fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
          <button className="absolute inset-0 bg-black/75 backdrop-blur-[3px]" onClick={() => setOpen(false)} aria-label="Close supporting notes deck" />

          <div className="notebook-page-edge notebook-paper relative z-[1] flex h-[min(88vh,52rem)] w-full max-w-[min(94vw,96rem)] flex-col rounded-[2.2rem] border border-[#5a4b3f] bg-[linear-gradient(180deg,#17130f_0%,#0f0d0b_100%)] p-5 sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-[#5e503f]/35 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Supporting threads</p>
                <h3 className="mt-2 font-serif text-3xl text-[#f5ecd8]">Spread across the table</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-400">Browse left to right without stretching the actual journal page underneath.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-[#5a4b3f] px-3 py-1 text-xs uppercase tracking-[0.16em] text-zinc-300">
                  {notes.length} cards
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-[#5a4b3f] p-2 text-zinc-300 transition hover:bg-white/5"
                  aria-label="Close deck"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="deck-overlay-rail flex-1 overflow-x-auto overflow-y-auto pb-3 pr-1">
              <div className="deck-overlay-track flex min-w-max items-start gap-5 pr-4">
                {notes.map((insight, index) => (
                  <div key={insight.id} className={`deck-overlay-card ${index % 3 === 0 ? "pt-0" : index % 3 === 1 ? "pt-5" : "pt-10"}`}>
                    <div className="deck-overlay-card-inner">
                      <InsightCard insight={insight} evidenceMap={evidenceMap} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[#5e503f]/25 pt-3 text-sm text-zinc-500">
              <span className="inline-flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Swipe or scroll sideways through the tucked notes.
              </span>
              <button onClick={() => setOpen(false)} className="text-zinc-300 transition hover:text-white">
                Back to page
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
