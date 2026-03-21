import Link from "next/link";
import { AnnotationPanel } from "@/components/annotations/annotation-panel";
import { GenerateInsightsButton } from "@/components/insights/generate-insights-button";
import { InsightCard } from "@/components/insights/insight-card";
import { TonePicker } from "@/components/insights/tone-picker";
import { NotebookShell } from "@/components/journal/notebook-shell";
import { getAnnotations } from "@/lib/annotations";
import { getEvidenceSnippets, getInsights } from "@/lib/insights";
import { getJournalArchive, getJournalWeeks, getWeekInsights } from "@/lib/journal";
import { getTonePreference } from "@/lib/profile";

type PageProps = {
  searchParams?: Promise<{ week?: string }>;
};

export default async function InsightsPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const selectedWeek = params.week;
  const [insights, weeks, archive, currentTone] = await Promise.all([
    getInsights(),
    getJournalWeeks(),
    getJournalArchive(),
    getTonePreference(),
  ]);
  const activeWeek = weeks.find((week) => week.key === selectedWeek) ?? weeks[0];
  const filteredInsights = getWeekInsights(insights, selectedWeek ?? activeWeek?.key);
  const evidenceIds = [...new Set(filteredInsights.flatMap((insight) => insight.evidence))];
  const evidenceMap = await getEvidenceSnippets(evidenceIds);
  const weeklyNote = filteredInsights.find((insight) => insight.type === "weekly_receipt") ?? filteredInsights[0];
  const sideNotes = filteredInsights.filter((insight) => insight.id !== weeklyNote?.id);
  const annotations = activeWeek ? await getAnnotations("week", activeWeek.key) : [];

  return (
    <NotebookShell archive={archive} selectedWeek={selectedWeek ?? activeWeek?.key}>
      <div className="rounded-[2.7rem] border border-[#4a3c2f] bg-[linear-gradient(180deg,#15120f_0%,#0f0d0b_100%)] p-6 sm:p-8 shadow-panel">
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
          <div className="rounded-[2rem] border border-[#4f4338] bg-[#15120f] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Selected chapter</p>
            <h2 className="mt-2 font-serif text-2xl text-[#f1e7d4]">{activeWeek?.label ?? "Recent days"}</h2>
          </div>
          <TonePicker currentTone={currentTone} />
        </div>

        {filteredInsights.length === 0 || !weeklyNote ? (
          <div className="rounded-[2rem] border border-[#4f4338] bg-[#15120f] p-8 text-zinc-400">
            No insights yet for this week. Save more entries or generate them again.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <section className="space-y-6 rounded-[2.5rem] border border-[#4a3c2f] bg-[linear-gradient(180deg,#1a1612_0%,#11100f_100%)] p-6 sm:p-10">
              <div className="border-b border-[#5e503f]/40 pb-6">
                <p className="text-xs uppercase tracking-[0.3em] text-[#dbc59b]">Weekly page</p>
                <h2 className="mt-3 font-serif text-5xl tracking-tight text-[#f5ecd8]">What this week kept trying to say</h2>
                <p className="mt-3 text-sm text-zinc-500">{activeWeek?.label ?? "Recent days"}</p>
              </div>

              <div className="border-l border-[#6a5847]/40 pl-6">
                <InsightCard insight={weeklyNote} evidenceMap={evidenceMap} variant="journal" />
              </div>

              {activeWeek ? (
                <AnnotationPanel
                  pageType="week"
                  pageKey={activeWeek.key}
                  annotations={annotations}
                  prompt="If the page missed something, you can answer back here. Treat it like writing in the margin of your own week."
                />
              ) : null}
            </section>

            <aside className="space-y-5">
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
      </div>
    </NotebookShell>
  );
}
