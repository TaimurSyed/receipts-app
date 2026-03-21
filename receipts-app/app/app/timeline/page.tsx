import { AppShell } from "@/components/app/app-shell";
import { TimelineList } from "@/components/app/timeline-list";
import { requireUser } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/env";
import { getEntries, getVoicePlaybackUrl } from "@/lib/entries";

export default async function TimelinePage() {
  if (hasSupabaseEnv()) {
    await requireUser();
  }

  const entries = await getEntries(50);
  const playbackUrls = Object.fromEntries(
    await Promise.all(entries.map(async (entry) => [entry.id, await getVoicePlaybackUrl(entry.audioPath)] as const)),
  );

  return (
    <AppShell
      title="Timeline"
      subtitle="Browse your recent notebook history in one place instead of pretending the dashboard is the timeline."
    >
      <TimelineList entries={entries} playbackUrls={playbackUrls} />
    </AppShell>
  );
}
