import Link from "next/link";
import type { TimelineEntry } from "@/lib/entries";
import { VoicePlayback } from "@/components/app/voice-playback";

function moodLabel(score: number) {
  return ["Very low", "Low", "Neutral", "Good", "Great"][score - 1] ?? "Unknown";
}

export function TimelineList({ entries, playbackUrls = {} }: { entries: TimelineEntry[]; playbackUrls?: Record<string, string | null> }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Timeline</p>
          <h2 className="mt-2 font-serif text-3xl text-[#f5ecd8]">Recent pages and notes</h2>
        </div>
        <Link href="/insights" className="rounded-full border border-[#5a4b3f] bg-[#1a1714] px-4 py-2 text-sm font-semibold text-[#f1e7d4]">
          Open notebook
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {entries.length > 0 ? entries.map((entry) => {
          const dateKey = entry.dateKey ?? new Date().toISOString().slice(0, 10);
          const playbackUrl = playbackUrls[entry.id];
          return (
            <article key={entry.id} className="rounded-[1.8rem] border border-[#4f4338] bg-[#15120f]/85 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-[#f1e7d4]">{entry.title}</h3>
                  <p className="mt-1 text-sm text-zinc-500">{entry.time}</p>
                </div>
                <span className="rounded-full border border-[#5a4b3f] px-3 py-1 text-xs text-zinc-400">
                  {moodLabel(entry.mood)}
                </span>
              </div>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-zinc-300">{entry.content}</p>
              {entry.type === "voice" && playbackUrl ? <VoicePlayback url={playbackUrl} /> : null}
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
            No entries yet. Capture something and this timeline will start to feel like a real notebook history.
          </div>
        )}
      </div>
    </section>
  );
}
