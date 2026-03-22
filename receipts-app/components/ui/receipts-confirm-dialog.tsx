"use client";

import { Flame, X } from "lucide-react";

export function ReceiptsConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  busy = false,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button aria-label="Close confirmation" className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={onCancel} />

      <div className="notebook-page-edge notebook-paper relative z-[1] w-full max-w-md rounded-[2rem] border border-[#5a4b3f] bg-[linear-gradient(180deg,#1b1713_0%,#110f0d_100%)] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-full border border-[#5a4b3f] p-2 text-zinc-400 transition hover:bg-white/5 hover:text-zinc-200"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full border border-rose-900/60 bg-rose-950/30 text-rose-200">
            <Flame className="h-5 w-5" />
          </div>
          <div className="pr-8">
            <p className="text-xs uppercase tracking-[0.24em] text-rose-200/70">Final action</p>
            <h3 className="mt-2 font-serif text-3xl text-[#f5ecd8]">{title}</h3>
            <p className="mt-4 text-sm leading-7 text-zinc-400">{description}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={busy}
            className="rounded-full border border-[#5a4b3f] bg-[#171411] px-4 py-2 text-sm font-semibold text-[#f1e7d4] transition hover:bg-white/5 disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="rounded-full bg-rose-200 px-4 py-2 text-sm font-semibold text-black transition hover:bg-rose-100 disabled:opacity-60"
          >
            {busy ? "Burning..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
