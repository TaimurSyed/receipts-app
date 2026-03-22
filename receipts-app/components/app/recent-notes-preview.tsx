import Link from "next/link";
import type { TimelineEntry } from "@/lib/entries";
import { VoicePlayback } from "@/components/app/voice-playback";
import { ImageNote } from "@/components/app/image-note";

function moodLabel(score: number) {
  return ["Very low", "Low", "Neutral", "Good", "Great"][score - 1] ?? "Unknown";
}

function typeLabel(type?: string) {
  if (type === "voice") return "Voice";
  if (type === "image") return "Image";
  return "Text";
}

export function RecentNotesPreview({
  entries,
  playbackUrls = {},
  imageUrls = {},
}: {
  entries: TimelineEntry[];
  playbackUrls?: Record<string, string | null>;
  imageUrls?: Record<string, string | null>;
}) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-4 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Recent notebook movement</p>
          <h2 className="mt-2 font-serif text-3xl text-[#f5ecd8]">A few fresh pages</h2>
          <p className="mt-2 text-sm leading-7 text-zinc-400">
            Just the latest movement — no search panel, no digging, just the notebook breathing on the home page.
          </p>
        </div>
        <Link href="/app/timeline" className="rounded-full border border-[#5a4b3f] bg-[#1a1714] px-4 py-2 text-sm font-semibold text-[#f1e7d4]">
          Open full timeline
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {entries.length > 0 ? entries.slice(0, 4).map((entry, index) => {
          const dateKey = entry.dateKey ?? new Date().toISOString().slice(0, 10);
          const playbackUrl = playbackUrls[entry.id];
          const imageUrl = imageUrls[entry.id];
          const stackClass = index % 3 === 0 ? "note-stack-a" : index % 3 === 1 ? "note-stack-b" : "note-stack-c";

          return (
            <article key={entry.id} className={`living-note ${stackClass} notebook-panel rounded-[1.8rem] border border-[#4f4338] bg-[#15120f]/85 p-5`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-[#f1e7d4]">{entry.title}</h3>
                    <span className="rounded-full border border-[#5a4b3f] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                      {typeLabel(entry.type)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">{entry.time}</p>
                </div>
                <span className="rounded-full border border-[#5a4b3f] px-3 py-1 text-xs text-zinc-400">
                  {moodLabel(entry.mood)}
                </span>
              </div>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-zinc-300">{entry.content}</p>
              {entry.type === "voice" && playbackUrl ? <VoicePlayback url={playbackUrl} /> : null}
              {entry.type === "image" && imageUrl ? <ImageNote url={imageUrl} /> : null}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Link href={`/journal/${dateKey}`} className="rounded-full border border-[#5a4b3f] px-3 py-1 text-xs text-zinc-300 transition hover:bg-white/5">
                  Open day
                </Link>
                {entry.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300">#{tag}</span>
                ))}
              </div>
            </article>
          );
        }) : (
          <div className="rounded-[1.8rem] border border-[#4f4338] bg-[#15120f]/85 p-5 text-zinc-400">
            Nothing fresh yet. Add a note and the home page will start to feel alive.
          </div>
        )}
      </div>
    </section>
  );
}
