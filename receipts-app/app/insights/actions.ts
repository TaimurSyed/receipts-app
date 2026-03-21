"use server";

import { revalidatePath } from "next/cache";
import { hasOpenAiKey } from "@/lib/ai";
import { hasSupabaseEnv } from "@/lib/env";
import { getRecentAnnotationMemory } from "@/lib/annotation-memory";
import { createMultimodalResponse } from "@/lib/multimodal-insights";
import { getTonePreference } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";

function extractJsonObject(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) return trimmed;
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (codeBlockMatch?.[1]) return codeBlockMatch[1].trim();
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) return trimmed.slice(firstBrace, lastBrace + 1);
  return trimmed;
}

function getWeekBounds(week?: string) {
  if (!week) return null;
  const start = new Date(`${week}T00:00:00.000Z`);
  if (Number.isNaN(start.getTime())) return null;
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  end.setUTCHours(23, 59, 59, 999);
  return { start: start.toISOString(), end: end.toISOString() };
}

export async function generateInsights(week?: string) {
  if (!hasSupabaseEnv()) return { ok: false, message: "Supabase is not configured." };
  if (!hasOpenAiKey()) return { ok: false, message: "Add OPENAI_API_KEY to enable real insight generation." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Sign in first." };

  let query = supabase
    .from("entries")
    .select("id, title, content, mood_score, tags, created_at, type, image_path")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(16);

  const bounds = getWeekBounds(week);
  if (bounds) query = query.gte("created_at", bounds.start).lte("created_at", bounds.end);

  const { data: entries, error: entryError } = await query;
  if (entryError || !entries || entries.length < 3) {
    return { ok: false, message: week ? "Add at least 3 entries in this week before generating." : "Add at least 3 entries before generating insights." };
  }

  const [tone, annotationMemory] = await Promise.all([getTonePreference(), getRecentAnnotationMemory()]);
  const toneInstruction = {
    gentle: "Write with softness, patience, and emotional generosity.",
    direct: "Write with clarity, honesty, and calm precision.",
    brutal: "Write with sharper honesty, but never be mean or cruel.",
  }[tone];

  const prompt = `You write private-feeling weekly notes for a product called Receipts.
${toneInstruction}
The result should feel memorable, diary-like, and emotionally intelligent without becoming corny.
It should sound like a close observer who paid attention all week.

STYLE RULES:
- Write with warmth, specificity, and a little bite.
- Do not sound clinical, corporate, or like a motivational coach.
- Make the user feel seen.
- Use vivid phrasing when the evidence supports it.
- The writing can be reflective, but it must stay grounded in evidence.
- If evidence is weak, say less and lower confidence.
- Image notes may contain visual evidence; use them if they matter.
- Voice memos are already transcribed into text; treat that transcript as real evidence.

LEARNING RULES:
- The user has sometimes written back to correct or refine the notebook.
- Use those notes as soft memory about how the user interprets their own life.
- Do not treat user notes as guaranteed truth, but do avoid repeating interpretations the user has clearly pushed back on.
- If the user's notes suggest a better framing, lean toward it.

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

RECENT USER NOTES:
${annotationMemory.length > 0 ? annotationMemory.join("\n") : "(none yet)"}`;

  let text = "";
  try {
    const response = await createMultimodalResponse(entries, prompt);
    text = response.output_text;
  } catch (error) {
    const message = error instanceof Error ? error.message : "OpenAI request failed.";
    return { ok: false, message };
  }

  let parsed;
  try {
    parsed = JSON.parse(extractJsonObject(text));
  } catch {
    return { ok: false, message: `The AI response could not be parsed. Raw response: ${text.slice(0, 220) || "(empty)"}` };
  }

  const insights = (parsed.insights ?? []).filter((insight: any) => insight.title && insight.body && insight.type && insight.confidence).slice(0, 3);
  if (insights.length === 0) return { ok: false, message: "No insights were generated." };

  let deleteQuery = supabase.from("insights").delete().eq("user_id", user.id);
  if (week) deleteQuery = deleteQuery.eq("week_start", week);
  await deleteQuery;

  const { error: insertError } = await supabase.from("insights").insert(
    insights.map((insight: any) => ({
      user_id: user.id,
      type: insight.type,
      title: insight.title,
      body: insight.body,
      confidence: insight.confidence,
      evidence_entry_ids: insight.evidence_entry_ids,
      week_start: week ?? null,
    })),
  );

  if (insertError) return { ok: false, message: insertError.message };

  revalidatePath("/insights");
  revalidatePath("/app");
  return { ok: true, message: `Generated ${insights.length} insights${week ? " for this week" : ""}.` };
}
