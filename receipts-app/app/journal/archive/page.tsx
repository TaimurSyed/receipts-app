import Link from "next/link";
import { NotebookShell } from "@/components/journal/notebook-shell";
import { RestoreEntryButton } from "@/components/journal/restore-entry-button";
import { getJournalArchive } from "@/lib/journal";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export default async function ArchivePage() {
  const archive = await getJournalArchive();

  if (!hasSupabaseEnv()) {
    return <NotebookShell archive={archive}><div className="rounded-[2.7rem] border border-[#4a3c2f] bg-[#15120f] p-8 text-zinc-400 shadow-panel">Supabase is not configured.</div></NotebookShell>;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: entries } = await supabase
    .from("entries")
    .select("id, title, content, created_at, tags")
    .eq("user_id", user.id)
    .eq("archived", true)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <NotebookShell archive={archive}>
      <div className="rounded-[2.7rem] border border-[#4a3c2f] bg-[linear-gradient(180deg,#15120f_0%,#0f0d0b_100%)] p-6 sm:p-8 shadow-panel">
        <div className="border-b border-[#5e503f]/40 pb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#dbc59b]">Archive</p>
          <h1 className="mt-3 font-serif text-5xl text-[#f5ecd8]">Archived notes</h1>
          <p className="mt-3 text-zinc-400">Notes you hid from the main notebook flow, but can still restore.</p>
        </div>

        <div className="mt-8 space-y-4">
          {entries && entries.length > 0 ? entries.map((entry) => {
            const dateKey = new Date(entry.created_at).toISOString().slice(0, 10);
            return (
              <article key={entry.id} className="rounded-[2rem] border border-[#4f4338] bg-[#15120f] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-[#f1e7d4]">{entry.title || "Untitled entry"}</h2>
                    <p className="mt-1 text-sm text-zinc-500">{new Date(entry.created_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}</p>
                  </div>
                  <RestoreEntryButton entryId={entry.id} dateKey={dateKey} />
                </div>
                <p className="mt-4 whitespace-pre-line font-serif text-[17px] leading-8 text-zinc-200">{entry.content}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/journal/${dateKey}`} className="rounded-full border border-[#5a4b3f] px-3 py-1 text-xs text-zinc-300">Open day</Link>
                  {entry.tags?.map((tag: string) => <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300">#{tag}</span>)}
                </div>
              </article>
            );
          }) : <div className="rounded-[2rem] border border-[#4f4338] bg-[#15120f] p-6 text-zinc-400">No archived notes yet.</div>}
        </div>
      </div>
    </NotebookShell>
  );
}
