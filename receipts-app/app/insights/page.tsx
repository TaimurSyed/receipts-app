import Link from "next/link";
import { GenerateInsightsButton } from "@/components/insights/generate-insights-button";
import { DayList } from "@/components/insights/day-list";
import { InsightCard } from "@/components/insights/insight-card";
import { TonePicker } from "@/components/insights/tone-picker";
import { WeekSelector } from "@/components/insights/week-selector";
import { getEvidenceSnippets, getInsights } from "@/lib/insights";
import { getJournalWeeks, getWeekInsights } from "@/lib/journal";
import { getTonePreference } from "@/lib/profile";

type PageProps = {
  searchParams?: Promise<{ week?: string }>;
};

export default async function InsightsPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const selectedWeek = params.week;
  const [insights, weeks, currentTone] = await Promise.all([getInsights(), getJournalWeeks(), getTonePreference()]);
  const activeWeek = weeks.find((week) => week.key === selectedWeek) ?? weeks[0];
  const filteredInsights = getWeekInsights(insights, selectedWeek ?? activeWeek?.key);
  const evidenceIds = [...new Set(filteredInsights.flatMap((insight) => insight.evidence))];
  const evidenceMap = await getEvidenceSnippets(evidenceIds);
  const weeklyNote = filteredInsights.find((insight) => insight.type === "weekly_receipt") ?? filteredInsights[0];
  const sideNotes = filteredInsights.filter((insight) => insight.id !== weeklyNote?.id);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Receipts journal</p>
          <h1 className="mt-2 font-serif text-4xl text-[#f5ecd8]">A page from your recent life</h1>
          <p className="mt-3 max-w-2xl text-zinc-400">
            Less dashboard. More journal page with weeks and days you can revisit.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <GenerateInsightsButton week={selectedWeek ?? activeWeek?.key} />
          <Link href="/app" className="rounded-full border border-[#5a4b3f] bg-[#1a1714] px-4 py-2 text-sm font-semibold text-[#f1e7d4]">
            Back to app
          </Link>
        </div>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
        <WeekSelector weeks={weeks} selectedWeek={selectedWeek ?? activeWeek?.key} />
        <TonePicker currentTone={currentTone} />
      </div>

      {filteredInsights.length === 0 || !weeklyNote ? (
        <div className="rounded-[2rem] border border-[#4f4338] bg-[#15120f] p-8 text-zinc-400">
          No insights yet for this week. Save more entries or generate them again.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <section className="rounded-[2.5rem] border border-[#4a3c2f] bg-[linear-gradient(180deg,#181410_0%,#11100f_100%)] p-6 sm:p-10 shadow-panel">
            <div className="border-b border-[#5e503f]/40 pb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#dbc59b]">Journal page</p>
              <h2 className="mt-3 font-serif text-5xl tracking-tight text-[#f5ecd8]">What this week kept trying to say</h2>
              <p className="mt-3 text-sm text-zinc-500">{activeWeek?.label ?? "Recent days"}</p>
            </div>

            <div className="mt-8 border-l border-[#6a5847]/40 pl-6">
              <InsightCard insight={weeklyNote} evidenceMap={evidenceMap} variant="journal" />
            </div>
          </section>

          <aside className="space-y-5">
            <DayList week={activeWeek} />

            <div className="rounded-[2rem] border border-[#4f4338] bg-[#15120f] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Margin notes</p>
              <h3 className="mt-2 font-serif text-2xl text-[#f1e7d4]">Other things your behavior was saying</h3>
            </div>

            {sideNotes.length > 0 ? (
              sideNotes.map((insight) => <InsightCard key={insight.id} insight={insight} evidenceMap={evidenceMap} />)
            ) : (
              <div className="rounded-[2rem] border border-[#4f4338] bg-[#15120f] p-6 text-zinc-400">
                Generate a few more entries and this page will start to feel fuller.
              </div>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
