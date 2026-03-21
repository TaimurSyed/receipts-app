import type { ReactNode } from "react";
import type { JournalYear } from "@/lib/journal";
import { NotebookSidebar } from "@/components/journal/notebook-sidebar";

export function NotebookShell({
  archive,
  selectedWeek,
  selectedDate,
  children,
}: {
  archive: JournalYear[];
  selectedWeek?: string;
  selectedDate?: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:items-start">
        <NotebookSidebar archive={archive} selectedWeek={selectedWeek} selectedDate={selectedDate} />
        <div className="relative">{children}</div>
      </div>
    </main>
  );
}
