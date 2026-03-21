"use server";

import { hasOpenAiKey } from "@/lib/ai";
import { hasSupabaseEnv } from "@/lib/env";
import { generateInsightsForMonth, generateInsightsForWeek } from "@/lib/insight-generation";

export async function generateInsights(scope: "week" | "month" = "week", key?: string) {
  if (!hasSupabaseEnv()) return { ok: false, message: "Supabase is not configured." };
  if (!hasOpenAiKey()) return { ok: false, message: "Add OPENAI_API_KEY to enable real insight generation." };

  return scope === "month" ? generateInsightsForMonth(key) : generateInsightsForWeek(key);
}
