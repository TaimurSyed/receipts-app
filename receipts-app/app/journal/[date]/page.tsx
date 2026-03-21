import Link from "next/link";
import { AnnotationPanel } from "@/components/annotations/annotation-panel";
import { ImageEntryForm } from "@/components/app/image-entry-form";
import { ImageNote } from "@/components/app/image-note";
import { VoicePlayback } from "@/components/app/voice-playback";
import { VoiceEntryForm } from "@/components/app/voice-entry-form";
import { DayEntryForm } from "@/components/journal/day-entry-form";
import { DailyReflectionCard } from "@/components/journal/daily-reflection-card";
import { EntryActionsMenu } from "@/components/journal/entry-actions-menu";
import { NotebookShell } from "@/components/journal/notebook-shell";
import { PageTurnNav } from "@/components/journal/page-turn-nav";
import { PageNav } from "@/components/navigation/page-nav";
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

  return (
    <NotebookShell archive={archive} selectedDate={date}>
      <PageNav items={[{ label: "App", href: "/app" }, { label: "Journal", href: "/insights" }, { label: monthKey, href: `/journal/month/${monthKey}` }, { label: displayDate }]} />

      <div className="notebook-page-edge notebook-paper rounded-[2.7rem] border border-[#4a3c2f] bg-[linear-gradient(180deg,#15120f_0%,#0f0d0b_100%)] p-6 sm:p-8 lg:p-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Daily page</p>
            <h1 className="mt-3 font-serif text-4xl text-[#f5ecd8] sm:text-5xl">{displayDate}</h1>
          </div>
          <Link href="/insights" className="rounded-full border border-[#5a4b3f] bg-[#1a1714] px-4 py-2 text-sm font-semibold text-[#f1e7d4]">Back to journal</Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-6">
            <DailyReflectionCard reflection={reflection} />
            <DayEntryForm date={date} />
            <VoiceEntryForm date={date} contextLabel="Voice memo for this day" />
            <ImageEntryForm date={date} contextLabel="Picture note for this day" />
            <AnnotationPanel
              pageType="day"
              pageKey={date}
              annotations={annotations}
              prompt="Answer back to the day here. Correct the read, add context, or leave a note for future-you."
            />
          </div>

          <section className="notebook-page-edge rounded-[2.5rem] border border-[#4a3c2f] bg-[linear-gradient(180deg,#181410_0%,#11100f_100%)] p-6 sm:p-8">
            <div className="border-b border-[#5e503f]/40 pb-5">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Receipts from the day</p>
              <p className="mt-3 text-sm leading-7 text-zinc-400">The raw notes are still here underneath the interpretation.</p>
            </div>

            <div className="mt-8 space-y-5">
              {entries && entries.length > 0 ? entries.map((entry) => (
                <article key={entry.id} className="rounded-[1.8rem] border border-[#4f4338] bg-[#15120f]/85 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-[#f1e7d4]">{entry.title || "Untitled entry"}</h2>
                      <p className="mt-1 text-sm text-zinc-500">{new Date(entry.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</p>
                    </div>
                    <EntryActionsMenu entryId={entry.id} date={date} />
                  </div>
                  <div className="mt-3"><span className="rounded-full border border-[#5a4b3f] px-3 py-1 text-xs text-zinc-400">Mood {entry.mood_score ?? 3}/5</span></div>
                  <p className="mt-5 whitespace-pre-line font-serif text-[17px] leading-8 text-zinc-200">{entry.content}</p>
                  {entry.type === "voice" && playbackUrls[entry.id] ? <VoicePlayback url={playbackUrls[entry.id] as string} /> : null}
                  {entry.type === "image" && imageUrls[entry.id] ? <ImageNote url={imageUrls[entry.id] as string} /> : null}
                  {entry.tags?.length ? <div className="mt-5 flex flex-wrap gap-2">{entry.tags.map((tag: string) => <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300">#{tag}</span>)}</div> : null}
                </article>
              )) : <div className="rounded-[1.8rem] border border-[#4f4338] bg-[#15120f]/85 p-5 text-zinc-400">No entries were saved for this day yet.</div>}
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
