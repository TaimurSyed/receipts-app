import { Mic, Tags, TrendingUp } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  {
    icon: Mic,
    title: "Capture life fast",
    body: "Type notes, upload voice memos, add a mood, tag what happened, and move on. The app is built for chaotic inputs.",
  },
  {
    icon: Tags,
    title: "Aggregate the evidence",
    body: "Receipts groups entries by timing, tags, mood shifts, and repeated themes so the model has signal instead of noise.",
  },
  {
    icon: TrendingUp,
    title: "Surface the receipts",
    body: "Users get pattern cards, contradiction alerts, and weekly summaries that explain what happened and why it probably matters.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-white/10 bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="A lightweight capture loop with a sharp payoff."
          body="The first version stays deliberately simple: manual input, strong insight generation, and a dark premium feel."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {steps.map(({ icon: Icon, title, body }) => (
            <article key={title} className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <Icon className="h-6 w-6 text-amber-300" />
              <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>
              <p className="mt-4 leading-7 text-zinc-400">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
