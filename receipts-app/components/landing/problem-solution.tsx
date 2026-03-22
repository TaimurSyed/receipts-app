import { SectionHeading } from "@/components/ui/section-heading";

const points = [
  {
    title: "Most self-tracking tools only store data.",
    body: "They count steps, save notes, or chart moods, but they rarely tell you what the pattern means.",
  },
  {
    title: "People are bad at spotting their own loops.",
    body: "We remember intentions, not evidence. We call things random that are actually repeated behaviors.",
  },
  {
    title: "Receipts interprets the trail.",
    body: "It turns messy, human inputs into clear pattern cards, contradiction flags, and weekly audits with proof.",
  },
];

export function ProblemSolution() {
  return (
    <section id="product" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <SectionHeading
        eyebrow="Why this exists"
        title="Not a journal. Not a therapist. Not another dashboard."
        body="Receipts is a pattern detector for real life. It helps users see what their behavior says when their self-story gets fuzzy."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {points.map((point) => (
          <article key={point.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold text-white">{point.title}</h3>
            <p className="mt-4 leading-7 text-zinc-400">{point.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
