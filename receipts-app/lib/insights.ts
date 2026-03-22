import { insightCards } from "@/lib/mock-data";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export type InsightRecord = {
  id: string;
  type: string;
  title: string;
  body: string;
  confidence: string;
  evidence: string[];
  createdAt?: string;
  scope?: "week" | "month";
  periodStart?: string | null;
};

export type EvidenceSnippet = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  dateKey: string;
  archived?: boolean;
  type?: string;
  searchSeed?: string;
  audioPath?: string | null;
  imagePath?: string | null;
  audioUrl?: string | null;
  imageUrl?: string | null;
};

async function getSignedMediaUrls(supabase: Awaited<ReturnType<typeof createClient>>, audioPath?: string | null, imagePath?: string | null) {
  let audioUrl: string | null = null;
  let imageUrl: string | null = null;

  if (audioPath) {
    const { data } = await supabase.storage.from("voice-memos").createSignedUrl(audioPath, 60 * 10);
    audioUrl = data?.signedUrl ?? null;
  }

  if (imagePath) {
    const { data } = await supabase.storage.from("image-notes").createSignedUrl(imagePath, 60 * 10);
    imageUrl = data?.signedUrl ?? null;
  }

  return { audioUrl, imageUrl };
}

export async function getInsights(): Promise<InsightRecord[]> {
  if (!hasSupabaseEnv()) {
    return insightCards.map((card) => ({
      id: card.id,
      type: card.type,
      title: card.title,
      body: card.body,
      confidence: card.confidence,
      evidence: card.evidence,
    }));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  let { data, error } = await supabase
    .from("insights")
    .select("id, type, title, body, confidence, evidence_entry_ids, created_at, scope, period_start, week_start")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(24);

  if (error) {
    const fallback = await supabase
      .from("insights")
      .select("id, type, title, body, confidence, evidence_entry_ids, created_at, week_start")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(24);
    data = fallback.data as any;
    error = fallback.error;
  }

  if (error || !data) {
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    type: item.type,
    title: item.title,
    body: item.body,
    confidence: item.confidence,
    evidence: Array.isArray(item.evidence_entry_ids)
      ? item.evidence_entry_ids.filter((entryId): entryId is string => typeof entryId === "string")
      : [],
    createdAt: item.created_at,
    scope: item.scope === "month" ? "month" : "week",
    periodStart: item.period_start ?? item.week_start ?? null,
  }));
}

export async function getEvidenceSnippets(entryIds: string[]): Promise<Record<string, EvidenceSnippet>> {
  if (!hasSupabaseEnv() || entryIds.length === 0) {
    return {};
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entries")
    .select("id, title, content, created_at, archived, type, tags, audio_path, image_path")
    .in("id", entryIds);

  if (error || !data) {
    return {};
  }

  const entriesWithUrls = await Promise.all(
    data.map(async (entry) => {
      const tags = Array.isArray(entry.tags) ? entry.tags.filter((tag): tag is string => typeof tag === "string") : [];
      const searchSeed = tags[0] || entry.title || entry.content.slice(0, 32);
      const { audioUrl, imageUrl } = await getSignedMediaUrls(supabase, entry.audio_path, entry.image_path);

      return [
        entry.id,
        {
          id: entry.id,
          title: entry.title || "Untitled entry",
          content: entry.archived ? "This note is archived and hidden from the active notebook." : entry.content,
          createdAt: new Date(entry.created_at).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }),
          dateKey: new Date(entry.created_at).toISOString().slice(0, 10),
          archived: entry.archived ?? false,
          type: entry.type ?? "text",
          searchSeed,
          audioPath: entry.audio_path ?? null,
          imagePath: entry.image_path ?? null,
          audioUrl,
          imageUrl,
        },
      ] as const;
    }),
  );

  return Object.fromEntries(entriesWithUrls);
}
