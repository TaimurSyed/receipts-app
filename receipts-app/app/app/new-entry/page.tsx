import { AppShell } from "@/components/app/app-shell";
import { CaptureHub } from "@/components/app/capture-hub";
import { requireUser } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/env";

export default async function NewEntryPage() {
  if (hasSupabaseEnv()) {
    await requireUser();
  }

  return (
    <AppShell
      title="New entry"
      subtitle="A dedicated capture page for text and voice so the sidebar link actually means something."
    >
      <CaptureHub />
    </AppShell>
  );
}
