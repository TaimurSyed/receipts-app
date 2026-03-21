import { SectionHeading } from "@/components/ui/section-heading";

const left = ["Email or magic-link auth", "Text entries", "Mood capture", "Preset tags", "Voice note upload + transcription"];
const right = ["Timeline view", "Pattern cards", "Contradiction alerts", "Weekly receipt summary", "Insight feedback loop"];

export function MvpSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <SectionHeading
        eyebrow="MVP"
        title="The smallest version that still feels a little dangerous."
        body="This version is focused on interpretation. No bank syncing, no sleep APIs, no fake complexity — just enough input and enough intelligence to make users feel seen."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.22em] text-zinc-500">Capture</p>
          <ul className="mt-5 space-y-4 text-zinc-300">
            {left.map((item) => (
              <li key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.22em] text-zinc-500">Output</p>
          <ul className="mt-5 space-y-4 text-zinc-300">
            {right.map((item) => (
              <li key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
