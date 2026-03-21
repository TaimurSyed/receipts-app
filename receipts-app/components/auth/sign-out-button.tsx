"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/env";

export function SignOutButton() {
  const router = useRouter();
  const enabled = hasSupabaseEnv();

  async function handleSignOut() {
    if (!enabled) {
      return;
    }

    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={!enabled}
      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Sign out
    </button>
  );
}
