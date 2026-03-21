"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { generateInsights } from "@/app/insights/actions";

export function GenerateInsightsButton({ week }: { week?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={() => {
          startTransition(async () => {
            const result = await generateInsights(week);
            setMessage(result.message);
            router.refresh();
          });
        }}
        disabled={pending}
        className="rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Generating..." : week ? "Generate this week" : "Generate insights"}
      </button>
      {message ? <p className="max-w-sm text-right text-xs text-zinc-400">{message}</p> : null}
    </div>
  );
}
