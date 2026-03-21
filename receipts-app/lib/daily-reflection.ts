import { getRecentAnnotationMemory } from "@/lib/annotation-memory";
import { createOpenAiClient, hasOpenAiKey } from "@/lib/ai";

type DayEntry = {
  id: string;
  title: string | null;
  content: string;
  created_at: string;
  mood_score: number | null;
  tags: string[] | null;
};

export type DailyReflection = {
  summary: string;
  trigger: string;
  nextStep: string;
};

function fallbackReflection(entries: DayEntry[]): DailyReflection {
  const lowMoodCount = entries.filter((entry) => (entry.mood_score ?? 3) <= 2).length;
  const tags = entries.flatMap((entry) => entry.tags ?? []);
  const dominantTag = tags.sort((a, b) => tags.filter((t) => t === b).length - tags.filter((t) => t === a).length)[0];

  return {
    summary:
      lowMoodCount > 0
        ? "This day seems to have carried some friction. Even without overexplaining it, your entries suggest the day kept getting pulled off course by whatever felt emotionally sharpest."
        : "This day reads more like a moving target than a clean narrative. There were signals, but not all of them pointed in the same direction.",
    trigger: dominantTag
      ? `The strongest visible thread was around ${dominantTag}. That may not be the whole story, but it looks like the thing most likely to have shaped your tone and attention.`
      : "The trigger is still a little blurry here. It may be less about one event and more about how the day gradually accumulated pressure.",
    nextStep:
      "If a day starts slipping, the move may not be to force productivity harder. It may be to name what changed, reset a little earlier, and stop letting one bad moment narrate the whole day.",
  };
}

function extractJsonObject(text: string) {
  const trimmed = text.trim();
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

export async function getDailyReflection(entries: DayEntry[]): Promise<DailyReflection> {
  if (entries.length === 0) {
    return {
      summary: "No entries were saved for this day yet.",
      trigger: "There isn't enough material here to say what shaped the day.",
      nextStep: "Try logging a little more detail on days you want to understand later.",
    };
  }

  if (!hasOpenAiKey()) {
    return fallbackReflection(entries);
  }

  try {
    const client = createOpenAiClient();
    const annotationMemory = await getRecentAnnotationMemory();
    const prompt = `You are writing a one-day reflective note for a journaling app.
Write with warmth and clarity. Do not sound clinical or preachy.
Recent user-written margin notes may reveal how the user interprets themselves. Use them as soft memory so you do not keep repeating a framing the user has pushed back on.
Return JSON only with this shape:
{
  "summary": "2-3 sentences about what seemed to happen that day",
  "trigger": "1-2 sentences about what may have shifted the day",
  "nextStep": "1-2 sentences about what may help next time"
}
Ground everything in the entries. Do not invent facts.

RECENT USER NOTES:
${annotationMemory.length > 0 ? annotationMemory.join("\n") : "(none yet)"}

ENTRIES:
${JSON.stringify(entries, null, 2)}`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const parsed = JSON.parse(extractJsonObject(response.output_text)) as DailyReflection;

    if (parsed.summary && parsed.trigger && parsed.nextStep) {
      return parsed;
    }
  } catch {
    // fall through to fallback
  }

  return fallbackReflection(entries);
}
