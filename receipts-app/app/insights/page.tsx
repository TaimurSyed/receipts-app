import Link from "next/link";
import { GenerateInsightsButton } from "@/components/insights/generate-insights-button";
import { DayList } from "@/components/insights/day-list";
import { InsightCard } from "@/components/insights/insight-card";
import { WeekSelector } from "@/components/insights/week-selector";
import { getEvidenceSnippets, getInsights } from "@/lib/insights";
import { getJournalWeeks, getWeekInsights } from "@/lib/journal";

type PageProps = {
  searchParams?: Promise<{ week?: string }>;
};

export default async function InsightsPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const selectedWeek = params.week;
  const insights = await getInsights();
  const weeks = await getJournalWeeks();
  const activeWeek = weeks.find((week) => week.key === selectedWeek) ?? weeks[0];
  const filteredInsights = getWeekInsights(insights, selectedWeek ?? activeWeek?.key);
  const evidenceIds = [...new Set(filteredInsights.flatMap((insight) => insight.evidence))];
  const evidenceMap = await getEvidenceSnippets(evidenceIds);
  const weeklyNote = filteredInsights.find((insight) => insight.type === "weekly_receipt") ?? filteredInsights[0];
  const sideNotes = filteredInsights.filter((insight) => insight.id !== weeklyNote?.id);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Receipts journal</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">A page from your recent life</h1>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Less dashboard. More journal page with weeks and days you can revisit.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <GenerateInsightsButton />
          <Link href="/app" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
            Back to app
          </Link>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <WeekSelector weeks={weeks} selectedWeek={selectedWeek ?? activeWeek?.key} />
      </div>

      {filteredInsights.length === 0 || !weeklyNote ? (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-zinc-400">
          No insights yet for this week. Save more entries or generate them again.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <section className="rounded-[2.5rem] border border-[#3b3128] bg-[#11100f] p-6 sm:p-8">
            <div className="border-b border-amber-50/10 pb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200/70">Journal page</p>
              <h2 className="mt-3 font-serif text-4xl tracking-tight text-amber-50">What this week kept trying to say</h2>
              <p className="mt-3 text-sm text-zinc-500">{activeWeek?.label ?? today}</p>
            </div>

            <div className="mt-8">
              <InsightCard insight={weeklyNote} evidenceMap={evidenceMap} variant="journal" />
            </div>
          </section>

          <aside className="space-y-5">
            <DayList week={activeWeek} />

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Margin notes</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Other things your behavior was saying</h3>
            </div>

            {sideNotes.length > 0 ? (
              sideNotes.map((insight) => <InsightCard key={insight.id} insight={insight} evidenceMap={evidenceMap} />)
            ) : (
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-zinc-400">
                Generate a few more entries and this page will start to feel fuller.
              </div>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
