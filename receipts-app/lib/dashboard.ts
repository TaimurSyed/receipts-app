import { getEntries } from "@/lib/entries";
import { getInsights } from "@/lib/insights";

export async function getDashboardData() {
  const [entries, insights] = await Promise.all([getEntries(), getInsights()]);

  const topTags = new Map<string, number>();
  for (const entry of entries) {
    for (const tag of entry.tags) {
      topTags.set(tag, (topTags.get(tag) ?? 0) + 1);
    }
  }

  const dominantTheme = [...topTags.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Still emerging";

  return {
    entries,
    insights,
    dominantTheme,
  };
}
