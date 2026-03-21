"use client";

import { ArchiveX, X } from "lucide-react";
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
          title="Archive note"
          onClick={() =>
            startTransition(async () => {
              const result = await archiveEntry(entryId, date);
              setMessage(result.message);
              router.refresh();
            })
          }
          className="rounded-full border border-[#5a4b3f] p-2 text-zinc-300 transition hover:bg-white/5 disabled:opacity-60"
        >
          <ArchiveX className="h-4 w-4" />
        </button>
        <button
          disabled={pending}
          title="Delete note"
          onClick={() => {
            if (!confirm("Delete this note? This cannot be undone.")) return;
            startTransition(async () => {
              const result = await deleteEntry(entryId, date);
              setMessage(result.message);
              router.refresh();
            });
          }}
          className="rounded-full border border-rose-900/60 p-2 text-rose-200 transition hover:bg-rose-950/20 disabled:opacity-60"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {message ? <p className="text-[11px] text-zinc-500">{message}</p> : null}
    </div>
  );
}
