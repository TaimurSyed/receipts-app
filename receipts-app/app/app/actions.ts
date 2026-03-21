"use server";

import { revalidatePath } from "next/cache";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

type EntryActionState = {
  ok: boolean;
  message: string;
};

export async function createEntry(
  _previousState: EntryActionState,
  formData: FormData,
): Promise<EntryActionState> {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Add Supabase env vars to enable saving." };
  }

  const content = String(formData.get("content") || "").trim();
  const mood = Number(formData.get("mood") || 3);
  const tags = String(formData.get("tags") || "")
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  if (!content) {
    return { ok: false, message: "Entry content is required." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "Sign in first to save entries." };
  }

  const { error } = await supabase.from("entries").insert({
    user_id: user.id,
    type: "text",
    title: content.slice(0, 60),
    content,
    mood_score: mood,
    tags,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/app");
  return { ok: true, message: "Entry saved." };
}
