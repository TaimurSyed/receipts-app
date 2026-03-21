"use server";

import { revalidatePath } from "next/cache";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

type AnnotationActionState = {
  ok: boolean;
  message: string;
};

export async function createAnnotation(
  _previousState: AnnotationActionState,
  formData: FormData,
): Promise<AnnotationActionState> {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const pageType = String(formData.get("pageType") || "") as "week" | "day";
  const pageKey = String(formData.get("pageKey") || "").trim();
  const body = String(formData.get("body") || "").trim();

  if (!pageType || !pageKey || !body) {
    return { ok: false, message: "Write something before saving your note." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "Sign in first." };
  }

  const { error } = await supabase.from("annotations").insert({
    user_id: user.id,
    page_type: pageType,
    page_key: pageKey,
    body,
  });

  if (error) {
    return { ok: false, message: `${error.message} Run the annotations SQL migration if needed.` };
  }

  revalidatePath("/insights");
  revalidatePath(`/journal/${pageKey}`);
  return { ok: true, message: "Margin note saved." };
}
