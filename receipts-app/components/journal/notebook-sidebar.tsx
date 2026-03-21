import Link from "next/link";
import type { JournalYear } from "@/lib/journal";

type Props = {
  archive: JournalYear[];
  selectedWeek?: string;
  selectedDate?: string;
};

export function NotebookSidebar({ archive, selectedWeek, selectedDate }: Props) {
  return (
    <aside className="rounded-[2.5rem] border border-[#4a3c2f] bg-[linear-gradient(180deg,#15120f_0%,#100e0c_100%)] p-5 shadow-panel">
      <div className="border-b border-[#5e503f]/40 pb-4">
        <p className="text-xs uppercase tracking-[0.3em] text-[#dbc59b]">Notebook</p>
        <h2 className="mt-3 font-serif text-3xl text-[#f5ecd8]">Archive</h2>
        <p className="mt-2 text-sm text-zinc-500">Years, months, weeks, and pages.</p>
      </div>

      <div className="mt-5 space-y-5">
        {archive.length > 0 ? (
          archive.map((yearGroup) => (
            <div key={yearGroup.year} className="space-y-3">
              <p className="text-lg font-semibold text-[#f1e7d4]">{yearGroup.year}</p>
              <div className="space-y-4 border-l border-[#5e503f]/30 pl-4">
                {yearGroup.months.map((month) => (
                  <div key={month.key} className="space-y-2">
                    <p className="font-serif text-lg text-zinc-300">{month.label}</p>
                    <div className="space-y-2">
                      {month.weeks.map((week) => (
                        <div key={week.key} className="space-y-2">
                          <Link
                            href={`/insights?week=${week.key}`}
                            className={`block rounded-2xl px-3 py-2 text-sm transition ${
                              selectedWeek === week.key
                                ? "bg-[#e7d8b4] text-black"
                                : "bg-white/5 text-zinc-300 hover:bg-white/10"
                            }`}
                          >
                            {week.label}
                          </Link>
                          <div className="ml-2 space-y-1 border-l border-white/10 pl-3">
                            {week.days.map((day) => (
                              <Link
                                key={day.date}
                                href={`/journal/${day.date}`}
                                className={`block text-sm transition ${
                                  selectedDate === day.date ? "text-amber-200" : "text-zinc-500 hover:text-zinc-300"
                                }`}
                              >
                                {day.displayDate}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-zinc-500">Your notebook archive will fill in as you write.</p>
        )}
      </div>
    </aside>
  );
}
