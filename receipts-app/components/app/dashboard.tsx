import Link from "next/link";
import { BrainCircuit, Plus, Sparkles } from "lucide-react";
import { EntryForm } from "@/components/app/entry-form";
import { InsightCard } from "@/components/insights/insight-card";
import { getDashboardData } from "@/lib/dashboard";

function moodLabel(score: number) {
  return ["Very low", "Low", "Neutral", "Good", "Great"][score - 1] ?? "Unknown";
}

export async function Dashboard() {
  const { entries: recentEntries, insights, dominantTheme } = await getDashboardData();
  const latestInsights = insights.slice(0, 3);

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-amber-300">Overview</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Your week, under intelligent review.
            </h1>
            <p className="mt-3 max-w-2xl text-zinc-400">
              Capture the raw material fast, then let Receipts turn it into patterns, contradictions, and receipts that feel specific enough to sting a little.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="#entry-form" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
              <Plus className="h-4 w-4" />
              Add entry
            </a>
            <Link href="/insights" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
              <Sparkles className="h-4 w-4" />
              View insights
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Entries visible</p>
              <p className="mt-4 text-3xl font-semibold text-white">{recentEntries.length}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Signals found</p>
              <p className="mt-4 text-3xl font-semibold text-white">{insights.length}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Dominant theme</p>
              <p className="mt-4 text-2xl font-semibold capitalize text-white">{dominantTheme}</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Latest receipts</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Patterns worth paying attention to</h2>
              </div>
              <BrainCircuit className="h-5 w-5 text-amber-300" />
            </div>

            <div className="mt-6 space-y-4">
              {latestInsights.length > 0 ? (
                latestInsights.map((insight) => <InsightCard key={insight.id} insight={insight} />)
              ) : (
                <div className="rounded-3xl border border-white/10 bg-black/20 p-5 text-zinc-400">
                  No saved insights yet. Add a few entries, then head to the insights page and generate them.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div id="entry-form">
            <EntryForm />
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Recent timeline</p>
            <div className="mt-5 space-y-4">
              {recentEntries.map((entry) => (
                <article key={entry.id} className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-medium text-white">{entry.title}</h3>
                      <p className="mt-1 text-sm text-zinc-500">{entry.time}</p>
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                      {moodLabel(entry.mood)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{entry.content}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.tags.map((tag: string) => (
                      <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300">
                        #{tag}
                      </span>
                    ))}
                    {entry.usedInInsight ? (
                      <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs text-amber-200">Used in insight</span>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
