import Link from "next/link";
import { Activity, LayoutDashboard, NotebookPen, Sparkles, TimerReset } from "lucide-react";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/app" },
  { label: "New entry", icon: NotebookPen, href: "/app" },
  { label: "Timeline", icon: TimerReset, href: "/app" },
  { label: "Insights", icon: Sparkles, href: "/insights" },
];

export function Sidebar() {
  return (
    <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-3 border-b border-white/10 pb-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-300 text-black">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Receipts</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Behavior dashboard</h2>
        </div>
      </div>

      <nav className="mt-5 space-y-2">
        {items.map(({ label, icon: Icon, href }, index) => (
          <Link
            key={label}
            href={href}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${
              index === 0
                ? "bg-white text-black"
                : "bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
