import Link from "next/link";
import { BrainCircuit, Sparkles } from "lucide-react";
import { CaptureHub } from "@/components/app/capture-hub";
import { TimelineList } from "@/components/app/timeline-list";
import { InsightCard } from "@/components/insights/insight-card";
import { getDashboardData } from "@/lib/dashboard";
import { getEvidenceSnippets } from "@/lib/insights";

export async function Dashboard() {
  const { entries: recentEntries, insights, dominantTheme } = await getDashboardData();
  const latestInsights = insights.slice(0, 2);
  const evidenceIds = [...new Set(latestInsights.flatMap((insight) => insight.evidence))];
  const evidenceMap = await getEvidenceSnippets(evidenceIds);

  return (
    <section className="space-y-6">
      <div className="notebook-page-edge rounded-[2rem] border border-[#4a3c2f] bg-[linear-gradient(180deg,#17130f_0%,#0f0d0b_100%)] p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-amber-300">Notebook home</p>
            <h1 className="mt-3 font-serif text-4xl text-[#f5ecd8] sm:text-5xl">
              Catch the day, then read it back later.
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-8 text-zinc-400">
              `/app` is now the place to capture quickly and see the freshest movement in your notebook, not a half-finished dashboard trying to do everything.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="#entry-form" className="inline-flex items-center gap-2 rounded-full bg-[#e7d8b4] px-4 py-2 text-sm font-semibold text-black">
              Add something
            </a>
            <Link href="/insights" className="inline-flex items-center gap-2 rounded-full border border-[#5a4b3f] bg-[#1a1714] px-4 py-2 text-sm font-semibold text-[#f1e7d4]">
              <Sparkles className="h-4 w-4" />
              Open journal
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Current read</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-2xl border border-[#4f4338] bg-[#15120f]/80 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Entries visible</p>
                <p className="mt-3 text-3xl font-semibold text-white">{recentEntries.length}</p>
              </div>
              <div className="rounded-2xl border border-[#4f4338] bg-[#15120f]/80 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Signals found</p>
                <p className="mt-3 text-3xl font-semibold text-white">{insights.length}</p>
              </div>
              <div className="rounded-2xl border border-[#4f4338] bg-[#15120f]/80 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Dominant theme</p>
                <p className="mt-3 text-xl font-semibold capitalize text-white">{dominantTheme}</p>
              </div>
            </div>
          </div>

          <CaptureHub />
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Fresh receipts</p>
                <h2 className="mt-2 font-serif text-3xl text-[#f5ecd8]">What your week is already hinting at</h2>
              </div>
              <BrainCircuit className="h-5 w-5 text-amber-300" />
            </div>

            <div className="mt-6 space-y-4">
              {latestInsights.length > 0 ? (
                latestInsights.map((insight) => <InsightCard key={insight.id} insight={insight} evidenceMap={evidenceMap} />)
              ) : (
                <div className="rounded-[1.8rem] border border-[#4f4338] bg-[#15120f]/85 p-5 text-zinc-400">
                  No saved insights yet. Capture a few notes, then generate the first read of your week.
                </div>
              )}
            </div>
          </div>

          <TimelineList entries={recentEntries} />
        </div>
      </div>
    </section>
  );
}
