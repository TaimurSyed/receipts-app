"use server";

import { revalidatePath } from "next/cache";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

type EntryActionState = {
  ok: boolean;
  message: string;
};

function buildCreatedAtForDate(dateString: string) {
  const today = new Date();
  const hours = today.getHours().toString().padStart(2, "0");
  const minutes = today.getMinutes().toString().padStart(2, "0");
  const seconds = today.getSeconds().toString().padStart(2, "0");
  return `${dateString}T${hours}:${minutes}:${seconds}`;
}

export async function createEntry(
  _previousState: EntryActionState,
  formData: FormData,
): Promise<EntryActionState> {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Add Supabase env vars to enable saving." };
  }

  const content = String(formData.get("content") || "").trim();
  const mood = Number(formData.get("mood") || 3);
  const entryDate = String(formData.get("entryDate") || "").trim();
  const contextLabel = String(formData.get("contextLabel") || "entry").trim();
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

  const payload: {
    user_id: string;
    type: string;
    title: string;
    content: string;
    mood_score: number;
    tags: string[];
    created_at?: string;
  } = {
    user_id: user.id,
    type: "text",
    title: content.slice(0, 60),
    content,
    mood_score: mood,
    tags,
  };

  if (entryDate) {
    payload.created_at = buildCreatedAtForDate(entryDate);
  }

  const { error } = await supabase.from("entries").insert(payload);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/app");
  if (entryDate) {
    revalidatePath(`/journal/${entryDate}`);
  }
  return { ok: true, message: `${contextLabel} saved.` };
}
