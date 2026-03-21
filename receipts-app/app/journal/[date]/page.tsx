import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/env";

type PageProps = {
  params: Promise<{ date: string }>;
};

export default async function JournalDayPage({ params }: PageProps) {
  const { date } = await params;

  if (!hasSupabaseEnv()) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-zinc-400">Supabase is not configured.</div>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const start = `${date}T00:00:00.000Z`;
  const end = `${date}T23:59:59.999Z`;

  const { data: entries } = await supabase
    .from("entries")
    .select("id, title, content, created_at, mood_score, tags")
    .eq("user_id", user.id)
    .gte("created_at", start)
    .lte("created_at", end)
    .order("created_at", { ascending: true });

  const displayDate = new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Daily page</p>
          <h1 className="mt-2 font-serif text-4xl text-amber-50">{displayDate}</h1>
        </div>
        <Link href="/insights" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">
          Back to journal
        </Link>
      </div>

      <section className="rounded-[2.5rem] border border-[#3b3128] bg-[#11100f] p-6 sm:p-8">
        <div className="border-b border-amber-50/10 pb-5">
          <p className="text-sm leading-7 text-zinc-400">
            What happened on this day, what may have shifted your mood, and what might help next time.
          </p>
        </div>

        <div className="mt-8 space-y-5">
          {entries && entries.length > 0 ? (
            entries.map((entry) => (
              <article key={entry.id} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{entry.title || "Untitled entry"}</h2>
                    <p className="mt-1 text-sm text-zinc-500">
                      {new Date(entry.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                    Mood {entry.mood_score ?? 3}/5
                  </span>
                </div>

                <p className="mt-4 whitespace-pre-line font-serif text-[17px] leading-8 text-zinc-200">{entry.content}</p>

                {entry.tags?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.tags.map((tag: string) => (
                      <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300">#{tag}</span>
                    ))}
                  </div>
                ) : null}
              </article>
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 text-zinc-400">
              No entries were saved for this day yet.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
