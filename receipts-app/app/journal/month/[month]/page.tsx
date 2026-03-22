import Link from "next/link";
import { ImageEntryForm } from "@/components/app/image-entry-form";
import { VoiceEntryForm } from "@/components/app/voice-entry-form";
import { NotebookShell } from "@/components/journal/notebook-shell";
import { QuickAddForm } from "@/components/journal/quick-add-form";
import { PageNav } from "@/components/navigation/page-nav";
import { buildMonthGrid, getJournalArchive } from "@/lib/journal";

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type PageProps = {
  params: Promise<{ month: string }>;
  searchParams?: Promise<{ add?: string }>;
};

export default async function JournalMonthPage({ params, searchParams }: PageProps) {
  const { month } = await params;
  const sp = (await searchParams) ?? {};
  const addDate = sp.add;
  const archive = await getJournalArchive();
  const monthRecord = archive.flatMap((year) => year.months).find((item) => item.key === month);

  if (!monthRecord) {
    return (
      <NotebookShell archive={archive}>
        <div className="notebook-page-edge rounded-[2.7rem] border border-[#4a3c2f] bg-[linear-gradient(180deg,#15120f_0%,#0f0d0b_100%)] p-8 text-zinc-400 shadow-panel">
          Month not found.
        </div>
      </NotebookShell>
    );
  }

  const grid = buildMonthGrid(monthRecord);
  const daysWithEntries = monthRecord.weeks.flatMap((week) => week.days);
  const totalEntries = daysWithEntries.reduce((sum, day) => sum + day.entries.length, 0);
  const firstDay = daysWithEntries.at(-1);
  const latestDay = daysWithEntries[0];

  return (
    <NotebookShell archive={archive}>
      <PageNav items={[{ label: "App", href: "/app" }, { label: "Journal", href: "/insights" }, { label: monthRecord.label }]} />

      <div className="notebook-page-edge notebook-paper rounded-[2.2rem] border border-[#4a3c2f] bg-[linear-gradient(180deg,#15120f_0%,#0f0d0b_100%)] p-4 sm:rounded-[2.7rem] sm:p-8 lg:p-10 shadow-panel">
        <div className="border-b border-[#5e503f]/40 pb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#dbc59b]">Month view</p>
          <h1 className="mt-3 font-serif text-4xl text-[#f5ecd8] sm:text-6xl">{monthRecord.label} {monthRecord.year}</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-8 text-zinc-400">A chapter spread for the pages that exist in this month.</p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-[1.8rem] border border-[#4f4338] bg-[#15120f]/80 p-4 sm:p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Active days</p>
            <p className="mt-3 text-3xl font-semibold text-[#f1e7d4]">{daysWithEntries.length}</p>
          </div>
          <div className="rounded-[1.8rem] border border-[#4f4338] bg-[#15120f]/80 p-4 sm:p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Entries captured</p>
            <p className="mt-3 text-3xl font-semibold text-[#f1e7d4]">{totalEntries}</p>
          </div>
          <div className="rounded-[1.8rem] border border-[#4f4338] bg-[#15120f]/80 p-4 sm:p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Chapter span</p>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              {firstDay ? new Date(`${firstDay.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
              {latestDay ? ` → ${new Date(`${latestDay.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : ""}
            </p>
          </div>
        </div>

        {addDate ? (
          <div className="mt-8 space-y-6 rounded-[2rem] border border-[#4f4338] bg-[#15120f]/80 p-5">
            <div className="mb-1 flex flex-col gap-3 border-b border-[#5e503f]/30 pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Quick add</p>
                <h2 className="mt-2 font-serif text-2xl text-[#f1e7d4] sm:text-3xl">
                  Add to {new Date(`${addDate}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Add a text note, voice memo, or picture without leaving the calendar view.
                </p>
              </div>
              <Link href={`/journal/month/${monthRecord.key}`} className="rounded-full border border-[#5a4b3f] bg-[#1a1714] px-4 py-2 text-sm font-semibold text-[#f1e7d4]">
                Close
              </Link>
            </div>
            <QuickAddForm date={addDate} />
            <VoiceEntryForm date={addDate} contextLabel="Voice memo for this day" />
            <ImageEntryForm date={addDate} contextLabel="Picture note for this day" />
          </div>
        ) : null}

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] xl:items-start">
          <div className="rounded-[2rem] border border-[#4f4338] bg-[#15120f]/80 p-4 sm:p-5">
            <div className="grid grid-cols-7 gap-2 border-b border-[#5e503f]/30 pb-3 text-center text-[10px] uppercase tracking-[0.24em] text-zinc-500 sm:text-xs">
              {weekdayLabels.map((label) => (
                <div key={label}>{label}</div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-7 gap-2">
              {grid.map((cell) => (
                <div
                  key={cell.date}
                  className={`min-h-24 rounded-2xl border p-2.5 sm:min-h-32 sm:p-3 ${
                    cell.inMonth
                      ? "border-[#4f4338] bg-[#110f0d]/90"
                      : "border-[#352d26] bg-[#0d0b09] text-zinc-600"
                  } ${cell.hasEntries ? "ring-1 ring-[#dbc59b]/20 shadow-sm" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-sm font-semibold ${cell.inMonth ? "text-[#f1e7d4]" : "text-zinc-600"}`}>{cell.dayNumber}</span>
                    <div className="flex items-center gap-2">
                      {cell.hasEntries ? <span className="h-2.5 w-2.5 rounded-full bg-amber-200" /> : null}
                      {cell.inMonth ? (
                        <Link href={`/journal/month/${monthRecord.key}?add=${cell.date}`} className="text-[11px] text-zinc-500 transition hover:text-amber-200 sm:text-xs">
                          + Add
                        </Link>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-7 flex flex-col gap-1 text-[11px] sm:mt-12 sm:text-xs">
                    {cell.hasEntries ? (
                      <Link href={`/journal/${cell.date}`} className="text-zinc-500 transition hover:text-zinc-200">
                        Open page
                      </Link>
                    ) : cell.inMonth ? (
                      <span className="text-zinc-600">No page yet</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[2rem] border border-[#4f4338] bg-[#15120f]/80 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Table of contents</p>
              <h2 className="mt-2 font-serif text-2xl text-[#f1e7d4]">Days in this chapter</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {daysWithEntries.length > 0 ? daysWithEntries.map((day) => (
                  <Link key={day.date} href={`/journal/${day.date}`} className="rounded-full border border-[#5a4b3f] bg-white/5 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10">
                    {new Date(`${day.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </Link>
                )) : <p className="text-sm text-zinc-500">No saved days yet.</p>}
              </div>
            </div>

            {monthRecord.weeks.map((week) => {
              const weekEntryCount = week.days.reduce((sum, day) => sum + day.entries.length, 0);
              return (
                <section key={week.key} className="rounded-[2rem] border border-[#4f4338] bg-[#15120f]/80 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Week spread</p>
                      <h2 className="mt-2 font-serif text-2xl text-[#f1e7d4]">{week.label}</h2>
                      <p className="mt-2 text-sm text-zinc-500">{week.days.length} active day{week.days.length === 1 ? "" : "s"} · {weekEntryCount} capture{weekEntryCount === 1 ? "" : "s"}</p>
                    </div>
                    <Link href={`/insights?week=${week.key}`} className="rounded-full border border-[#5a4b3f] bg-[#1a1714] px-4 py-2 text-sm font-semibold text-[#f1e7d4]">
                      Open week
                    </Link>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {week.days.map((day) => (
                      <Link key={day.date} href={`/journal/${day.date}`} className="rounded-full border border-[#5a4b3f] bg-white/5 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10">
                        {new Date(`${day.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </aside>
        </div>
      </div>
    </NotebookShell>
  );
}
