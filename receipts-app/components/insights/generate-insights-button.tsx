"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { generateInsights } from "@/app/insights/actions";

export function GenerateInsightsButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        startTransition(async () => {
          await generateInsights();
          router.refresh();
        });
      }}
      disabled={pending}
      className="rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Generating..." : "Generate insights"}
    </button>
  );
}
