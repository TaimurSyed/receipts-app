import Link from "next/link";
import { BookHeart, House, NotebookPen, Sparkles, TimerReset } from "lucide-react";

const items = [
  { label: "Home", icon: House, href: "/app" },
  { label: "New entry", icon: NotebookPen, href: "/app/new-entry" },
  { label: "Timeline", icon: TimerReset, href: "/app/timeline" },
  { label: "Journal", icon: Sparkles, href: "/insights" },
];

export function Sidebar() {
  return (
    <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-4 sm:p-5">
      <div className="flex items-center gap-3 border-b border-white/10 pb-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-300 text-black">
          <BookHeart className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Receipts</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Shared journal</h2>
        </div>
      </div>

      <nav className="mt-5 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-1">
        {items.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white sm:w-full"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
