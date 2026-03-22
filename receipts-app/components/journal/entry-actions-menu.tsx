"use client";

import { ArchiveX, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { archiveEntry } from "@/app/journal/entry-actions";
import { ReceiptsConfirmDialog } from "@/components/ui/receipts-confirm-dialog";

export function EntryActionsMenu({
  entryId,
  date,
  deleteTitle = "Burn this page?",
  onDelete,
  deleting = false,
}: {
  entryId: string;
  date: string;
  deleteTitle?: string;
  onDelete?: () => void | Promise<void>;
  deleting?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <button
            disabled={pending || deleting}
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
            disabled={pending || deleting}
            title="Delete note"
            onClick={() => setConfirmOpen(true)}
            className="rounded-full border border-rose-900/60 p-2 text-rose-200 transition hover:bg-rose-950/20 disabled:opacity-60"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {message ? <p className="text-[11px] text-zinc-500">{message}</p> : null}
      </div>

      <ReceiptsConfirmDialog
        open={confirmOpen}
        title={deleteTitle}
        description="This page won’t come back once it’s gone."
        confirmLabel="Burn it"
        cancelLabel="Keep the page"
        busy={deleting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          void onDelete?.();
        }}
      />
    </>
  );
}
