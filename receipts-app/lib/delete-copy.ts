function extractWords(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 4);
}

const keywordMap: Array<{ words: string[]; phrase: string }> = [
  { words: ["anxious", "anxiety", "spiral", "panic", "overthinking"], phrase: "this anxious loop" },
  { words: ["tired", "exhausted", "drained", "sleep", "burnout"], phrase: "this tired little spiral" },
  { words: ["sad", "grief", "heartbreak", "miss", "lonely"], phrase: "this heavy ache" },
  { words: ["angry", "frustrated", "resent", "rage", "annoyed"], phrase: "this sharp edge" },
  { words: ["gym", "workout", "run", "training"], phrase: "this stubborn push" },
  { words: ["work", "job", "meeting", "deadline"], phrase: "this work knot" },
  { words: ["love", "relationship", "text", "call"], phrase: "this heart-tug" },
  { words: ["home", "family", "mom", "dad"], phrase: "this family weight" },
];

export function getDeleteDialogTitle({
  title,
  content,
  type,
  mood,
}: {
  title?: string | null;
  content?: string | null;
  type?: string | null;
  mood?: number | null;
}) {
  const combined = `${title ?? ""} ${content ?? ""}`.trim();
  const words = extractWords(combined);

  for (const entry of keywordMap) {
    if (entry.words.some((word) => words.includes(word))) {
      return `Burn ${entry.phrase}?`;
    }
  }

  if (type === "voice") {
    if ((mood ?? 3) <= 2) return "Burn this heavy voice memo?";
    if ((mood ?? 3) >= 4) return "Burn this bright little voice memo?";
    return "Burn this voice memo?";
  }

  if (type === "image") {
    if ((mood ?? 3) <= 2) return "Burn this heavy captured moment?";
    return "Burn this captured moment?";
  }

  if (title && title.trim().length > 0) {
    const cleaned = title.trim().replace(/[?.!]+$/g, "");
    if (cleaned.length <= 36) {
      return `Burn “${cleaned}”?`;
    }
  }

  if ((mood ?? 3) <= 2) return "Burn this lingering heaviness?";
  if ((mood ?? 3) >= 4) return "Burn this bright little page?";
  return "Burn this page?";
}
