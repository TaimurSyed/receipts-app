"use server";

import { revalidatePath } from "next/cache";
import { createOpenAiClient, hasOpenAiKey } from "@/lib/ai";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

type AnnotationActionState = {
  ok: boolean;
  message: string;
};

async function generateAnnotationReply(note: string, pageType: "week" | "day") {
  if (!hasOpenAiKey()) return null;

  try {
    const client = createOpenAiClient();
    const prompt = `You are replying inside a reflective notebook app called Receipts.
The user wrote a margin note back to a ${pageType} page.
Write a short reply that feels thoughtful, calm, and emotionally intelligent.
Do not sound like customer support or a generic chatbot.
Do not overdo it. 2-4 sentences max.
Respond like the notebook is answering back.

USER NOTE:
${note}`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    return response.output_text.trim() || null;
  } catch {
    return null;
  }
}

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

  const { data: inserted, error } = await supabase
    .from("annotations")
    .insert({
      user_id: user.id,
      page_type: pageType,
      page_key: pageKey,
      body,
      author: "user",
    })
    .select("id")
    .single();

  if (error) {
    return { ok: false, message: `${error.message} Run the annotations SQL migrations if needed.` };
  }

  const aiReply = await generateAnnotationReply(body, pageType);

  if (aiReply) {
    await supabase.from("annotations").insert({
      user_id: user.id,
      page_type: pageType,
      page_key: pageKey,
      body: aiReply,
      author: "ai",
      reply_to: inserted.id,
    });
  }

  revalidatePath("/insights");
  revalidatePath(`/journal/${pageKey}`);
  return { ok: true, message: aiReply ? "Margin note saved. The notebook answered back." : "Margin note saved." };
}
