import Link from "next/link";
import type { JournalWeek } from "@/lib/journal";

export function WeekSelector({ weeks, selectedWeek }: { weeks: JournalWeek[]; selectedWeek?: string }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#131110] p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Browse weeks</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/insights"
          className={`rounded-full px-4 py-2 text-sm transition ${
            !selectedWeek ? "bg-amber-200 text-black" : "border border-white/10 bg-white/5 text-zinc-300"
          }`}
        >
          Latest
        </Link>
        {weeks.map((week) => (
          <Link
            key={week.key}
            href={`/insights?week=${week.key}`}
            className={`rounded-full px-4 py-2 text-sm transition ${
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
