import Link from "next/link";
import type { JournalMonth } from "@/lib/journal";

export function MonthSelector({ months, selectedMonth }: { months: JournalMonth[]; selectedMonth?: string }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#131110] p-4 sm:p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Browse months</p>
      <div className="mt-4 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
        {months.map((month) => (
          <Link
            key={month.key}
            href={`/insights?scope=month&month=${month.key}`}
            className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
              selectedMonth === month.key ? "bg-amber-200 text-black" : "border border-white/10 bg-white/5 text-zinc-300"
            }`}
          >
            {month.label} {month.year}
          </Link>
        ))}
      </div>
    </div>
  );
}
