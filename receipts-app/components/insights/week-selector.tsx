import Link from "next/link";
import type { JournalWeek } from "@/lib/journal";

export function WeekSelector({ weeks, selectedWeek }: { weeks: JournalWeek[]; selectedWeek?: string }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#131110] p-4 sm:p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Browse weeks</p>
      <div className="mt-4 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
        <Link
          href="/insights"
          className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
            !selectedWeek ? "bg-amber-200 text-black" : "border border-white/10 bg-white/5 text-zinc-300"
          }`}
        >
          Latest
        </Link>
        {weeks.map((week) => (
          <Link
            key={week.key}
            href={`/insights?week=${week.key}`}
            className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
              selectedWeek === week.key ? "bg-amber-200 text-black" : "border border-white/10 bg-white/5 text-zinc-300"
            }`}
          >
            {week.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
