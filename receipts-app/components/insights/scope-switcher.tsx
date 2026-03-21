import Link from "next/link";

export function ScopeSwitcher({
  scope,
  week,
  month,
}: {
  scope: "week" | "month";
  week?: string;
  month?: string;
}) {
  const weekHref = week ? `/insights?scope=week&week=${week}` : "/insights?scope=week";
  const monthHref = month ? `/insights?scope=month&month=${month}` : "/insights?scope=month";

  return (
    <div className="inline-flex rounded-full border border-[#5a4b3f] bg-[#1a1714] p-1">
      <Link
        href={weekHref}
        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
          scope === "week" ? "bg-amber-200 text-black" : "text-[#f1e7d4]"
        }`}
      >
        Week
      </Link>
      <Link
        href={monthHref}
        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
          scope === "month" ? "bg-amber-200 text-black" : "text-[#f1e7d4]"
        }`}
      >
        Month
      </Link>
    </div>
  );
}
