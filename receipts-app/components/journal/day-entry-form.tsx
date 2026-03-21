"use client";

import { useActionState, useEffect, useRef } from "react";
import { createEntry } from "@/app/app/actions";

const initialState = { ok: false, message: "" };

export function DayEntryForm({ date }: { date: string }) {
  const [state, formAction, pending] = useActionState(createEntry, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <section className="rounded-[2rem] border border-[#4f4338] bg-[#15120f] p-5">
      <div className="border-b border-[#5e503f]/30 pb-4">
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Add to this day</p>
        <h3 className="mt-2 font-serif text-2xl text-[#f1e7d4]">Write into the page later</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Add a note directly to this date, even if you’re filling it in after the fact.
        </p>
      </div>

      <form ref={formRef} action={formAction} className="mt-4 space-y-4">
        <input type="hidden" name="entryDate" value={date} />
        <input type="hidden" name="contextLabel" value="Note for this day" />
        <textarea
          name="content"
          className="min-h-32 w-full rounded-2xl border border-[#5a4b3f] bg-[#110f0d] p-4 text-zinc-200 outline-none placeholder:text-zinc-600"
          placeholder="What do you want to add to this day now that you’re looking back at it?"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <select name="mood" defaultValue="3" className="rounded-2xl border border-[#5a4b3f] bg-[#110f0d] px-4 py-3 text-zinc-200 outline-none">
            <option value="1">Very low</option>
            <option value="2">Low</option>
            <option value="3">Neutral</option>
            <option value="4">Good</option>
            <option value="5">Great</option>
          </select>
          <input
            name="tags"
            className="rounded-2xl border border-[#5a4b3f] bg-[#110f0d] px-4 py-3 text-zinc-200 outline-none placeholder:text-zinc-600"
            placeholder="Tags: hindsight, stress, work"
          />
        </div>
        <button
          disabled={pending}
          className="rounded-full bg-[#e7d8b4] px-5 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Saving..." : "Add note to this day"}
        </button>
        {state.message ? <p className="text-sm text-zinc-400">{state.message}</p> : null}
      </form>
    </section>
  );
}
