import { recentEntries } from "@/lib/mock-data";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export type TimelineEntry = {
  id: string;
  title: string;
  content: string;
  mood: number;
  tags: string[];
  time: string;
  usedInInsight: boolean;
  archived?: boolean;
  dateKey?: string;
  type?: string;
  audioPath?: string | null;
  imagePath?: string | null;
};

function getDateRangeStart(range: string) {
  const now = new Date();

  if (range === "7d") {
    const start = new Date(now);
    start.setDate(now.getDate() - 7);
    return start;
  }

  if (range === "30d") {
    const start = new Date(now);
    start.setDate(now.getDate() - 30);
    return start;
  }

  if (range === "month") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return null;
}

function matchesMoodFilter(score: number, moodFilter: string) {
  if (moodFilter === "low") return score <= 2;
  if (moodFilter === "neutral") return score === 3;
  if (moodFilter === "good") return score >= 4;
  return true;
}

export async function getEntries(
  limit = 20,
  filters?: { query?: string; type?: string; mood?: string; range?: string },
): Promise<TimelineEntry[]> {
  const queryText = filters?.query?.trim().toLowerCase() ?? "";
  const typeFilter = filters?.type?.trim().toLowerCase() ?? "all";
  const moodFilter = filters?.mood?.trim().toLowerCase() ?? "all";
  const rangeFilter = filters?.range?.trim().toLowerCase() ?? "all";
  const rangeStart = getDateRangeStart(rangeFilter);

  if (!hasSupabaseEnv()) {
    return recentEntries.filter((entry) => {
      const entryType = "text";
      const matchesType = typeFilter === "all" || entryType === typeFilter;
      const haystack = [entry.title, entry.content, ...(entry.tags ?? [])].join(" ").toLowerCase();
      const matchesQuery = !queryText || haystack.includes(queryText);
      const matchesMood = matchesMoodFilter(entry.mood ?? 3, moodFilter);
      return matchesType && matchesQuery && matchesMood;
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return recentEntries;
  }

  let dbQuery = supabase
    .from("entries")
    .select("id, title, content, mood_score, tags, created_at, archived, type, audio_path, image_path")
    .eq("user_id", user.id)
    .eq("archived", false)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (typeFilter !== "all") {
    dbQuery = dbQuery.eq("type", typeFilter);
  }

  if (moodFilter === "low") {
    dbQuery = dbQuery.lte("mood_score", 2);
  } else if (moodFilter === "neutral") {
    dbQuery = dbQuery.eq("mood_score", 3);
  } else if (moodFilter === "good") {
    dbQuery = dbQuery.gte("mood_score", 4);
  }

  if (rangeStart) {
    dbQuery = dbQuery.gte("created_at", rangeStart.toISOString());
  }

  if (queryText) {
    const escaped = queryText.replace(/[,%]/g, " ").trim();
    if (escaped) {
      dbQuery = dbQuery.or(`title.ilike.%${escaped}%,content.ilike.%${escaped}%,tags.cs.{${escaped}}`);
    }
  }

  const { data, error } = await dbQuery;

  if (error || !data) {
    return recentEntries;
  }

  return data.map((entry) => ({
    id: entry.id,
    title: entry.title || "Untitled entry",
    content: entry.content,
    mood: entry.mood_score ?? 3,
    tags: Array.isArray(entry.tags) ? entry.tags.filter((tag): tag is string => typeof tag === "string") : [],
    time: new Date(entry.created_at).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
    usedInInsight: false,
    archived: entry.archived ?? false,
    dateKey: new Date(entry.created_at).toISOString().slice(0, 10),
    type: entry.type,
    audioPath: entry.audio_path ?? null,
    imagePath: entry.image_path ?? null,
  }));
}

export async function getVoicePlaybackUrl(audioPath?: string | null) {
  if (!audioPath || !hasSupabaseEnv()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.storage.from("voice-memos").createSignedUrl(audioPath, 60 * 10);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

export async function getImagePlaybackUrl(imagePath?: string | null) {
  if (!imagePath || !hasSupabaseEnv()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.storage.from("image-notes").createSignedUrl(imagePath, 60 * 10);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}
