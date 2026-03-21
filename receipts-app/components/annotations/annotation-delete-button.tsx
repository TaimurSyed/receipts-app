"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteAnnotation } from "@/app/journal/entry-actions";

export function AnnotationDeleteButton({ annotationId, pageType, pageKey }: { annotationId: string; pageType: "week" | "day"; pageKey: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={pending}
        onClick={() => {
          if (!confirm("Delete this margin note?")) return;
          startTransition(async () => {
            const result = await deleteAnnotation(annotationId, pageType, pageKey);
            setMessage(result.message);
            router.refresh();
          });
        }}
        className="rounded-full border border-rose-900/60 px-3 py-1 text-xs text-rose-200 disabled:opacity-60"
      >
        Delete
      </button>
      {message ? <span className="text-[11px] text-zinc-500">{message}</span> : null}
    </div>
  );
}
