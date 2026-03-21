"use client";

import { useActionState, useEffect, useRef } from "react";
import { createEntry } from "@/app/app/actions";

const initialState = { ok: false, message: "" };

export function QuickAddForm({ date, compact = false }: { date: string; compact?: boolean }) {
  const [state, formAction, pending] = useActionState(createEntry, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="entryDate" value={date} />
      <input type="hidden" name="contextLabel" value="Calendar note" />
      <textarea
        name="content"
        className={`w-full rounded-2xl border border-[#5a4b3f] bg-[#110f0d] p-4 text-zinc-200 outline-none placeholder:text-zinc-600 ${compact ? "min-h-24" : "min-h-32"}`}
        placeholder="Write something into this date..."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">How did this feel?</label>
          <select name="mood" defaultValue="3" className="w-full rounded-2xl border border-[#5a4b3f] bg-[#110f0d] px-4 py-3 text-zinc-200 outline-none">
            <option value="1">Very low — rough / overwhelmed</option>
            <option value="2">Low — tense / drained</option>
            <option value="3">Neutral — ordinary / hard to read</option>
            <option value="4">Good — calm / decent</option>
            <option value="5">Great — energized / strong</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Tags</label>
          <input
            name="tags"
            className="w-full rounded-2xl border border-[#5a4b3f] bg-[#110f0d] px-4 py-3 text-zinc-200 outline-none placeholder:text-zinc-600"
            placeholder="hindsight, work"
          />
        </div>
      </div>
      <button
        disabled={pending}
        className="rounded-full bg-[#e7d8b4] px-5 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Saving..." : "Save note to this date"}
      </button>
      {state.message ? <p className="text-sm text-zinc-400">{state.message}</p> : null}
    </form>
  );
}
