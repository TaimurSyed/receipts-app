"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { archiveEntry, deleteEntry } from "@/app/journal/entry-actions";

export function EntryActionsMenu({ entryId, date }: { entryId: string; date: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        <button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await archiveEntry(entryId, date);
              setMessage(result.message);
              router.refresh();
            })
          }
          className="rounded-full border border-[#5a4b3f] px-3 py-1 text-xs text-zinc-300 disabled:opacity-60"
        >
          Archive
        </button>
        <button
          disabled={pending}
          onClick={() => {
            if (!confirm("Delete this note? This cannot be undone.")) return;
            startTransition(async () => {
              const result = await deleteEntry(entryId, date);
              setMessage(result.message);
              router.refresh();
            });
          }}
          className="rounded-full border border-rose-900/60 px-3 py-1 text-xs text-rose-200 disabled:opacity-60"
        >
          Delete
        </button>
      </div>
      {message ? <p className="text-[11px] text-zinc-500">{message}</p> : null}
    </div>
  );
}
