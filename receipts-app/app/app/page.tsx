import { AppShell } from "@/components/app/app-shell";
import { Dashboard } from "@/components/app/dashboard";
import { requireUser } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/env";

export default async function AppPage() {
  if (hasSupabaseEnv()) {
    await requireUser();
  }

  return (
    <AppShell
      title="Home"
      subtitle="A quieter front page for the notebook: capture quickly, skim the fresh stream, and open the current chapter when you want the wider read."
    >
      <Dashboard />
    </AppShell>
  );
}