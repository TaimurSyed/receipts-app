"use client";

import { useEffect, useState } from "react";
import { AnnotationPanel } from "@/components/annotations/annotation-panel";
import type { PageAnnotation } from "@/lib/annotations";

export function AnnotationOverlayLauncher({
  title,
  subtitle,
  count,
  pageType,
  pageKey,
  annotations,
  prompt,
}: {
  title: string;
  subtitle: string;
  count: number;
  pageType: "week" | "day";
  pageKey: string;
  annotations: PageAnnotation[];
  prompt: string;
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

  return (
    <>
      <section className="rounded-[1.8rem] border border-[#4f4338] bg-[#15120f]/80 p-4 sm:p-5">
        <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{title}</p>
        <p className="mt-2 text-sm leading-7 text-zinc-400">{subtitle}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xs text-zinc-500">{count} note{count === 1 ? "" : "s"} in the margin</span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full border border-[#5a4b3f] bg-[#1a1714] px-4 py-2 text-sm font-semibold text-[#f1e7d4] transition hover:bg-[#211c18]"
          >
            Open conversation
          </button>
        </div>
      </section>

      {open ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6">
          <button
            type="button"
            className="absolute inset-0 bg-black/75 backdrop-blur-[3px]"
            onClick={() => setOpen(false)}
            aria-label="Close margin conversation"
          />

          <div className="notebook-page-edge notebook-paper relative z-[1] flex h-[min(90vh,56rem)] w-full max-w-[min(96vw,88rem)] flex-col rounded-[2rem] border border-[#5a4b3f] bg-[linear-gradient(180deg,#17130f_0%,#0f0d0b_100%)] p-4 sm:rounded-[2.4rem] sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-[#5e503f]/35 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{title}</p>
                <h3 className="mt-2 font-serif text-3xl text-[#f5ecd8]">A longer conversation in the margin</h3>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
                  Step into the back-and-forth here, then close it and drop right back into the chapter spread.
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

            <div className="flex-1 overflow-y-auto pr-1">
              <AnnotationPanel
                pageType={pageType}
                pageKey={pageKey}
                annotations={annotations}
                prompt={prompt}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
