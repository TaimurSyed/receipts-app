"use client";

import { useActionState, useEffect, useRef } from "react";
import { createAnnotation } from "@/app/annotations/actions";
import type { PageAnnotation } from "@/lib/annotations";

export type ActionState = {
  ok: boolean;
  message: string;
};

const initialState: ActionState = { ok: false, message: "" };

export function AnnotationPanel({
  pageType,
  pageKey,
  annotations,
  prompt,
}: {
  pageType: "week" | "day";
  pageKey: string;
  annotations: PageAnnotation[];
  prompt: string;
}) {
  const [state, formAction, pending] = useActionState(createAnnotation, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <section className="rounded-[2rem] border border-[#4f4338] bg-[#15120f] p-5">
      <div className="border-b border-[#5e503f]/30 pb-4">
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Talk back to the page</p>
        <h3 className="mt-2 font-serif text-2xl text-[#f1e7d4]">Margin notes</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{prompt}</p>
      </div>

      <form ref={formRef} action={formAction} className="mt-4 space-y-3">
        <input type="hidden" name="pageType" value={pageType} />
        <input type="hidden" name="pageKey" value={pageKey} />
        <textarea
          name="body"
          className="min-h-28 w-full rounded-2xl border border-[#5a4b3f] bg-[#110f0d] p-4 text-zinc-200 outline-none placeholder:text-zinc-600"
          placeholder="Write back to the page. Correct it, expand on it, argue with it, or leave a note for future-you."
        />
        <button
          disabled={pending}
          className="rounded-full bg-[#e7d8b4] px-5 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Saving..." : "Save margin note"}
        </button>
        {state.message ? <p className="text-sm text-zinc-400">{state.message}</p> : null}
      </form>

      <div className="mt-6 space-y-3">
        {annotations.length > 0 ? (
          annotations.map((annotation) => (
            <article key={annotation.id} className="rounded-2xl border border-[#4f4338] bg-[#110f0d] p-4">
              <p className="whitespace-pre-line text-sm leading-7 text-zinc-300">{annotation.body}</p>
              <p className="mt-3 text-xs text-zinc-500">{annotation.createdAt}</p>
            </article>
          ))
        ) : (
          <p className="text-sm text-zinc-500">No margin notes yet.</p>
        )}
      </div>
    </section>
  );
}
