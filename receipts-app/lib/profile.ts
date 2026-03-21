import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export type TonePreference = "gentle" | "direct" | "brutal";

export async function getTonePreference(): Promise<TonePreference> {
  if (!hasSupabaseEnv()) {
    return "direct";
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return "direct";
  }

  const { data } = await supabase.from("profiles").select("tone_preference").eq("id", user.id).maybeSingle();
  const tone = data?.tone_preference;
  return tone === "gentle" || tone === "brutal" || tone === "direct" ? tone : "direct";
}

export async function setTonePreference(tone: TonePreference) {
  if (!hasSupabaseEnv()) {
    return;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  await supabase.from("profiles").upsert({ id: user.id, tone_preference: tone }, { onConflict: "id" });
}
