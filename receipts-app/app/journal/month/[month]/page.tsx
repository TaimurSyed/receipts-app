import Link from "next/link";
import { NotebookShell } from "@/components/journal/notebook-shell";
import { getJournalArchive } from "@/lib/journal";

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

  return (
    <NotebookShell archive={archive}>
      <div className="rounded-[2.7rem] border border-[#4a3c2f] bg-[linear-gradient(180deg,#15120f_0%,#0f0d0b_100%)] p-6 sm:p-8 shadow-panel">
        <div className="border-b border-[#5e503f]/40 pb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#dbc59b]">Month view</p>
          <h1 className="mt-3 font-serif text-5xl text-[#f5ecd8]">{monthRecord.label} {monthRecord.year}</h1>
          <p className="mt-3 text-zinc-400">A notebook index of the weeks and pages that live in this month.</p>
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

              <div className="mt-4 space-y-2 border-l border-[#5e503f]/30 pl-4">
                {week.days.map((day) => (
                  <Link key={day.date} href={`/journal/${day.date}`} className="block text-sm text-zinc-400 transition hover:text-zinc-200">
                    {day.displayDate}
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
