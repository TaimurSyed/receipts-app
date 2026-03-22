"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateTonePreference } from "@/app/insights/tone-actions";
import type { TonePreference } from "@/lib/profile";

const tones: Array<{ value: TonePreference; label: string; description: string }> = [
  { value: "gentle", label: "Gentle", description: "Soft and steady." },
  { value: "direct", label: "Direct", description: "Clear, less cushioning." },
  { value: "brutal", label: "Brutal", description: "Honest enough to sting." },
];

export function TonePicker({ currentTone }: { currentTone: TonePreference }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-[2rem] border border-[#4f4338] bg-[#15120f]/80 p-4 sm:min-w-[17rem] sm:max-w-[18.5rem]">
      <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Notebook preference</p>
      <h3 className="mt-2 font-serif text-xl text-[#f1e7d4]">How blunt should it be?</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-400">
        Same insight, different sharpness.
      </p>

      <div className="mt-4 space-y-2.5">
        {tones.map((tone) => {
          const active = currentTone === tone.value;

          return (
            <button
              key={tone.value}
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await updateTonePreference(tone.value);
                  router.refresh();
                })
              }
              className={`w-full rounded-[1.2rem] border px-3.5 py-3 text-left transition disabled:opacity-60 ${
                active
                  ? "border-amber-200/50 bg-amber-200/10 text-[#f5ecd8] shadow-[0_10px_20px_rgba(0,0,0,0.14)]"
                  : "border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.05]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] font-semibold uppercase tracking-[0.14em]">{tone.label}</span>
                {active ? <span className="text-[10px] uppercase tracking-[0.16em] text-amber-200/80">Current</span> : null}
              </div>
              <p className="mt-1.5 text-sm leading-5 text-zinc-400">{tone.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
