"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { archiveEntry, deleteEntry, restoreEntry } from "@/app/journal/entry-actions";

export function ManageNoteMenu({ entryId, dateKey, archived = false }: { entryId: string; dateKey: string; archived?: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  return (
    <div className="mt-3 flex flex-col items-start gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={archived ? "/journal/archive" : `/journal/${dateKey}`}
          className="rounded-full border border-[#5a4b3f] px-3 py-1 text-xs text-zinc-300 transition hover:bg-white/5"
        >
          {archived ? "Open archive" : "Open day"}
        </Link>
        {archived ? (
          <button
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const result = await restoreEntry(entryId, dateKey);
                setMessage(result.message);
                router.refresh();
              })
            }
            className="rounded-full border border-[#5a4b3f] px-3 py-1 text-xs text-zinc-300 disabled:opacity-60"
          >
            Manage note: restore
          </button>
        ) : (
          <button
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const result = await archiveEntry(entryId, dateKey);
                setMessage(result.message);
                router.refresh();
              })
            }
            className="rounded-full border border-[#5a4b3f] px-3 py-1 text-xs text-zinc-300 disabled:opacity-60"
          >
            Manage note: archive
          </button>
        )}
        <button
          disabled={pending}
          onClick={() => {
            if (!confirm("Delete this note? This cannot be undone.")) return;
            startTransition(async () => {
              const result = await deleteEntry(entryId, dateKey);
              setMessage(result.message);
              router.refresh();
            });
          }}
          className="rounded-full border border-rose-900/60 px-3 py-1 text-xs text-rose-200 disabled:opacity-60"
        >
          Manage note: delete
        </button>
      </div>
      {message ? <p className="text-[11px] text-zinc-500">{message}</p> : null}
    </div>
  );
}
