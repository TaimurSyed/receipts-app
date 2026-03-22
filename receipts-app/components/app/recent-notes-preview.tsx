import Link from "next/link";
import type { TimelineEntry } from "@/lib/entries";
import type { InsightRecord } from "@/lib/insights";
import { VoicePlayback } from "@/components/app/voice-playback";
import { ImageNote } from "@/components/app/image-note";
import { CollapsibleSection } from "@/components/ui/collapsible-section";

function moodLabel(score: number) {
  return ["Very low", "Low", "Neutral", "Good", "Great"][score - 1] ?? "Unknown";
}

function typeLabel(type?: string) {
  if (type === "voice") return "Voice";
  if (type === "image") return "Image";
  return "Text";
}

function formatDayLabel(dateKey?: string) {
  if (!dateKey) return "Recent page";
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function shorten(text: string, maxLength = 160) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trimEnd()}…`;
}

function getDayMarginReads(dayEntries: TimelineEntry[], insights: InsightRecord[]) {
  const entryIds = new Set(dayEntries.map((entry) => entry.id));

  return insights
    .filter((insight) => insight.evidence.some((entryId) => entryIds.has(entryId)))
    .slice(0, 2)
    .map((insight) => ({
      id: insight.id,
      title: insight.title,
      body: shorten(insight.body, 170),
      type: insight.type,
    }));
}

function marginLabel(type?: string) {
  if (type === "contradiction") return "Tension in the margin";
  if (type === "pattern") return "Pattern in the margin";
  return "Short read from the margin";
}

function EntryPreview({
  entry,
  playbackUrl,
  imageUrl,
  stackClass,
}: {
  entry: TimelineEntry;
  playbackUrl?: string | null;
  imageUrl?: string | null;
  stackClass: string;
}) {
  const dateKey = entry.dateKey ?? new Date().toISOString().slice(0, 10);

  return (
    <article className={`living-note ${stackClass} notebook-panel rounded-[1.6rem] border border-[#4f4338] bg-[#15120f]/85 p-4 sm:rounded-[1.8rem] sm:p-5`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-[#f1e7d4] sm:text-lg">{entry.title}</h3>
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
        <Link href={`/app/timeline?relatedTo=${entry.id}`} className="rounded-full border border-[#5a4b3f] px-3 py-1 text-xs text-zinc-300 transition hover:bg-white/5">
          Continue thread
        </Link>
        {entry.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300">#{tag}</span>
        ))}
      </div>
    </article>
  );
}

