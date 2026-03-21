import { AppShell } from "@/components/app/app-shell";
import { TimelineList } from "@/components/app/timeline-list";
import { requireUser } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/env";
import { getEntries } from "@/lib/entries";

export default async function TimelinePage() {
  if (hasSupabaseEnv()) {
    await requireUser();
  }

  const entries = await getEntries(50);

  return (
    <AppShell
      title="Timeline"
      subtitle="Browse your recent notebook history in one place instead of pretending the dashboard is the timeline."
    >
      <TimelineList entries={entries} />
    </AppShell>
  );
}
