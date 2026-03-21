import type { DailyReflection } from "@/lib/daily-reflection";

export function DailyReflectionCard({ reflection }: { reflection: DailyReflection }) {
  return (
    <section className="rounded-[2rem] border border-amber-100/10 bg-[#171412] p-6 sm:p-7">
      <div className="border-b border-amber-50/10 pb-5">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-200/70">Daily reflection</p>
        <h2 className="mt-3 font-serif text-3xl tracking-tight text-amber-50">What this day seems to have been doing</h2>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">What seemed to happen</p>
          <p className="mt-3 whitespace-pre-line font-serif text-[18px] leading-9 text-zinc-200">{reflection.summary}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">What may have shifted it</p>
          <p className="mt-3 whitespace-pre-line font-serif text-[17px] leading-8 text-zinc-300">{reflection.trigger}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">What may help next time</p>
          <p className="mt-3 whitespace-pre-line font-serif text-[17px] leading-8 text-zinc-300">{reflection.nextStep}</p>
        </div>
      </div>
    </section>
  );
}
