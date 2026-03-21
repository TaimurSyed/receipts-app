import Link from "next/link";
import { ArrowRight, AudioLines, BadgeAlert, NotebookPen } from "lucide-react";
import { Chip } from "@/components/ui/chip";

const proofCards = [
  {
    title: "Pattern detected",
    body: "Avoidance spikes within 24 hours of poor-sleep entries.",
    meta: "High confidence · 6 linked entries",
  },
  {
    title: "Contradiction flagged",
    body: "You call weekends 'rest', but your mood dips harder after unstructured days.",
    meta: "Medium confidence · 4 linked entries",
  },
  {
    title: "This week’s receipt",
    body: "Stress, late nights, and reactive spending formed the main loop this week.",
    meta: "Weekly audit · 9 linked entries",
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 pt-6 lg:px-8">
        <div className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <p className="text-sm font-medium text-white">Receipts</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/sign-in"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
        <div className="space-y-8">
          <div className="flex flex-wrap gap-3">
            <Chip label="Forensic self-insight" />
            <Chip label="Built for patterns, not platitudes" />
          </div>

          <div className="space-y-6">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Your behavior leaves a trail. <span className="text-amber-300">Receipts</span> helps you read it.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl">
              Drop in notes, moods, voice memos, and life chaos. Receipts finds the patterns,
              contradictions, and loops shaping who you’re becoming.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              Get your first receipt
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#product"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              See how it works
            </a>
          </div>

          <div className="grid gap-3 text-sm text-zinc-400 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <NotebookPen className="mb-3 h-5 w-5 text-amber-300" />
              Fast daily logging
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <AudioLines className="mb-3 h-5 w-5 text-amber-300" />
              Voice notes → insight
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <BadgeAlert className="mb-3 h-5 w-5 text-amber-300" />
              Contradictions, not clichés
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-panel backdrop-blur">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">Insight feed</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Fresh evidence from your week</h3>
            </div>
            <div className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-200">
              12 entries analyzed
            </div>
          </div>

          <div className="space-y-4">
            {proofCards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{card.title}</p>
                <p className="mt-3 text-lg font-medium leading-7 text-white">{card.body}</p>
                <p className="mt-3 text-sm text-zinc-400">{card.meta}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
