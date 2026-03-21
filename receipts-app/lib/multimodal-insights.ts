import { createOpenAiClient } from "@/lib/ai";
import { getImagePlaybackUrl } from "@/lib/entries";

type InsightEntry = {
  id: string;
  title: string | null;
  content: string;
  mood_score: number | null;
  tags: string[] | null;
  created_at: string;
  type?: string | null;
  image_path?: string | null;
};

type MultimodalInputPart =
  | { type: "input_text"; text: string }
  | { type: "input_image"; image_url: string };

export async function buildInsightInput(entries: InsightEntry[], prompt: string) {
  const content: MultimodalInputPart[] = [
    {
      type: "input_text",
      text: `${prompt}\n\nENTRIES:\n${JSON.stringify(
        entries.map((entry) => ({
          id: entry.id,
          title: entry.title,
          content: entry.content,
          mood_score: entry.mood_score,
          tags: entry.tags,
          created_at: entry.created_at,
          type: entry.type,
        })),
        null,
        2,
      )}`,
    },
  ];

  for (const entry of entries) {
    if (entry.type === "image" && entry.image_path) {
      const imageUrl = await getImagePlaybackUrl(entry.image_path);
      if (imageUrl) {
        content.push({
          type: "input_text",
          text: `Image note for entry ${entry.id}${entry.title ? ` (${entry.title})` : ""}. Use the image as evidence for understanding this entry.`,
        });
        content.push({
          type: "input_image",
          image_url: imageUrl,
        });
      }
    }
  }

  return [{ role: "user" as const, content }] as const;
}

export async function createMultimodalResponse(entries: InsightEntry[], prompt: string) {
  const client = createOpenAiClient();
  const input = await buildInsightInput(entries, prompt);
  return client.responses.create({
    model: "gpt-4.1-mini",
    input: input as any,
  });
}
