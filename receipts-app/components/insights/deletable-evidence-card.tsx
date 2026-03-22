"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteEntry } from "@/app/journal/entry-actions";
import { ImageNote } from "@/components/app/image-note";
import { VoicePlayback } from "@/components/app/voice-playback";
import { ManageNoteMenu } from "@/components/insights/manage-note-menu";
import { getDeleteDialogTitle } from "@/lib/delete-copy";
import type { EvidenceSnippet } from "@/lib/insights";

export function DeletableEvidenceCard({
  entryId,
  evidence,
  relatedHref,
  stackClass,
}: {
  entryId: string;
  evidence: EvidenceSnippet;
  relatedHref: string;
  stackClass: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    window.setTimeout(async () => {
      await deleteEntry(entryId, evidence.dateKey);
      router.refresh();
    }, 420);
  };

  const deleteTitle = getDeleteDialogTitle({
    title: evidence.title,
    content: evidence.content,
    type: evidence.type,
    mood: null,
  });

  return (
    <div className={`delete-tear-target evidence-deck-card living-note ${stackClass} notebook-panel rounded-2xl border border-white/10 bg-white/[0.03] p-4 ${isDeleting ? "tear-delete" : ""}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium text-white">{evidence.archived ? "This note is archived" : evidence.title}</p>
        <span className="text-xs text-zinc-500">{evidence.createdAt}</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{evidence.content}</p>

      {evidence.type === "voice" && evidence.audioUrl ? <VoicePlayback url={evidence.audioUrl} /> : null}
      {evidence.type === "image" && evidence.imageUrl ? <ImageNote url={evidence.imageUrl} compact /> : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link href={`/journal/${evidence.dateKey}`} className="rounded-full border border-[#5a4b3f] px-3 py-1 text-xs text-zinc-300 transition hover:bg-white/5">
          Open day
        </Link>
        <Link href={relatedHref} className="rounded-full border border-[#5a4b3f] px-3 py-1 text-xs text-zinc-300 transition hover:bg-white/5">
          See related entries
        </Link>
        {evidence.type ? (
          <Link href={`/app/timeline?type=${encodeURIComponent(evidence.type)}`} className="rounded-full border border-[#5a4b3f] px-3 py-1 text-xs text-zinc-300 transition hover:bg-white/5">
            More {evidence.type} notes
          </Link>
        ) : null}
      </div>

      <div className="mt-4">
        <ManageNoteMenu entryId={entryId} dateKey={evidence.dateKey} archived={evidence.archived} deleteTitle={deleteTitle} onDelete={handleDelete} deleting={isDeleting} />
      </div>
    </div>
  );
}
