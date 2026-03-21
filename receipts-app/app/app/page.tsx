import { Dashboard } from "@/components/app/dashboard";
import { Sidebar } from "@/components/app/sidebar";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { requireUser } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/env";

export default async function AppPage() {
  const shouldRequireAuth = hasSupabaseEnv();

  if (shouldRequireAuth) {
    await requireUser();
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Receipts app</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Behavior dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          {!shouldRequireAuth ? (
            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-200">
              Mock mode until Supabase is configured
            </span>
          ) : null}
          <SignOutButton />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <Dashboard />
      </div>
    </main>
  );
}
