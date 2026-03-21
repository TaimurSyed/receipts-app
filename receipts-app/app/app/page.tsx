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
      title="Dashboard"
      subtitle="Overview, fresh receipts, and quick access to the notebook's latest movement."
    >
      <Dashboard />
    </AppShell>
  );
}
