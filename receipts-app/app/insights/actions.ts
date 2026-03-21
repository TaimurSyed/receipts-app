"use server";

import { revalidatePath } from "next/cache";
import { hasOpenAiKey, createOpenAiClient } from "@/lib/ai";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/env";

function extractJsonObject(text: string) {
  const trimmed = text.trim();

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (codeBlockMatch?.[1]) {
    return codeBlockMatch[1].trim();
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

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
    .limit(16);

  if (entryError || !entries || entries.length < 3) {
    return { ok: false, message: "Add at least 3 entries before generating insights." };
  }

  const client = createOpenAiClient();
  const prompt = `You are the insight engine for a product called Receipts.
Your job is to generate sharp, evidence-based observations from a user's own notes.

STYLE RULES:
- Sound perceptive, specific, and slightly forensic.
- Do NOT sound like a therapist, life coach, or generic productivity blog.
- Do NOT repeat the user's words unless needed for evidence.
- Prefer concrete behavioral interpretation over vague emotional summaries.
- If the evidence is weak, lower confidence instead of overclaiming.
- Every insight must point to actual entries that support it.

OUTPUT RULES:
Return valid JSON only with this exact shape:
{
  "insights": [
    {
      "type": "pattern | contradiction | weekly_receipt",
      "title": "short sharp title",
      "body": "2-4 sentences. Explain the pattern in a way that feels specific and useful.",
      "confidence": "low | medium | high",
      "evidence_entry_ids": ["entry-id-1", "entry-id-2"]
    }
  ]
}

QUALITY BAR:
- A PATTERN should describe a repeated link between trigger and behavior.
- A CONTRADICTION should highlight mismatch between what the user says and what their behavior suggests.
- A WEEKLY_RECEIPT should summarize the strongest loop or pattern shaping the recent period.
- Avoid generic lines like "stress affects productivity" unless the evidence is unusually strong and phrased specifically.
- Use at most 3 insights total.
- If a requested type is not supported by evidence, skip it.

USER ENTRIES:
${JSON.stringify(entries, null, 2)}`;

  let text = "";

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    text = response.output_text;
  } catch (error) {
    const message = error instanceof Error ? error.message : "OpenAI request failed.";
    return { ok: false, message };
  }

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
    parsed = JSON.parse(extractJsonObject(text));
  } catch {
    return {
      ok: false,
      message: `The AI response could not be parsed. Raw response: ${text.slice(0, 220) || "(empty)"}`,
    };
  }

  const insights = (parsed.insights ?? [])
    .filter((insight) => insight.title && insight.body && insight.type && insight.confidence)
    .slice(0, 3);

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
  return { ok: true, message: `Generated ${insights.length} insights.` };
}
