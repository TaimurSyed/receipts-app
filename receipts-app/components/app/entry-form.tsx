"use client";

import { useActionState, useEffect, useRef } from "react";
import { CalendarRange } from "lucide-react";
import { createEntry } from "@/app/app/actions";

export type ActionState = {
  ok: boolean;
  message: string;
};

const initialState: ActionState = {
  ok: false,
  message: "",
};

export function EntryForm() {
  const [state, formAction, pending] = useActionState(createEntry, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Quick capture</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Log something before you forget it</h2>
        </div>
        <CalendarRange className="h-5 w-5 text-amber-300" />
      </div>

      <form ref={formRef} action={formAction} className="mt-6 space-y-4">
        <textarea
          name="content"
          className="min-h-36 w-full rounded-3xl border border-white/10 bg-black/20 p-4 text-white outline-none placeholder:text-zinc-500"
          placeholder="What happened, what triggered it, and what felt off?"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <select name="mood" defaultValue="3" className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none">
            <option value="1">Very low</option>
            <option value="2">Low</option>
            <option value="3">Neutral</option>
            <option value="4">Good</option>
            <option value="5">Great</option>
          </select>
          <input
            name="tags"
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
            placeholder="Tags: work, stress, money"
          />
        </div>
        <button disabled={pending} className="w-full rounded-full bg-amber-300 px-5 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-70">
          {pending ? "Saving..." : "Save entry"}
        </button>
        {state.message ? (
          <p className={`text-sm ${state.ok ? "text-emerald-300" : "text-zinc-400"}`}>{state.message}</p>
        ) : null}
      </form>
    </div>
  );
}
