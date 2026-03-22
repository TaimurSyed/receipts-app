"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { createAnnotation } from "@/app/annotations/actions";
import type { PageAnnotation } from "@/lib/annotations";
import { AnnotationDeleteButton } from "@/components/annotations/annotation-delete-button";

export type ActionState = {
  ok: boolean;
  message: string;
};

const initialState: ActionState = { ok: false, message: "" };

type AnnotationThreadNode = {
  annotation: PageAnnotation;
  replies: AnnotationThreadNode[];
};

type ComposerProps = {
  pageType: "week" | "day";
  pageKey: string;
  submitLabel: string;
  placeholder: string;
  replyTo?: string;
  compact?: boolean;
  onSuccess?: () => void;
};

function buildThreads(annotations: PageAnnotation[]): AnnotationThreadNode[] {
  const ordered = [...annotations].sort(
    (a, b) => new Date(a.createdAtRaw).getTime() - new Date(b.createdAtRaw).getTime(),
  );
  const nodes = new Map<string, AnnotationThreadNode>(
    ordered.map((annotation) => [annotation.id, { annotation, replies: [] }]),
  );
  const roots: AnnotationThreadNode[] = [];

  for (const annotation of ordered) {
    const node = nodes.get(annotation.id)!;
    if (annotation.replyTo && nodes.has(annotation.replyTo)) {
      nodes.get(annotation.replyTo)!.replies.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots.reverse();
}

function AnnotationComposer({
  pageType,
  pageKey,
  submitLabel,
  placeholder,
  replyTo,
  compact = false,
  onSuccess,
}: ComposerProps) {
  const [state, formAction, pending] = useActionState(createAnnotation, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      onSuccess?.();
    }
  }, [onSuccess, state.ok]);

  return (
    <form ref={formRef} action={formAction} className={compact ? "space-y-2" : "mt-4 space-y-3"}>
      <input type="hidden" name="pageType" value={pageType} />
      <input type="hidden" name="pageKey" value={pageKey} />
      {replyTo ? <input type="hidden" name="replyTo" value={replyTo} /> : null}
      <textarea
        name="body"
        className={`w-full rounded-2xl border border-[#5a4b3f] bg-[#110f0d] text-zinc-200 outline-none placeholder:text-zinc-600 ${compact ? "min-h-24 px-4 py-3 text-sm leading-6" : "min-h-28 p-4"}`}
        placeholder={placeholder}
      />
      <div className={`flex flex-wrap items-center gap-3 ${compact ? "pt-1" : ""}`}>
        <button
          disabled={pending}
          className={`rounded-full bg-[#e7d8b4] font-semibold text-black disabled:cursor-not-allowed disabled:opacity-70 ${compact ? "px-4 py-2 text-xs sm:text-sm" : "px-5 py-3 text-sm"}`}
        >
          {pending ? "Saving..." : submitLabel}
        </button>
        {state.message ? <p className="text-sm text-zinc-400">{state.message}</p> : null}
      </div>
    </form>
  );
}

function ThreadNodeCard({
  node,
  pageType,
  pageKey,
  depth = 0,
}: {
  node: AnnotationThreadNode;
  pageType: "week" | "day";
  pageKey: string;
  depth?: number;
}) {
  const [replying, setReplying] = useState(false);
  const isAi = node.annotation.author === "ai";

  return (
    <div className={depth === 0 ? "" : "mt-3 border-l border-[#6a5847]/40 pl-3 sm:pl-4"}>
      <div
        className={`rounded-2xl border p-4 sm:p-5 ${
          isAi ? "border-[#6a5847] bg-[#191613]" : "border-[#4f4338] bg-[#110f0d]"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
              {isAi ? "Notebook callback" : depth === 0 ? "Your note" : "Follow-up note"}
            </p>
            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-zinc-300">{node.annotation.body}</p>
            <p className="mt-3 text-xs text-zinc-500">{node.annotation.createdAt}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setReplying((value) => !value)}
              className="rounded-full border border-[#5a4b3f] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-zinc-300 transition hover:bg-white/5"
            >
              {replying ? "Close" : "Reply"}
            </button>
            {!isAi ? (
              <AnnotationDeleteButton annotationId={node.annotation.id} pageType={pageType} pageKey={pageKey} />
            ) : null}
          </div>
        </div>

        {replying ? (
          <div className="mt-4 rounded-[1.4rem] border border-[#4f4338] bg-[#0f0d0b]/70 p-3 sm:p-4">
            <AnnotationComposer
              pageType={pageType}
              pageKey={pageKey}
              replyTo={node.annotation.id}
              compact
              submitLabel="Save reply"
              placeholder="Write back to this specific thread instead of starting a new one."
              onSuccess={() => setReplying(false)}
            />
          </div>
        ) : null}
      </div>

      {node.replies.length > 0 ? (
        <div className="mt-3">
          {node.replies.map((reply) => (
            <ThreadNodeCard key={reply.annotation.id} node={reply} pageType={pageType} pageKey={pageKey} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

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
  const threads = useMemo(() => buildThreads(annotations), [annotations]);

  return (
    <section className="rounded-[1.8rem] border border-[#4f4338] bg-[#15120f] p-4 sm:rounded-[2rem] sm:p-5">
      <div className="border-b border-[#5e503f]/30 pb-4">
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Talk back to the page</p>
        <h3 className="mt-2 font-serif text-2xl text-[#f1e7d4]">Margin notes</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{prompt}</p>
      </div>

      <AnnotationComposer
        pageType={pageType}
        pageKey={pageKey}
        submitLabel="Save margin note"
        placeholder="Write back to the page. Correct it, expand on it, argue with it, or leave a note for future-you."
      />

      <div className="mt-6 space-y-4">
        {threads.length > 0 ? (
          threads.map((thread) => (
            <article key={thread.annotation.id} className="rounded-[1.6rem] border border-[#4f4338] bg-[#110f0d] p-3 sm:p-4">
              <ThreadNodeCard node={thread} pageType={pageType} pageKey={pageKey} />
            </article>
          ))
        ) : (
          <p className="text-sm text-zinc-500">No margin notes yet.</p>
        )}
      </div>
    </section>
  );
}
