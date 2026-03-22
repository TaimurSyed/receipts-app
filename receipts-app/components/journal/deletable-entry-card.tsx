"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteEntry } from "@/app/journal/entry-actions";
import { ImageNote } from "@/components/app/image-note";
import { VoicePlayback } from "@/components/app/voice-playback";
import { EntryActionsMenu } from "@/components/journal/entry-actions-menu";
import { getDeleteDialogTitle } from "@/lib/delete-copy";

type Props = {
  entry: {
    id: string;
    title: string | null;
    content: string;
    created_at: string;
    mood_score: number | null;
    tags: string[] | null;
    type: string | null;
  };
  date: string;
  playbackUrl?: string | null;
  imageUrl?: string | null;
};

export function DeletableEntryCard({ entry, date, playbackUrl, imageUrl }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    window.setTimeout(async () => {
      await deleteEntry(entry.id, date);
      router.refresh();
    }, 420);
  };

  const deleteTitle = getDeleteDialogTitle({
    title: entry.title,
    content: entry.content,
    type: entry.type,
    mood: entry.mood_score,
  });

  return (
    <article className={`delete-tear-target rounded-[1.8rem] border border-[#4f4338] bg-[#15120f]/85 p-5 ${isDeleting ? "tear-delete" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[#f1e7d4]">{entry.title || "Untitled entry"}</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {new Date(entry.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
          </p>
        </div>
        <EntryActionsMenu entryId={entry.id} date={date} deleteTitle={deleteTitle} onDelete={handleDelete} deleting={isDeleting} />
      </div>
      <div className="mt-3">
        <span className="rounded-full border border-[#5a4b3f] px-3 py-1 text-xs text-zinc-400">Mood {entry.mood_score ?? 3}/5</span>
      </div>
      <p className="mt-5 whitespace-pre-line font-serif text-[17px] leading-8 text-zinc-200">{entry.content}</p>
      {entry.type === "voice" && playbackUrl ? <VoicePlayback url={playbackUrl} /> : null}
      {entry.type === "image" && imageUrl ? <ImageNote url={imageUrl} /> : null}
      {entry.tags?.length ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300">#{tag}</span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
