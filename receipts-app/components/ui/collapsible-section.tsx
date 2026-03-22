"use client";

import { useState, type ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function CollapsibleSection({ title, subtitle, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-[1.8rem] border border-[#4f4338] bg-[#15120f]/70 sm:rounded-[2rem]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-6"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{title}</p>
          {subtitle ? <p className="mt-2 text-sm leading-6 text-zinc-400">{subtitle}</p> : null}
        </div>
        <span className="shrink-0 rounded-full border border-[#5a4b3f] px-3 py-1 text-xs text-zinc-300">
          {open ? "Collapse" : "Expand"}
        </span>
      </button>

      {open ? <div className="border-t border-[#5e503f]/25 px-4 py-5 sm:px-6">{children}</div> : null}
    </section>
  );
}