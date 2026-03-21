import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function getRecentAnnotationMemory(limit = 8): Promise<string[]> {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("annotations")
    .select("body, author, page_type, page_key, created_at")
    .eq("user_id", user.id)
    .eq("author", "user")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((note) => `[${note.page_type}:${note.page_key}] ${note.body}`);
}
