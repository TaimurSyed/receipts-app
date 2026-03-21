import Link from "next/link";
import type { JournalWeek } from "@/lib/journal";

export function DayList({ week }: { week?: JournalWeek }) {
  if (!week || week.days.length === 0) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-zinc-400">
        No day pages yet for this week.
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Daily pages</p>
      <div className="mt-4 space-y-3">
        {week.days.map((day) => (
          <Link key={day.date} href={`/journal/${day.date}`} className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:bg-white/[0.06]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-white">{day.displayDate}</p>
                <p className="mt-1 text-sm text-zinc-500">{day.entries.length} entr{day.entries.length === 1 ? "y" : "ies"}</p>
              </div>
              <span className="text-sm text-amber-200">Open →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
