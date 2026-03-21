"use server";

import { revalidatePath } from "next/cache";
import { createOpenAiClient, hasOpenAiKey } from "@/lib/ai";
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

async function getSignedInUser() {
  if (!hasSupabaseEnv()) {
    return { ok: false as const, message: "Add Supabase env vars to enable saving." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, message: "Sign in first to save entries." };
  }

  return { ok: true as const, supabase, user };
}

export async function createEntry(
  _previousState: EntryActionState,
  formData: FormData,
): Promise<EntryActionState> {
  const auth = await getSignedInUser();
  if (!auth.ok) return auth;

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

  const payload: {
    user_id: string;
    type: string;
    title: string;
    content: string;
    mood_score: number;
    tags: string[];
    created_at?: string;
  } = {
    user_id: auth.user.id,
    type: "text",
    title: content.slice(0, 60),
    content,
    mood_score: mood,
    tags,
  };

  if (entryDate) {
    payload.created_at = buildCreatedAtForDate(entryDate);
  }

  const { error } = await auth.supabase.from("entries").insert(payload);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/app");
  if (entryDate) revalidatePath(`/journal/${entryDate}`);
  return { ok: true, message: `${contextLabel} saved.` };
}

export async function createVoiceEntry(
  _previousState: EntryActionState,
  formData: FormData,
): Promise<EntryActionState> {
  const auth = await getSignedInUser();
  if (!auth.ok) return auth;

  if (!hasOpenAiKey()) {
    return { ok: false, message: "Add OPENAI_API_KEY to enable voice transcription." };
  }

  const file = formData.get("audio") as File | null;
  const mood = Number(formData.get("mood") || 3);
  const tags = String(formData.get("tags") || "")
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  if (!file || file.size === 0) {
    return { ok: false, message: "Attach an audio file first." };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = `${auth.user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;

  const { error: uploadError } = await auth.supabase.storage
    .from("voice-memos")
    .upload(safeName, bytes, { contentType: file.type || "audio/webm", upsert: false });

  if (uploadError) {
    return { ok: false, message: `${uploadError.message} Run the voice storage SQL setup if needed.` };
  }

  const client = createOpenAiClient();
  let transcriptText = "";

  try {
    const transcription = await client.audio.transcriptions.create({
      file: new File([bytes], file.name, { type: file.type || "audio/webm" }),
      model: "gpt-4o-mini-transcribe",
    });
    transcriptText = transcription.text?.trim() || "";
  } catch (error) {
    const message = error instanceof Error ? error.message : "Transcription failed.";
    return { ok: false, message };
  }

  if (!transcriptText) {
    return { ok: false, message: "The voice memo was uploaded, but no transcript came back." };
  }

  const { error: entryError } = await auth.supabase.from("entries").insert({
    user_id: auth.user.id,
    type: "voice",
    title: `Voice memo · ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
    content: transcriptText,
    transcript: transcriptText,
    mood_score: mood,
    tags,
    source: "voice",
    audio_path: safeName,
  });

  if (entryError) {
    return { ok: false, message: `${entryError.message} Run the voice playback SQL migration if needed.` };
  }

  revalidatePath("/app");
  return { ok: true, message: "Voice memo transcribed and saved." };
}

export async function createImageEntry(
  _previousState: EntryActionState,
  formData: FormData,
): Promise<EntryActionState> {
  const auth = await getSignedInUser();
  if (!auth.ok) return auth;

  const file = formData.get("image") as File | null;
  const content = String(formData.get("content") || "").trim();
  const mood = Number(formData.get("mood") || 3);
  const tags = String(formData.get("tags") || "")
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  if (!file || file.size === 0) {
    return { ok: false, message: "Attach an image first." };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = `${auth.user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;

  const { error: uploadError } = await auth.supabase.storage
    .from("image-notes")
    .upload(safeName, bytes, { contentType: file.type || "image/jpeg", upsert: false });

  if (uploadError) {
    return { ok: false, message: `${uploadError.message} Run the image storage SQL setup if needed.` };
  }

  const { error: entryError } = await auth.supabase.from("entries").insert({
    user_id: auth.user.id,
    type: "image",
    title: `Picture note · ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
    content: content || "Picture note",
    mood_score: mood,
    tags,
    source: "image",
    image_path: safeName,
  });

  if (entryError) {
    return { ok: false, message: `${entryError.message} Run the image path SQL migration if needed.` };
  }

  revalidatePath("/app");
  return { ok: true, message: "Picture note saved." };
}