export function RecentNotesPreview({
  entries,
  insights = [],
  playbackUrls = {},
  imageUrls = {},
}: {
  entries: TimelineEntry[];
  insights?: InsightRecord[];
  playbackUrls?: Record<string, string | null>;
  imageUrls?: Record<string, string | null>;
}) {
  const grouped = entries.reduce<Array<{ dateKey: string; entries: TimelineEntry[] }>>((acc, entry) => {
    const dateKey = entry.dateKey ?? new Date().toISOString().slice(0, 10);
    const bucket = acc.find((item) => item.dateKey === dateKey);
    if (bucket) {
      bucket.entries.push(entry);
    } else {
      acc.push({ dateKey, entries: [entry] });
    }
    return acc;
  }, []);
  const visibleDays = grouped.slice(0, 3);
  const tuckedDays = grouped.slice(3);

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-4 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Home journal stream</p>
          <h2 className="mt-2 font-serif text-3xl text-[#f5ecd8]">What just landed on the page</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">
            The home page should feel like reading forward through the notebook: day headers, captures in order, and brief AI reads tucked into the margin instead of parked in a separate box.
          </p>
        </div>
        <Link href="/app/timeline" className="rounded-full border border-[#5a4b3f] bg-[#1a1714] px-4 py-2 text-sm font-semibold text-[#f1e7d4]">
          Open full timeline
        </Link>
      </div>

      <div className="mt-6 space-y-6">
        {grouped.length > 0 ? (
          <>
            {visibleDays.map((day, dayIndex) => {
              const marginReads = getDayMarginReads(day.entries, insights);

              return (
                <section key={day.dateKey} className="space-y-4">
                  <div className="flex flex-col gap-3 rounded-[1.6rem] border border-[#4f4338] bg-[#110f0d]/70 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Day chapter</p>
                      <h3 className="mt-2 font-serif text-2xl text-[#f1e7d4]">{formatDayLabel(day.dateKey)}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                      <span className="rounded-full border border-[#5a4b3f] px-3 py-1">{day.entries.length} capture{day.entries.length === 1 ? "" : "s"}</span>
                      {marginReads.length > 0 ? <span className="rounded-full border border-[#5a4b3f] px-3 py-1">{marginReads.length} margin read{marginReads.length === 1 ? "" : "s"}</span> : null}
                      <Link href={`/journal/${day.dateKey}`} className="rounded-full border border-[#5a4b3f] px-3 py-1 transition hover:bg-white/5">
                        Open page
                      </Link>
                    </div>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-start">
                    <div className="space-y-4">
                      {day.entries.map((entry, index) => {
                        const stackClass = (dayIndex + index) % 3 === 0 ? "note-stack-a" : (dayIndex + index) % 3 === 1 ? "note-stack-b" : "note-stack-c";
                        return (
                          <EntryPreview
                            key={entry.id}
                            entry={entry}
                            playbackUrl={playbackUrls[entry.id]}
                            imageUrl={imageUrls[entry.id]}
                            stackClass={stackClass}
                          />
                        );
                      })}
                    </div>

                    {marginReads.length > 0 ? (
                      <aside className="space-y-3 xl:sticky xl:top-5">
                        {marginReads.map((read, index) => (
                          <div key={read.id} className={`rounded-[1.4rem] border border-amber-100/10 bg-[#171412]/85 px-4 py-4 text-sm leading-7 text-zinc-300 ${index % 2 === 0 ? "xl:translate-y-3" : ""}`}>
                            <p className="text-[10px] uppercase tracking-[0.24em] text-amber-200/60">{marginLabel(read.type)}</p>
                            <h4 className="mt-2 font-serif text-lg text-[#f1e7d4]">{read.title}</h4>
                            <p className="mt-2">{read.body}</p>
                            <Link href="/insights" className="mt-3 inline-flex rounded-full border border-[#5a4b3f] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-zinc-300 transition hover:bg-white/5">
                              Open chapter spread
                            </Link>
                          </div>
                        ))}
                      </aside>
                    ) : null}
                  </div>
                </section>
              );
            })}

            {tuckedDays.length > 0 ? (
              <CollapsibleSection
                title={`Earlier pages (${tuckedDays.length})`}
                subtitle="Keep the front page readable, then open the older day-chapters when you want the longer scroll."
              >
                <div className="space-y-6">
                  {tuckedDays.map((day, dayIndex) => (
                    <section key={day.dateKey} className="space-y-4">
                      <div className="flex flex-col gap-3 rounded-[1.6rem] border border-[#4f4338] bg-[#110f0d]/70 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-5">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Earlier chapter</p>
                          <h3 className="mt-2 font-serif text-2xl text-[#f1e7d4]">{formatDayLabel(day.dateKey)}</h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                          <span className="rounded-full border border-[#5a4b3f] px-3 py-1">{day.entries.length} capture{day.entries.length === 1 ? "" : "s"}</span>
                          <Link href={`/journal/${day.dateKey}`} className="rounded-full border border-[#5a4b3f] px-3 py-1 transition hover:bg-white/5">
                            Open page
                          </Link>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {day.entries.map((entry, index) => {
                          const stackClass = (dayIndex + index) % 2 === 0 ? "note-stack-b" : "note-stack-c";
                          return (
                            <EntryPreview
                              key={entry.id}
                              entry={entry}
                              playbackUrl={playbackUrls[entry.id]}
                              imageUrl={imageUrls[entry.id]}
                              stackClass={stackClass}
                            />
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              </CollapsibleSection>
            ) : null}
          </>
        ) : (
          <div className="rounded-[1.8rem] border border-[#4f4338] bg-[#15120f]/85 p-5 text-zinc-400">
            Nothing fresh yet. Add a note and the home page will start to feel alive.
          </div>
        )}
      </div>
    </section>
  );
}
