import Link from "next/link";
import { AnnotationPanel } from "@/components/annotations/annotation-panel";
import { GenerateInsightsButton } from "@/components/insights/generate-insights-button";
import { InsightCard } from "@/components/insights/insight-card";
import { MonthSelector } from "@/components/insights/month-selector";
import { ScopeSwitcher } from "@/components/insights/scope-switcher";
import { SupportingNotesDeck } from "@/components/insights/supporting-notes-deck";
import { TonePicker } from "@/components/insights/tone-picker";
import { NotebookShell } from "@/components/journal/notebook-shell";
import { PageNav } from "@/components/navigation/page-nav";
import { getAnnotations } from "@/lib/annotations";
import { getEvidenceSnippets, getInsights } from "@/lib/insights";
import { getJournalArchive, getJournalWeeks, getMonthInsights, getWeekInsights } from "@/lib/journal";
import { getTonePreference } from "@/lib/profile";

type PageProps = {
  searchParams?: Promise<{ week?: string; month?: string; scope?: "week" | "month" }>;
};

export default async function InsightsPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const scope = params.scope === "month" ? "month" : "week";
  const selectedWeek = params.week;
  const selectedMonth = params.month;
  const [insights, weeks, archive, currentTone] = await Promise.all([
    getInsights(),
    getJournalWeeks(),
    getJournalArchive(),
    getTonePreference(),
  ]);
  const allMonths = archive.flatMap((year) => year.months);
  const activeWeek = weeks.find((week) => week.key === selectedWeek) ?? weeks[0];
  const activeMonth = allMonths.find((month) => month.key === selectedMonth) ?? allMonths[0];
  const filteredInsights =
    scope === "month"
      ? getMonthInsights(insights, selectedMonth ?? activeMonth?.key)
      : getWeekInsights(insights, selectedWeek ?? activeWeek?.key);
  const evidenceIds = [...new Set(filteredInsights.flatMap((insight) => insight.evidence))];
  const evidenceMap = await getEvidenceSnippets(evidenceIds);
  const primaryNote = filteredInsights.find((insight) => insight.type === "weekly_receipt") ?? filteredInsights[0];
  const sideNotes = filteredInsights.filter((insight) => insight.id !== primaryNote?.id);
  const annotations = scope === "week" && activeWeek ? await getAnnotations("week", activeWeek.key) : [];
  const lastUpdatedAt = filteredInsights
    .map((insight) => insight.createdAt)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);

  return (
    <NotebookShell archive={archive} selectedWeek={scope === "week" ? selectedWeek ?? activeWeek?.key : undefined}>
      <PageNav
        items={[
          { label: "App", href: "/app" },
          { label: "Journal", href: "/insights" },
          { label: scope === "month" ? "Month" : "Week" },
        ]}
      />

      <div className="notebook-page-edge notebook-paper rounded-[2.7rem] border border-[#4a3c2f] bg-[linear-gradient(180deg,#17130f_0%,#0f0d0b_100%)] p-6 sm:p-8 lg:p-10">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Receipts journal</p>
            <h1 className="mt-3 font-serif text-4xl text-[#f5ecd8] sm:text-5xl">A page from your recent life</h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-8 text-zinc-400">
              Less dashboard. More journal page with weeks and days you can revisit.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ScopeSwitcher scope={scope} week={selectedWeek ?? activeWeek?.key} month={selectedMonth ?? activeMonth?.key} />
            <GenerateInsightsButton scope={scope} periodKey={scope === "month" ? selectedMonth ?? activeMonth?.key : selectedWeek ?? activeWeek?.key} />
            <Link href="/app" className="rounded-full border border-[#5a4b3f] bg-[#1a1714] px-4 py-2 text-sm font-semibold text-[#f1e7d4]">
              Back to app
            </Link>
          </div>
        </div>

        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="rounded-[2rem] border border-[#4f4338] bg-[#15120f]/80 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Selected chapter</p>
            <h2 className="mt-2 font-serif text-2xl text-[#f1e7d4]">{scope === "month" ? activeMonth?.label ?? "Recent month" : activeWeek?.label ?? "Recent days"}</h2>
            <p className="mt-3 text-sm text-zinc-500">
              {lastUpdatedAt
                ? `Last insight refresh ${new Date(lastUpdatedAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}`
                : scope === "month"
                  ? "No month insight refresh yet for this chapter."
                  : "No auto-refresh yet for this week."}
            </p>
          </div>
          <TonePicker currentTone={currentTone} />
        </div>

        {scope === "month" ? <MonthSelector months={allMonths} selectedMonth={selectedMonth ?? activeMonth?.key} /> : null}

        {filteredInsights.length === 0 || !primaryNote ? (
          <div className="rounded-[2rem] border border-[#4f4338] bg-[#15120f]/80 p-8 text-zinc-400">
            {scope === "month"
              ? "No month read yet. Let the notebook fill up a little, then generate a broader chapter when you want to see what kept repeating."
              : "No weekly read yet. Give it a few real notes — moments, moods, contradictions, the small stuff you usually hand-wave away — and this page will start sounding like it knows you."}
          </div>
        ) : (
          <div className="space-y-6">
            <section className="space-y-6 rounded-[2.6rem] border border-[#4a3c2f] bg-[linear-gradient(180deg,#1a1612_0%,#11100f_100%)] p-6 sm:p-10">
              <div className="border-b border-[#5e503f]/40 pb-6">
                <p className="text-xs uppercase tracking-[0.3em] text-[#dbc59b]">{scope === "month" ? "Monthly page" : "Weekly page"}</p>
                <h2 className="mt-4 font-serif text-4xl tracking-tight text-[#f5ecd8] sm:text-5xl">
                  {scope === "month" ? "What this month kept circling back to" : "What this week kept trying to say"}
                </h2>
                <p className="mt-4 text-sm text-zinc-500">{scope === "month" ? activeMonth?.label ?? "Recent month" : activeWeek?.label ?? "Recent days"}</p>
              </div>

              <div className="border-l border-[#6a5847]/40 pl-6 sm:pl-8">
                <InsightCard insight={primaryNote} evidenceMap={evidenceMap} variant="journal" />
              </div>

              {scope === "week" && activeWeek ? (
                <AnnotationPanel
                  pageType="week"
                  pageKey={activeWeek.key}
                  annotations={annotations}
                  prompt="If the page missed something, you can answer back here. Treat it like writing in the margin of your own week."
                />
              ) : null}
            </section>

            <section className="space-y-5 rounded-[2.3rem] border border-[#4f4338] bg-[#15120f]/70 p-5 sm:p-6">
              <SupportingNotesDeck notes={sideNotes} evidenceMap={evidenceMap} />
            </section>
          </div>
        )}
      </div>
    </NotebookShell>
  );
}
