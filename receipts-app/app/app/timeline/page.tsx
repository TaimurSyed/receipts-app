import { AppShell } from "@/components/app/app-shell";
import { TimelineList } from "@/components/app/timeline-list";
import { requireUser } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/env";
import { getEntries, getImagePlaybackUrl, getVoicePlaybackUrl } from "@/lib/entries";

type TimelinePageProps = {
  searchParams?: Promise<{ q?: string; type?: string; mood?: string; range?: string; archived?: string; relatedTo?: string }>;
};

export default async function TimelinePage({ searchParams }: TimelinePageProps) {
  if (hasSupabaseEnv()) {
    await requireUser();
  }

  const params = (await searchParams) ?? {};
  const query = params.q?.trim() ?? "";
  const type = params.type?.trim() || "all";
  const mood = params.mood?.trim() || "all";
  const range = params.range?.trim() || "all";
  const archived = params.archived?.trim() || "active";
  const relatedTo = params.relatedTo?.trim() || "";

  const entries = await getEntries(50, { query, type, mood, range, archived, relatedTo });
  const playbackUrls = Object.fromEntries(
    await Promise.all(entries.map(async (entry) => [entry.id, await getVoicePlaybackUrl(entry.audioPath)] as const)),
  );
  const imageUrls = Object.fromEntries(
    await Promise.all(entries.map(async (entry) => [entry.id, await getImagePlaybackUrl(entry.imagePath)] as const)),
  );

  return (
    <AppShell
      title="Timeline"
      subtitle={relatedTo
        ? "These notes are ranked by how closely they connect to the one you came from."
        : "Browse your notebook history, search old moments, and filter by how they were captured or how the period felt."}
    >
      <TimelineList
        entries={entries}
        playbackUrls={playbackUrls}
        imageUrls={imageUrls}
        query={query}
        type={type}
        mood={mood}
        range={range}
        archived={archived}
        relatedTo={relatedTo}
      />
    </AppShell>
  );
}
