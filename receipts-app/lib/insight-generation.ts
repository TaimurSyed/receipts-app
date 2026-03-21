import { revalidatePath } from "next/cache";
import { hasOpenAiKey } from "@/lib/ai";
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
  return { start: start.toISOString(), end: end.toISOString(), periodStart: week };
}

function getMonthBounds(month?: string) {
  if (!month) return null;
  const start = new Date(`${month}-01T00:00:00.000Z`);
  if (Number.isNaN(start.getTime())) return null;
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1);
  end.setUTCDate(0);
  end.setUTCHours(23, 59, 59, 999);
  return { start: start.toISOString(), end: end.toISOString(), periodStart: `${month}-01` };
}

export function getWeekKeyForDate(dateInput?: string) {
  const base = dateInput ? new Date(`${dateInput}T12:00:00`) : new Date();
  const copy = new Date(base);
  const day = copy.getDay();
  const diff = (day + 6) % 7;
  copy.setDate(copy.getDate() - diff);
  copy.setHours(0, 0, 0, 0);
  return copy.toISOString().slice(0, 10);
}

async function generateInsightsForPeriod({
  scope,
  key,
}: {
  scope: "week" | "month";
  key?: string;
}) {
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
    .limit(scope === "month" ? 40 : 16);

  const bounds = scope === "month" ? getMonthBounds(key) : getWeekBounds(key);
  if (bounds) query = query.gte("created_at", bounds.start).lte("created_at", bounds.end);

  const { data: entries, error: entryError } = await query;
  if (entryError || !entries || entries.length < 3) {
    return {
      ok: false,
      message:
        scope === "month"
          ? key
            ? "Add at least 3 entries in this month before generating."
            : "Add at least 3 entries before generating month insights."
          : key
            ? "Add at least 3 entries in this week before generating."
            : "Add at least 3 entries before generating insights.",
    };
  }

  const [tone, annotationMemory] = await Promise.all([getTonePreference(), getRecentAnnotationMemory()]);
  const toneInstruction = {
    gentle: "Write with softness, patience, and emotional generosity.",
    direct: "Write with clarity, honesty, and calm precision.",
    brutal: "Write with sharper honesty, but never be mean or cruel.",
  }[tone];

  const periodLabel = scope === "month" ? "monthly" : "weekly";
  const periodPhrase = scope === "month" ? "this month" : "this week";
  const scopeStyle =
    scope === "month"
      ? `MONTH-SPECIFIC STYLE:
- Sound broader, steadier, and slightly more distilled than the weekly view.
- Notice recurring loops, repeated moods, and the emotional weather across multiple days.
- The primary note should feel like a chapter summary, not a diary entry from one afternoon.
- Prefer cumulative observations over sharp one-off moments unless one moment clearly defines the month.
- Avoid simply scaling up a weekly insight. The month note should feel earned by repetition.`
      : `WEEK-SPECIFIC STYLE:
- Sound close to the ground and recent.
- Let the writing feel sharper, more immediate, and a little more exposed.
- Small details from a single day can matter if they reveal the tone of the week.
- The primary note should read like a page written while the week still has heat in it.`;

  const prompt = `You write private-feeling ${periodLabel} notes for a product called Receipts.
${toneInstruction}
The result should feel memorable, diary-like, and emotionally intelligent without becoming corny.
It should sound like a close observer who paid attention over ${periodPhrase}.

STYLE RULES:
- Write with warmth, specificity, and a little bite.
- Do not sound clinical, corporate, or like a motivational coach.
- Make the user feel seen.
- Use vivid phrasing when the evidence supports it.
- The writing can be reflective, but it must stay grounded in evidence.
- If evidence is weak, say less and lower confidence.
- Avoid generic therapy language, fake profundity, or tidy life lessons.
- Vary sentence rhythm and structure so the writing does not sound templated.
- Image notes may contain visual evidence; use them if they matter.
- Voice memos are already transcribed into text; treat that transcript as real evidence.
- Not every piece of evidence deserves to surface. Be selective.

${scopeStyle}

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
- ${scope === "month" ? "WEEKLY_RECEIPT should behave like a monthly chapter note: broader, more cumulative, still intimate." : "WEEKLY_RECEIPT: write like a short weekly letter, not a summary bullet."}
- Use at most 3 insights total.
- Skip any type that is not well-supported.
- Never invent evidence.
- Prefer fewer, stronger insights over many weak ones.
- If voice or image evidence does not sharpen the interpretation, ignore it.
- Titles should feel human and memorable, not like report headings.

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

  let deleteQuery = supabase.from("insights").delete().eq("user_id", user.id).eq("scope", scope);
  if (bounds?.periodStart) deleteQuery = deleteQuery.eq("period_start", bounds.periodStart);
  await deleteQuery;

  const { error: insertError } = await supabase.from("insights").insert(
    insights.map((insight: any) => ({
      user_id: user.id,
      type: insight.type,
      title: insight.title,
      body: insight.body,
      confidence: insight.confidence,
      evidence_entry_ids: insight.evidence_entry_ids,
      scope,
      period_start: bounds?.periodStart ?? null,
      week_start: scope === "week" ? bounds?.periodStart ?? null : null,
    })),
  );

  if (insertError) return { ok: false, message: insertError.message };

  revalidatePath("/insights");
  revalidatePath("/app");
  return {
    ok: true,
    message: `Generated ${insights.length} insights${bounds?.periodStart ? ` for this ${scope}` : ""}.`,
  };
}

export async function generateInsightsForWeek(week?: string) {
  return generateInsightsForPeriod({ scope: "week", key: week });
}

export async function generateInsightsForMonth(month?: string) {
  return generateInsightsForPeriod({ scope: "month", key: month });
}

export async function refreshWeeklyInsightsForEntryDate(entryDate?: string) {
  const week = getWeekKeyForDate(entryDate);
  try {
    return await generateInsightsForWeek(week);
  } catch {
    // Entry saving should not fail just because the weekly refresh did.
    return { ok: false, message: "Weekly insights could not refresh automatically." };
  }
}
