"use server";

import { revalidatePath } from "next/cache";
import { hasOpenAiKey, createOpenAiClient } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/env";

export async function generateInsights() {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Supabase is not configured." };
  }

  if (!hasOpenAiKey()) {
    return { ok: false, message: "Add OPENAI_API_KEY to enable real insight generation." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "Sign in first." };
  }

  const { data: entries, error: entryError } = await supabase
    .from("entries")
    .select("id, title, content, mood_score, tags, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(12);

  if (entryError || !entries || entries.length < 3) {
    return { ok: false, message: "Add at least 3 entries before generating insights." };
  }

  const client = createOpenAiClient();
  const prompt = `You are generating concise self-insight cards for a journaling app. Based only on the evidence provided, create up to 3 insights: one pattern, one contradiction, and one weekly_receipt. Return JSON only with an array called insights. Each insight must have: type, title, body, confidence (low|medium|high), evidence_entry_ids.

Entries:\n${JSON.stringify(entries, null, 2)}`;

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
  });

  const text = response.output_text;

  let parsed: {
    insights: Array<{
      type: "pattern" | "contradiction" | "weekly_receipt";
      title: string;
      body: string;
      confidence: "low" | "medium" | "high";
      evidence_entry_ids: string[];
    }>;
  };

  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, message: "The AI response could not be parsed." };
  }

  const insights = parsed.insights?.slice(0, 3) ?? [];

  if (insights.length === 0) {
    return { ok: false, message: "No insights were generated." };
  }

  await supabase.from("insights").delete().eq("user_id", user.id);

  const { error: insertError } = await supabase.from("insights").insert(
    insights.map((insight) => ({
      user_id: user.id,
      type: insight.type,
      title: insight.title,
      body: insight.body,
      confidence: insight.confidence,
      evidence_entry_ids: insight.evidence_entry_ids,
    })),
  );

  if (insertError) {
    return { ok: false, message: insertError.message };
  }

  revalidatePath("/insights");
  revalidatePath("/app");
  return { ok: true, message: "Insights generated." };
}
