import Link from "next/link";
import { AnnotationOverlayLauncher } from "@/components/annotations/annotation-overlay-launcher";
import { GenerateInsightsButton } from "@/components/insights/generate-insights-button";
import { InsightCard } from "@/components/insights/insight-card";
import { MonthSelector } from "@/components/insights/month-selector";
import { ScopeSwitcher } from "@/components/insights/scope-switcher";
import { SupportingNotesDeck } from "@/components/insights/supporting-notes-deck";
import { TonePicker } from "@/components/insights/tone-picker";
import { WeekSelector } from "@/components/insights/week-selector";
import { NotebookShell } from "@/components/journal/notebook-shell";
import { PageNav } from "@/components/navigation/page-nav";
import { getAnnotations } from "@/lib/annotations";
import { getEvidenceSnippets, getInsights } from "@/lib/insights";
import { getJournalArchive, getJournalWeeks, getMonthInsights, getWeekInsights } from "@/lib/journal";
import { getTonePreference } from "@/lib/profile";

type PageProps = {
  searchParams?: Promise<{ week?: string; month?: string; scope?: "week" | "month" }>;
};

function formatUpdatedLabel(lastUpdatedAt?: string, scope?: "week" | "month") {
  if (!lastUpdatedAt) {
    return scope === "month"
      ? "No month insight refresh yet for this chapter."
      : "No auto-refresh yet for this week.";
  }

  return `Last insight refresh ${new Date(lastUpdatedAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

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
  const activeLabel = scope === "month" ? activeMonth?.label ?? "Recent month" : activeWeek?.label ?? "Recent days";

  return (
    <NotebookShell archive={archive} selectedWeek={scope === "week" ? selectedWeek ?? activeWeek?.key : undefined}>
      <PageNav
        items={[
          { label: "App", href: "/app" },
          { label: "Journal", href: "/insights" },
          { label: scope === "month" ? "Month" : "Week" },
        ]}
      />

      <div className="notebook-page-edge notebook-paper rounded-[2.4rem] border border-[#4a3c2f] bg-[linear-gradient(180deg,#17130f_0%,#0f0d0b_100%)] p-4 sm:rounded-[2.7rem] sm:p-8 lg:p-10">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Receipts journal</p>
            <h1 className="mt-3 font-serif text-4xl text-[#f5ecd8] sm:text-5xl">A page from your recent life</h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-8 text-zinc-400">
              Less dashboard. More chapter spread: one main read, side notes around it, and space to answer back.
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

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
          <div className="space-y-4">
            <div className="rounded-[2rem] border border-[#4f4338] bg-[#15120f]/80 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Selected chapter</p>
              <h2 className="mt-2 font-serif text-2xl text-[#f1e7d4]">{activeLabel}</h2>
              <p className="mt-3 text-sm text-zinc-500">{formatUpdatedLabel(lastUpdatedAt, scope)}</p>
            </div>

            {scope === "month" ? (
              <MonthSelector months={allMonths} selectedMonth={selectedMonth ?? activeMonth?.key} />
            ) : (
              <WeekSelector weeks={weeks} selectedWeek={selectedWeek ?? activeWeek?.key} />
            )}
          </div>

          <div className="rounded-[2rem] border border-[#4f4338] bg-[#15120f]/80 p-5">
            <TonePicker currentTone={currentTone} />
          </div>
        </div>

        {filteredInsights.length === 0 || !primaryNote ? (
          <div className="mt-8 rounded-[2rem] border border-[#4f4338] bg-[#15120f]/80 p-8 text-zinc-400">
            {scope === "month"
              ? "No month read yet. Let the notebook fill up a little, then generate a broader chapter when you want to see what kept repeating."
              : "No weekly read yet. Give it a few real notes — moments, moods, contradictions, the small stuff you usually hand-wave away — and this page will start sounding like it knows you."}
          </div>
        ) : (
          <section className="mt-8 rounded-[2.6rem] border border-[#4a3c2f] bg-[linear-gradient(180deg,#1a1612_0%,#11100f_100%)] p-4 sm:p-6 lg:p-8">
            <div className="border-b border-[#5e503f]/40 pb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#dbc59b]">{scope === "month" ? "Monthly page" : "Weekly page"}</p>
              <h2 className="mt-4 font-serif text-4xl tracking-tight text-[#f5ecd8] sm:text-5xl">
                {scope === "month" ? "What this month keeps scribbling in the margins" : "What this week seems to be saying"}
              </h2>
              <p className="mt-4 text-sm text-zinc-500">{activeLabel}</p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
                One main notebook read first, then lighter side notes around it — more collaborative journal, less deck of analysis cards.
              </p>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_minmax(280px,0.88fr)] xl:items-start">
              <div className="min-w-0 rounded-[2rem] border border-[#5e503f]/25 bg-[#120f0d]/70 p-4 sm:p-6">
                <div className="border-l border-[#6a5847]/40 pl-4 sm:pl-6">
                  <InsightCard insight={primaryNote} evidenceMap={evidenceMap} variant="journal" />
                </div>
              </div>

              <aside className="space-y-6 xl:sticky xl:top-6">
                <div className="rounded-[1.8rem] border border-[#4f4338] bg-[#15120f]/80 p-4 sm:p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Spread notes</p>
                  <div className="mt-3 space-y-3 text-sm leading-7 text-zinc-300">
                    <p>Primary read in the center, smaller threads off to the side, and the conversation kept nearby so the page still breathes.</p>
                    <p>{sideNotes.length} side note{sideNotes.length === 1 ? "" : "s"} waiting in the margin.</p>
                    {scope === "week" ? <p>{annotations.length} written response{annotations.length === 1 ? "" : "s"} on this week so far.</p> : null}
                  </div>
                </div>

                {scope === "week" && activeWeek ? (
                  <AnnotationOverlayLauncher
                    title="Week margin conversation"
                    subtitle="Open the full back-and-forth without cramming it into the side rail."
                    count={annotations.length}
                    pageType="week"
                    pageKey={activeWeek.key}
                    annotations={annotations}
                    prompt="If the page missed something, you can answer back here. Treat it like writing in the margin of your own week."
                  />
                ) : null}

                {sideNotes.length > 0 ? <SupportingNotesDeck notes={sideNotes} evidenceMap={evidenceMap} /> : null}
              </aside>
            </div>
          </section>
        )}
      </div>
    </NotebookShell>
  );
}
