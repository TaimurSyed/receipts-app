import Link from "next/link";
import { ArrowRight, BookOpenText, Sparkles } from "lucide-react";
import { CaptureHub } from "@/components/app/capture-hub";
import { RecentNotesPreview } from "@/components/app/recent-notes-preview";
import { InsightCard } from "@/components/insights/insight-card";
import { getDashboardData } from "@/lib/dashboard";
import { getEvidenceSnippets } from "@/lib/insights";
import { getImagePlaybackUrl, getVoicePlaybackUrl } from "@/lib/entries";

function shorten(text: string, maxLength = 140) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trimEnd()}…`;
}

export async function Dashboard() {
  const { entries: recentEntries, insights, dominantTheme } = await getDashboardData();
  const latestInsight = insights[0];
  const evidenceIds = [...new Set((latestInsight ? latestInsight.evidence : []).flatMap((id) => id))];
  const evidenceMap = await getEvidenceSnippets(evidenceIds);
  const playbackUrls = Object.fromEntries(
    await Promise.all(
      recentEntries.map(async (entry) => [entry.id, await getVoicePlaybackUrl(entry.audioPath)] as const),
    ),
  );
  const imageUrls = Object.fromEntries(
    await Promise.all(
      recentEntries.map(async (entry) => [entry.id, await getImagePlaybackUrl(entry.imagePath)] as const),
    ),
  );
  const marginReads = insights.slice(0, 3);

  return (
    <section className="space-y-6">
      <div className="notebook-page-edge rounded-[2rem] border border-[#4a3c2f] bg-[linear-gradient(180deg,#17130f_0%,#0f0d0b_100%)] p-5 sm:p-6 lg:p-7">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] xl:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-amber-300">Journal home</p>
            <h1 className="mt-3 font-serif text-4xl text-[#f5ecd8] sm:text-5xl">
              Open the notebook where life is still warm.
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-8 text-zinc-400">
              Catch something quickly, skim the freshest movement, and dip into the current chapter without the app turning your life into a dashboard.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <a href="#entry-form" className="inline-flex items-center gap-2 rounded-full bg-[#e7d8b4] px-4 py-2 text-sm font-semibold text-black">
                Add something
              </a>
              <Link href="/insights" className="inline-flex items-center gap-2 rounded-full border border-[#5a4b3f] bg-[#1a1714] px-4 py-2 text-sm font-semibold text-[#f1e7d4]">
                <Sparkles className="h-4 w-4" />
                Open chapter spread
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[1.6rem] border border-[#4f4338] bg-[#15120f]/80 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Theme returning most</p>
              <p className="mt-3 text-xl font-semibold capitalize text-white">{dominantTheme}</p>
            </div>
            <div className="rounded-[1.6rem] border border-[#4f4338] bg-[#15120f]/80 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Fresh captures in view</p>
              <p className="mt-3 text-3xl font-semibold text-white">{recentEntries.length}</p>
            </div>
            <div className="rounded-[1.6rem] border border-[#4f4338] bg-[#15120f]/80 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Home mood</p>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                Chronological first, collaborative second. The read should follow the life, not interrupt it.
              </p>
            </div>
          </div>
        </div>
      </div>

      <CaptureHub />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.18fr)_minmax(300px,0.82fr)] xl:items-start">
        <div className="xl:min-w-0">
          <RecentNotesPreview entries={recentEntries} insights={insights} playbackUrls={playbackUrls} imageUrls={imageUrls} />
        </div>

        <aside className="space-y-6 xl:min-w-0">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Current chapter</p>
                <h2 className="mt-2 font-serif text-3xl text-[#f5ecd8]">What the notebook keeps circling</h2>
              </div>
              <BookOpenText className="h-5 w-5 text-amber-300" />
            </div>

            <div className="mt-5">
              {latestInsight ? (
                <InsightCard insight={latestInsight} evidenceMap={evidenceMap} variant="margin" />
              ) : (
                <div className="rounded-[1.6rem] border border-[#4f4338] bg-[#15120f]/85 p-5 text-zinc-400">
                  Your notebook is still quiet. Add a few honest notes and the first shared read will start to show up here.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Margin stack</p>
                <h2 className="mt-2 font-serif text-2xl text-[#f5ecd8]">Short reads nearby</h2>
              </div>
              <Sparkles className="h-5 w-5 text-amber-300" />
            </div>

            <div className="mt-5 space-y-4">
              {marginReads.length > 0 ? (
                marginReads.map((insight, index) => (
                  <div key={insight.id} className={`rounded-[1.5rem] border border-[#4f4338] bg-[#15120f]/85 p-4 ${index === 1 ? "xl:ml-4" : index === 2 ? "xl:mr-4" : ""}`}>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-amber-200/60">{insight.scope === "month" ? "Month read" : "Week read"}</p>
                    <h3 className="mt-2 font-serif text-lg text-[#f1e7d4]">{insight.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-zinc-300">{shorten(insight.body)}</p>
                  </div>
                ))
              ) : (
                <p className="rounded-[1.5rem] border border-[#4f4338] bg-[#15120f]/85 p-4 text-sm leading-7 text-zinc-400">
                  Once the notebook has a little history, short AI reads will start piling up here too.
                </p>
              )}
            </div>

            <Link href="/insights" className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#5a4b3f] px-4 py-2 text-sm font-semibold text-[#f1e7d4] transition hover:bg-white/5">
              Open the wider spread
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
