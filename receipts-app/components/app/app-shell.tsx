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
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <PageNav items={[{ label: "App", href: "/app" }, { label: title }]} />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Receipts journal</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{subtitle}</p>
        </div>
        <SignOutButton />
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr] lg:gap-6">
        <Sidebar />
        <div className="min-w-0">{children}</div>
      </div>
    </main>
  );
}