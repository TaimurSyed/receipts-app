"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateTonePreference } from "@/app/insights/tone-actions";
import type { TonePreference } from "@/lib/profile";

const tones: TonePreference[] = ["gentle", "direct", "brutal"];

export function TonePicker({ currentTone }: { currentTone: TonePreference }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#131110] p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Writing tone</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tones.map((tone) => (
          <button
            key={tone}
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await updateTonePreference(tone);
                router.refresh();
              })
            }
            className={`rounded-full px-4 py-2 text-sm transition ${
              currentTone === tone ? "bg-amber-200 text-black" : "border border-white/10 bg-white/5 text-zinc-300"
            } disabled:opacity-60`}
          >
            {tone}
          </button>
        ))}
      </div>
    </div>
  );
}
