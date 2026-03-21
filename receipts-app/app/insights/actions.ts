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
  const prompt = `You write private-feeling weekly notes for a product called Receipts.
The result should feel memorable, diary-like, and emotionally intelligent without becoming corny.
It should sound like a close observer who paid attention all week.

STYLE RULES:
- Write with warmth, specificity, and a little bite.
- Do not sound clinical, corporate, or like a motivational coach.
- Make the user feel seen.
- Use vivid phrasing when the evidence supports it.
- Avoid generic lines like "stress impacted your productivity" unless you make them concrete.
- The writing can be reflective, but it must stay grounded in evidence.
- If evidence is weak, say less and lower confidence.

OUTPUT RULES:
Return valid JSON only with this exact shape:
{
  "insights": [
    {
      "type": "pattern | contradiction | weekly_receipt",
      "title": "memorable but concise",
      "body": "2-4 sentences, written more like a private note than a dashboard bullet",
      "confidence": "low | medium | high",
      "evidence_entry_ids": ["entry-id-1", "entry-id-2"]
    }
  ]
}

QUALITY BAR:
- PATTERN: show a repeated trigger → behavior loop.
- CONTRADICTION: show where the user's self-story and actual behavior diverged.
- WEEKLY_RECEIPT: write like a short weekly letter, not a summary bullet.
- Use at most 3 insights total.
- Skip any type that is not well-supported.
- Never invent evidence.
- Prefer fewer, stronger insights over many weak ones.

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
