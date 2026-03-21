"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/env";

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setMessage("");

    try {
      if (!hasSupabaseEnv()) {
        setMessage("Add Supabase env vars first. The auth UI is ready, but it needs your project keys.");
        return;
      }

      const email = String(formData.get("email") || "").trim();
      const password = String(formData.get("password") || "").trim();
      const supabase = createClient();

      if (mode === "sign-up") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
          setMessage(error.message);
          return;
        }

        setMessage("Account created. Check your email if confirmation is enabled.");
        router.refresh();
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
        return;
      }

      router.push("/app");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-panel">
      <p className="text-xs uppercase tracking-[0.24em] text-amber-300">
        {mode === "sign-in" ? "Welcome back" : "Create account"}
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
        {mode === "sign-in" ? "Sign in to Receipts" : "Start leaving a trail"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-zinc-400">
        {mode === "sign-in"
          ? "Pick up where your last patterns left off."
          : "Create an account to save entries, build a timeline, and generate real receipts."}
      </p>

      <form action={handleSubmit} className="mt-8 space-y-4">
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
        />
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-amber-300 px-5 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Working..." : mode === "sign-in" ? "Sign in" : "Create account"}
        </button>
      </form>

      {message ? <p className="mt-4 text-sm text-zinc-300">{message}</p> : null}

      <p className="mt-6 text-sm text-zinc-500">
        {mode === "sign-in" ? "Need an account?" : "Already have an account?"}{" "}
        <Link
          href={mode === "sign-in" ? "/sign-up" : "/sign-in"}
          className="text-zinc-200 underline underline-offset-4"
        >
          {mode === "sign-in" ? "Create one" : "Sign in"}
        </Link>
      </p>
    </div>
  );
}
