"use server";

import { revalidatePath } from "next/cache";
import { setTonePreference, type TonePreference } from "@/lib/profile";

export async function updateTonePreference(tone: TonePreference) {
  await setTonePreference(tone);
  revalidatePath("/insights");
  revalidatePath("/journal/[date]", "page");
  return { ok: true, message: `Tone set to ${tone}.` };
}
