"use client";

import Link from "next/link";
import { ArchiveRestore, ArchiveX, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { archiveEntry, deleteEntry, restoreEntry } from "@/app/journal/entry-actions";

export function ManageNoteMenu({ entryId, dateKey, archived = false }: { entryId: string; dateKey: string; archived?: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  return (
    <div className="mt-3 flex flex-col items-start gap-2">
      <div className="flex w-full items-start justify-between gap-3">
        <button
          disabled={pending}
          title={archived ? "Restore note" : "Archive note"}
          onClick={() =>
            startTransition(async () => {
              const result = archived ? await restoreEntry(entryId, dateKey) : await archiveEntry(entryId, dateKey);
              setMessage(result.message);
              router.refresh();
            })
          }
          className="rounded-full border border-[#5a4b3f] p-2 text-zinc-300 transition hover:bg-white/5 disabled:opacity-60"
        >
          {archived ? <ArchiveRestore className="h-4 w-4" /> : <ArchiveX className="h-4 w-4" />}
        </button>

        <button
          disabled={pending}
          title="Delete note"
          onClick={() => {
            if (!confirm("Delete this note? This cannot be undone.")) return;
            startTransition(async () => {
              const result = await deleteEntry(entryId, dateKey);
              setMessage(result.message);
              router.refresh();
            });
          }}
          className="rounded-full border border-rose-900/60 p-2 text-rose-200 transition hover:bg-rose-950/20 disabled:opacity-60"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <Link
        href={archived ? "/journal/archive" : `/journal/${dateKey}`}
        className="text-xs text-zinc-500 transition hover:text-zinc-300"
      >
        {archived ? "Open archive" : "Open day"}
      </Link>

      {message ? <p className="text-[11px] text-zinc-500">{message}</p> : null}
    </div>
  );
}
