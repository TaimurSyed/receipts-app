import Link from "next/link";
import { AnnotationPanel } from "@/components/annotations/annotation-panel";
import { ImageEntryForm } from "@/components/app/image-entry-form";
import { VoiceEntryForm } from "@/components/app/voice-entry-form";
import { DayEntryForm } from "@/components/journal/day-entry-form";
import { DailyReflectionCard } from "@/components/journal/daily-reflection-card";
import { DeletableEntryCard } from "@/components/journal/deletable-entry-card";
import { NotebookShell } from "@/components/journal/notebook-shell";
import { PageTurnNav } from "@/components/journal/page-turn-nav";
import { PageNav } from "@/components/navigation/page-nav";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { getAnnotations } from "@/lib/annotations";
import { getDailyReflection } from "@/lib/daily-reflection";
import { getImagePlaybackUrl, getVoicePlaybackUrl } from "@/lib/entries";
import { hasSupabaseEnv } from "@/lib/env";
import { getJournalArchive } from "@/lib/journal";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ date: string }>;
};

export default async function JournalDayPage({ params }: PageProps) {
  const { date } = await params;
  if (!hasSupabaseEnv()) {
    return <main className="mx-auto max-w-4xl px-6 py-10 lg:px-8"><div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-zinc-400">Supabase is not configured.</div></main>;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const start = `${date}T00:00:00.000Z`;
  const end = `${date}T23:59:59.999Z`;
  const { data: entries } = await supabase
    .from("entries")
    .select("id, title, content, created_at, mood_score, tags, archived, type, audio_path, image_path")
    .eq("user_id", user.id)
    .eq("archived", false)
    .gte("created_at", start)
    .lte("created_at", end)
    .order("created_at", { ascending: true });

  const archive = await getJournalArchive();
  const flatDays = archive.flatMap((year) => year.months.flatMap((month) => month.weeks.flatMap((week) => week.days)))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
  const currentIndex = flatDays.findIndex((day) => day.date === date);
  const previousDay = currentIndex > 0 ? flatDays[currentIndex - 1] : undefined;
  const nextDay = currentIndex >= 0 && currentIndex < flatDays.length - 1 ? flatDays[currentIndex + 1] : undefined;

  const playbackUrls = Object.fromEntries(
    await Promise.all((entries ?? []).map(async (entry) => [entry.id, await getVoicePlaybackUrl(entry.audio_path)] as const)),
  );
  const imageUrls = Object.fromEntries(
    await Promise.all((entries ?? []).map(async (entry) => [entry.id, await getImagePlaybackUrl(entry.image_path)] as const)),
  );

  const displayDate = new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
  const monthKey = date.slice(0, 7);
  const reflection = await getDailyReflection(entries ?? []);
  const annotations = await getAnnotations("day", date);
  const entryList = entries ?? [];
  const visibleEntries = entryList.slice(0, 4);
  const tuckedEntries = entryList.slice(4);

  return (
    <NotebookShell archive={archive} selectedDate={date}>
      <PageNav items={[{ label: "App", href: "/app" }, { label: "Journal", href: "/insights" }, { label: monthKey, href: `/journal/month/${monthKey}` }, { label: "Day" }]} />

      <div className="notebook-page-edge notebook-paper rounded-[2.2rem] border border-[#4a3c2f] bg-[linear-gradient(180deg,#15120f_0%,#0f0d0b_100%)] p-4 sm:rounded-[2.7rem] sm:p-8 lg:p-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Daily page</p>
            <h1 className="mt-3 font-serif text-3xl text-[#f5ecd8] sm:text-5xl">{displayDate}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400">
              Your notes come first. The AI just writes in the margins.
            </p>
          </div>
          <Link href="/insights" className="rounded-full border border-[#5a4b3f] bg-[#1a1714] px-4 py-2 text-sm font-semibold text-[#f1e7d4]">Back to journal</Link>
        </div>

        <div className="space-y-6">
          <CollapsibleSection
            title="Add to this page"
            subtitle="Write something, drop in a voice memo, or pin a picture onto the day."
            defaultOpen
          >
            <div className="space-y-5">
              <DayEntryForm date={date} />
              <VoiceEntryForm date={date} contextLabel="Voice memo for this day" />
              <ImageEntryForm date={date} contextLabel="Picture note for this day" />
            </div>
          </CollapsibleSection>

          <DailyReflectionCard reflection={reflection} />

          <section className="notebook-page-edge rounded-[2rem] border border-[#4a3c2f] bg-[linear-gradient(180deg,#181410_0%,#11100f_100%)] p-4 sm:rounded-[2.5rem] sm:p-8">
            <div className="flex flex-col gap-4 border-b border-[#5e503f]/40 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Journal entries</p>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">A running page of what you actually captured that day, with AI reading alongside it instead of standing in front of it.</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
                <span className="rounded-full border border-[#5a4b3f] px-3 py-1">{entryList.length} entry{entryList.length === 1 ? "" : "ies"}</span>
                <span className="rounded-full border border-[#5a4b3f] px-3 py-1">{annotations.length} margin note{annotations.length === 1 ? "" : "s"}</span>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              {entryList.length > 0 ? (
                <>
                  {visibleEntries.map((entry, index) => (
                    <div key={entry.id} className="space-y-4">
                      <DeletableEntryCard
                        entry={{
                          id: entry.id,
                          title: entry.title,
                          content: entry.content,
                          created_at: entry.created_at,
                          mood_score: entry.mood_score,
                          tags: entry.tags as string[] | null,
                          type: entry.type,
                        }}
                        date={date}
                        playbackUrl={playbackUrls[entry.id] as string | null}
                        imageUrl={imageUrls[entry.id] as string | null}
                      />
                      {(index === 0 || (index + 1) % 3 === 0) && reflection.summary ? (
                        <div id={index === 0 ? "margin-conversation" : undefined} className="ml-1 rounded-[1.4rem] border border-amber-100/10 bg-[#171412]/80 px-4 py-4 text-sm leading-7 text-zinc-300 sm:ml-8 sm:px-5">
                          <p className="text-[10px] uppercase tracking-[0.24em] text-amber-200/60">Margin note</p>
                          <p className="mt-2">{index === 0 ? reflection.summary : index % 3 === 0 ? reflection.trigger : reflection.nextStep}</p>
                        </div>
                      ) : null}
                    </div>
                  ))}

                  {tuckedEntries.length > 0 ? (
                    <CollapsibleSection
                      title={`Keep reading this day (${tuckedEntries.length} more)`}
                      subtitle="Long day pages stay breathable up front, then open the later entries when you want the full run."
                    >
                      <div className="space-y-5">
                        {tuckedEntries.map((entry, index) => (
                          <div key={entry.id} className="space-y-4">
                            <DeletableEntryCard
                              entry={{
                                id: entry.id,
                                title: entry.title,
                                content: entry.content,
                                created_at: entry.created_at,
                                mood_score: entry.mood_score,
                                tags: entry.tags as string[] | null,
                                type: entry.type,
                              }}
                              date={date}
                              playbackUrl={playbackUrls[entry.id] as string | null}
                              imageUrl={imageUrls[entry.id] as string | null}
                            />
                            {index === tuckedEntries.length - 1 ? (
                              <div className="rounded-[1.4rem] border border-amber-100/10 bg-[#171412]/80 px-4 py-4 text-sm leading-7 text-zinc-300 sm:px-5">
                                <p className="text-[10px] uppercase tracking-[0.24em] text-amber-200/60">End-of-page margin</p>
                                <p className="mt-2">{reflection.nextStep}</p>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </CollapsibleSection>
                  ) : null}
                </>
              ) : <div className="rounded-[1.8rem] border border-[#4f4338] bg-[#15120f]/85 p-5 text-zinc-400">No entries were saved for this day yet.</div>}
            </div>

            <div className="mt-8">
              <CollapsibleSection
                title="Margin conversation"
                subtitle="Open this when you want to write back to the page or review the notes already living in the margin."
              >
                <AnnotationPanel
                  pageType="day"
                  pageKey={date}
                  annotations={annotations}
                  prompt="Write back in the margin. Correct the read, add missing context, or leave a note for future-you."
                />
              </CollapsibleSection>
            </div>

            <PageTurnNav
              previous={previousDay ? { href: `/journal/${previousDay.date}`, label: previousDay.displayDate } : undefined}
              next={nextDay ? { href: `/journal/${nextDay.date}`, label: nextDay.displayDate } : undefined}
            />
          </section>
        </div>
      </div>
    </NotebookShell>
  );
}
