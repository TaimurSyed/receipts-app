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
};

export async function getEntries(limit = 20): Promise<TimelineEntry[]> {
  if (!hasSupabaseEnv()) {
    return recentEntries;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return recentEntries;
  }

  const { data, error } = await supabase
    .from("entries")
    .select("id, title, content, mood_score, tags, created_at, archived")
    .eq("user_id", user.id)
    .eq("archived", false)
    .order("created_at", { ascending: false })
    .limit(limit);

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
  }));
}
