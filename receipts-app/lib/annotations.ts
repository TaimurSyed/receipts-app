import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export type PageAnnotation = {
  id: string;
  pageType: "week" | "day";
  pageKey: string;
  body: string;
  createdAt: string;
};

export async function getAnnotations(pageType: "week" | "day", pageKey: string): Promise<PageAnnotation[]> {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("annotations")
    .select("id, page_type, page_key, body, created_at")
    .eq("user_id", user.id)
    .eq("page_type", pageType)
    .eq("page_key", pageKey)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data) return [];

  return data.map((item) => ({
    id: item.id,
    pageType: item.page_type,
    pageKey: item.page_key,
    body: item.body,
    createdAt: new Date(item.created_at).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
  }));
}
