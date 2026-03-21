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
    <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:items-start">
        <NotebookSidebar archive={archive} selectedWeek={selectedWeek} selectedDate={selectedDate} />
        <div>{children}</div>
      </div>
    </main>
  );
}
