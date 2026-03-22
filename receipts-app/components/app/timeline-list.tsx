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

function filterMoodLabel(mood?: string) {
  if (mood === "low") return "Low";
  if (mood === "neutral") return "Neutral";
  if (mood === "good") return "Good";
  return "All moods";
}

function filterRangeLabel(range?: string) {
  if (range === "7d") return "Last 7 days";
  if (range === "30d") return "Last 30 days";
  if (range === "month") return "This month";
  return "All time";
}

function archivedLabel(value?: string) {
  if (value === "archived") return "Archived only";
  if (value === "all") return "Active + archived";
  return "Active only";
}

const typeOptions = [
  { value: "all", label: "Everything" },
  { value: "text", label: "Text" },
  { value: "voice", label: "Voice" },
  { value: "image", label: "Image" },
];

const moodOptions = [
  { value: "all", label: "All moods" },
  { value: "low", label: "Low" },
  { value: "neutral", label: "Neutral" },
  { value: "good", label: "Good" },
];

const rangeOptions = [
  { value: "all", label: "All time" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "month", label: "This month" },
];

const archivedOptions = [
  { value: "active", label: "Active only" },
  { value: "all", label: "Active + archived" },
  { value: "archived", label: "Archived only" },
];

export function TimelineList({
  entries,
  playbackUrls = {},
  imageUrls = {},
  query = "",
  type = "all",
  mood = "all",
  range = "all",
  archived = "active",
  relatedTo = "",
}: {
  entries: TimelineEntry[];
  playbackUrls?: Record<string, string | null>;
  imageUrls?: Record<string, string | null>;
  query?: string;
  type?: string;
  mood?: string;
  range?: string;
  archived?: string;
  relatedTo?: string;
}) {
  const hasFilters = Boolean(query || type !== "all" || mood !== "all" || range !== "all" || archived !== "active" || relatedTo);

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-4 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Timeline</p>
          <h2 className="mt-2 font-serif text-3xl text-[#f5ecd8]">{relatedTo ? "Related notebook threads" : "Recent pages and notes"}</h2>
        </div>
        <Link href="/insights" className="rounded-full border border-[#5a4b3f] bg-[#1a1714] px-4 py-2 text-sm font-semibold text-[#f1e7d4]">
          Open notebook
        </Link>
      </div>

      {relatedTo ? (
        <div className="living-note note-stack-c mt-4 rounded-[1.6rem] border border-[#4f4338] bg-[#15120f]/85 p-4 text-sm leading-7 text-zinc-400">
          These entries are ranked by shared tags, nearby dates, similar mood, entry type, and a little text overlap.
        </div>
      ) : null}

      <form className="mt-6 grid gap-4 rounded-[1.8rem] border border-[#4f4338] bg-[#15120f]/85 p-4 lg:grid-cols-2 xl:grid-cols-12 xl:gap-5">
        <div className="min-w-0 space-y-2 lg:col-span-2 xl:col-span-5">
          <label htmlFor="timeline-search" className="block text-[10px] uppercase leading-5 tracking-[0.14em] text-zinc-500">
            Search the notebook
          </label>
          <input
            id="timeline-search"
            name="q"
            defaultValue={query}
            placeholder="sleep, breakup, gym, screenshot, anxious..."
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
          />
        </div>

        <div className="min-w-0 space-y-2 xl:col-span-2">
          <label htmlFor="timeline-type" className="block text-[10px] uppercase leading-5 tracking-[0.14em] text-zinc-500">
            Entry type
          </label>
          <select id="timeline-type" name="type" defaultValue={type} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none">
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="min-w-0 space-y-2 xl:col-span-2">
          <label htmlFor="timeline-mood" className="block text-[10px] uppercase leading-5 tracking-[0.14em] text-zinc-500">
            Mood band
          </label>
          <select id="timeline-mood" name="mood" defaultValue={mood} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none">
            {moodOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="min-w-0 space-y-2 xl:col-span-2">
          <label htmlFor="timeline-range" className="block text-[10px] uppercase leading-5 tracking-[0.14em] text-zinc-500">
            Time range
          </label>
          <select id="timeline-range" name="range" defaultValue={range} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none">
            {rangeOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="min-w-0 space-y-2 xl:col-span-3">
          <label htmlFor="timeline-archived" className="block text-[10px] uppercase leading-5 tracking-[0.14em] text-zinc-500">
            Notebook state
          </label>
          <select id="timeline-archived" name="archived" defaultValue={archived} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none">
            {archivedOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2 pt-1 lg:col-span-2 xl:col-span-12 xl:justify-end">
          {relatedTo ? <input type="hidden" name="relatedTo" value={relatedTo} /> : null}
          <button className="rounded-full bg-amber-300 px-5 py-3 font-semibold text-black">Search</button>
          {hasFilters ? (
            <Link href="/app/timeline" className="rounded-full border border-[#5a4b3f] bg-[#1a1714] px-5 py-3 text-sm font-semibold text-[#f1e7d4]">
              Clear
            </Link>
          ) : null}
        </div>
      </form>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-500">
        {relatedTo ? <span className="rounded-full border border-[#5a4b3f] px-3 py-1">Mode: Related entries</span> : null}
        {query ? <span className="rounded-full border border-[#5a4b3f] px-3 py-1">Query: {query}</span> : null}
        {type !== "all" ? <span className="rounded-full border border-[#5a4b3f] px-3 py-1">Type: {typeLabel(type)}</span> : null}
        {mood !== "all" ? <span className="rounded-full border border-[#5a4b3f] px-3 py-1">Mood: {filterMoodLabel(mood)}</span> : null}
        {range !== "all" ? <span className="rounded-full border border-[#5a4b3f] px-3 py-1">Range: {filterRangeLabel(range)}</span> : null}
        {archived !== "active" ? <span className="rounded-full border border-[#5a4b3f] px-3 py-1">State: {archivedLabel(archived)}</span> : null}
      </div>

      <div className="mt-6 space-y-4">
        {entries.length > 0 ? entries.map((entry) => {
          const dateKey = entry.dateKey ?? new Date().toISOString().slice(0, 10);
          const playbackUrl = playbackUrls[entry.id];
          const imageUrl = imageUrls[entry.id];
          return (
            <article key={entry.id} className={`living-note notebook-panel rounded-[1.8rem] border border-[#4f4338] bg-[#15120f]/85 p-5 ${entry.archived ? "note-stack-c" : "note-stack-a"}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-[#f1e7d4]">{entry.title}</h3>
                    <span className="rounded-full border border-[#5a4b3f] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                      {typeLabel(entry.type)}
                    </span>
                    {entry.archived ? (
                      <span className="rounded-full border border-[#6a5847] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                        Archived
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">{entry.time}</p>
                </div>
                <span className="rounded-full border border-[#5a4b3f] px-3 py-1 text-xs text-zinc-400">{moodLabel(entry.mood)}</span>
              </div>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-zinc-300">{entry.content}</p>
              {entry.type === "voice" && playbackUrl ? <VoicePlayback url={playbackUrl} /> : null}
              {entry.type === "image" && imageUrl ? <ImageNote url={imageUrl} /> : null}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Link href={`/journal/${dateKey}`} className="rounded-full border border-[#5a4b3f] px-3 py-1 text-xs text-zinc-300 transition hover:bg-white/5">Open day</Link>
                {entry.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300">#{tag}</span>
                ))}
              </div>
            </article>
          );
        }) : (
          <div className="rounded-[1.8rem] border border-[#4f4338] bg-[#15120f]/85 p-5 text-zinc-400">
            {relatedTo
              ? "No strong notebook neighbors showed up for that entry yet. Try widening the archive state or using regular search instead."
              : "No entries matched that combination yet. Try another word, widen the date range, or loosen the filters."}
          </div>
        )}
      </div>
    </section>
  );
}
