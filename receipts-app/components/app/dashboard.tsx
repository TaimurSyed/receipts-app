import Link from "next/link";
import { AudioLines, BrainCircuit, Plus } from "lucide-react";
import { EntryForm } from "@/components/app/entry-form";
import { getEntries } from "@/lib/entries";
import { insightCards } from "@/lib/mock-data";

function moodLabel(score: number) {
  return ["Very low", "Low", "Neutral", "Good", "Great"][score - 1] ?? "Unknown";
}

export async function Dashboard() {
  const recentEntries = await getEntries();

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
              Fast capture on one side, evidence-backed insight on the other. The app now supports a real server-side save path once Supabase keys are added.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">
              <Plus className="h-4 w-4" />
              Add entry
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
              <AudioLines className="h-4 w-4" />
              Upload voice note
            </button>
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
              <p className="mt-4 text-3xl font-semibold text-white">{insightCards.length}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Mode</p>
              <p className="mt-4 text-2xl font-semibold text-white">Hybrid mock/live</p>
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
              {insightCards.map((card) => (
                <article key={card.id} className="rounded-3xl border border-white/10 bg-black/20 p-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-amber-200">
                      {card.type}
                    </span>
                    <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">{card.confidence} confidence</span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3>
                  <p className="mt-3 leading-7 text-zinc-400">{card.body}</p>
                  <p className="mt-4 text-sm text-zinc-500">Evidence: {card.evidence.join(", ")}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <EntryForm />

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
