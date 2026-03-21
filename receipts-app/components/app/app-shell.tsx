import type { ReactNode } from "react";
import { Sidebar } from "@/components/app/sidebar";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { PageNav } from "@/components/navigation/page-nav";

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <PageNav items={[{ label: "App", href: "/app" }, { label: title }]} />

      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Receipts app</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{subtitle}</p>
        </div>
        <SignOutButton />
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        {children}
      </div>
    </main>
  );
}
