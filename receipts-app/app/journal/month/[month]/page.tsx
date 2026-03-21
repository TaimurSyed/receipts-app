import Link from "next/link";
import { NotebookShell } from "@/components/journal/notebook-shell";
import { buildMonthGrid, getJournalArchive } from "@/lib/journal";

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type PageProps = {
  params: Promise<{ month: string }>;
};

export default async function JournalMonthPage({ params }: PageProps) {
  const { month } = await params;
  const archive = await getJournalArchive();
  const monthRecord = archive.flatMap((year) => year.months).find((item) => item.key === month);

  if (!monthRecord) {
    return (
      <NotebookShell archive={archive}>
        <div className="rounded-[2.7rem] border border-[#4a3c2f] bg-[linear-gradient(180deg,#15120f_0%,#0f0d0b_100%)] p-8 text-zinc-400 shadow-panel">
          Month not found.
        </div>
      </NotebookShell>
    );
  }

  const grid = buildMonthGrid(monthRecord);

  return (
    <NotebookShell archive={archive}>
      <div className="rounded-[2.7rem] border border-[#4a3c2f] bg-[linear-gradient(180deg,#15120f_0%,#0f0d0b_100%)] p-6 sm:p-8 shadow-panel">
        <div className="border-b border-[#5e503f]/40 pb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#dbc59b]">Month view</p>
          <h1 className="mt-3 font-serif text-5xl text-[#f5ecd8]">{monthRecord.label} {monthRecord.year}</h1>
          <p className="mt-3 text-zinc-400">A calendar spread for the pages that exist in this month.</p>
        </div>

        <div className="mt-8 rounded-[2rem] border border-[#4f4338] bg-[#15120f] p-4 sm:p-5">
          <div className="grid grid-cols-7 gap-2 border-b border-[#5e503f]/30 pb-3 text-center text-xs uppercase tracking-[0.24em] text-zinc-500">
            {weekdayLabels.map((label) => (
              <div key={label}>{label}</div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-7 gap-2">
            {grid.map((cell) => (
              <Link
                key={cell.date}
                href={cell.hasEntries ? `/journal/${cell.date}` : `/journal/month/${monthRecord.key}`}
                className={`min-h-24 rounded-2xl border p-3 transition ${
                  cell.inMonth
                    ? "border-[#4f4338] bg-[#110f0d] hover:bg-[#1a1714]"
                    : "border-[#352d26] bg-[#0d0b09] text-zinc-600"
                } ${cell.hasEntries ? "ring-1 ring-[#dbc59b]/20" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-sm font-semibold ${cell.inMonth ? "text-[#f1e7d4]" : "text-zinc-600"}`}>{cell.dayNumber}</span>
                  {cell.hasEntries ? <span className="h-2.5 w-2.5 rounded-full bg-amber-200" /> : null}
                </div>
                {cell.hasEntries ? <p className="mt-8 text-xs text-zinc-500">Open page</p> : null}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {monthRecord.weeks.map((week) => (
            <section key={week.key} className="rounded-[2rem] border border-[#4f4338] bg-[#15120f] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Week spread</p>
                  <h2 className="mt-2 font-serif text-2xl text-[#f1e7d4]">{week.label}</h2>
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
          ))}
        </div>
      </div>
    </NotebookShell>
  );
}
