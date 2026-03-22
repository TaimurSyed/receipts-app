import type { DailyReflection } from "@/lib/daily-reflection";

export function DailyReflectionCard({ reflection }: { reflection: DailyReflection }) {
  return (
    <section className="living-note note-stack-a notebook-page-edge notebook-paper rounded-[2.3rem] border border-amber-100/10 bg-[#171412] p-6 sm:p-8">
      <div className="border-b border-amber-50/10 pb-5 pl-6 sm:pl-10">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-200/70">AI margin note</p>
        <h2 className="mt-3 font-serif text-3xl tracking-tight text-amber-50 sm:text-4xl">A note in the margin of this day</h2>
      </div>

      <div className="mt-8 space-y-8 pl-6 sm:pl-10">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">What it seems like you were moving through</p>
          <p className="mt-4 whitespace-pre-line font-serif text-[18px] leading-9 text-zinc-200">{reflection.summary}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">What may have bent the page</p>
          <p className="mt-4 whitespace-pre-line font-serif text-[17px] leading-8 text-zinc-300">{reflection.trigger}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">A gentle note for later</p>
          <p className="mt-4 whitespace-pre-line font-serif text-[17px] leading-8 text-zinc-300">{reflection.nextStep}</p>
        </div>
      </div>
    </section>
  );
}
