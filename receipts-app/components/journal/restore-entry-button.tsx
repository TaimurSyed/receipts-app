"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { restoreEntry } from "@/app/journal/entry-actions";

export function RestoreEntryButton({ entryId, dateKey }: { entryId: string; dateKey: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await restoreEntry(entryId, dateKey);
            setMessage(result.message);
            router.refresh();
          })
        }
        className="rounded-full bg-[#e7d8b4] px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
      >
        Restore
      </button>
      {message ? <p className="text-[11px] text-zinc-500">{message}</p> : null}
    </div>
  );
}
