"use client";

import { useActionState, useEffect, useRef } from "react";
import { Image as ImageIcon } from "lucide-react";
import { createImageEntry } from "@/app/app/actions";

const initialState = { ok: false, message: "" };

export function ImageEntryForm() {
  const [state, formAction, pending] = useActionState(createImageEntry, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Picture note</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Drop in a picture or screenshot</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Add an image with a little context and let it live inside the notebook like any other entry.
          </p>
        </div>
        <ImageIcon className="h-5 w-5 text-amber-300" />
      </div>

      <form ref={formRef} action={formAction} className="mt-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Image file</label>
          <input
            name="image"
            type="file"
            accept="image/*"
            className="block w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-300 file:mr-4 file:rounded-full file:border-0 file:bg-amber-300 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Add a note with it</label>
          <textarea
            name="content"
            className="min-h-28 w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-white outline-none placeholder:text-zinc-500"
            placeholder="What was this picture about?"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">How did this feel?</label>
            <select name="mood" defaultValue="3" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none">
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
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
              placeholder="image, screenshot, memory"
            />
          </div>
        </div>
        <button disabled={pending} className="w-full rounded-full bg-amber-300 px-5 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-70">
          {pending ? "Saving..." : "Save picture note"}
        </button>
        {state.message ? <p className="text-sm text-zinc-400">{state.message}</p> : null}
      </form>
    </section>
  );
}
