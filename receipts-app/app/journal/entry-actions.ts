"use server";

import { revalidatePath } from "next/cache";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

async function ensureUser() {
  if (!hasSupabaseEnv()) return { ok: false as const, message: "Supabase is not configured." };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, message: "Sign in first." };
  return { ok: true as const, supabase, user };
}

export async function archiveEntry(entryId: string, date: string) {
  const auth = await ensureUser();
  if (!auth.ok) return auth;

  const { error } = await auth.supabase
    .from("entries")
    .update({ archived: true })
    .eq("id", entryId)
    .eq("user_id", auth.user.id);

  if (error) return { ok: false as const, message: `${error.message} Run the entry archive SQL migration if needed.` };

  revalidatePath(`/journal/${date}`);
  revalidatePath(`/journal/month/${date.slice(0, 7)}`);
  revalidatePath("/journal/archive");
  revalidatePath("/app");
  revalidatePath("/insights");
  return { ok: true as const, message: "Entry archived." };
}

export async function restoreEntry(entryId: string, date: string) {
  const auth = await ensureUser();
  if (!auth.ok) return auth;

  const { error } = await auth.supabase
    .from("entries")
    .update({ archived: false })
    .eq("id", entryId)
    .eq("user_id", auth.user.id);

  if (error) return { ok: false as const, message: error.message };

  revalidatePath(`/journal/${date}`);
  revalidatePath(`/journal/month/${date.slice(0, 7)}`);
  revalidatePath("/journal/archive");
  revalidatePath("/app");
  revalidatePath("/insights");
  return { ok: true as const, message: "Entry restored." };
}

export async function deleteEntry(entryId: string, date: string) {
  const auth = await ensureUser();
  if (!auth.ok) return auth;

  const { error } = await auth.supabase
    .from("entries")
    .delete()
    .eq("id", entryId)
    .eq("user_id", auth.user.id);

  if (error) return { ok: false as const, message: error.message };

  revalidatePath(`/journal/${date}`);
  revalidatePath(`/journal/month/${date.slice(0, 7)}`);
  revalidatePath(`/journal/archive`);
  revalidatePath("/app");
  revalidatePath("/insights");
  return { ok: true as const, message: "Entry deleted." };
}

export async function deleteAnnotation(annotationId: string, pageType: "week" | "day", pageKey: string) {
  const auth = await ensureUser();
  if (!auth.ok) return auth;

  const { error } = await auth.supabase
    .from("annotations")
    .delete()
    .eq("id", annotationId)
    .eq("user_id", auth.user.id);

  if (error) return { ok: false as const, message: error.message };

  if (pageType === "day") {
    revalidatePath(`/journal/${pageKey}`);
  } else {
    revalidatePath(`/insights?week=${pageKey}`);
    revalidatePath("/insights");
  }

  return { ok: true as const, message: "Margin note deleted." };
}
