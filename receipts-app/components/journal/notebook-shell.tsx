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
    <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="grid gap-5 lg:grid-cols-[320px_1fr] lg:items-start lg:gap-6">
        <div className="order-2 lg:order-1">
          <NotebookSidebar archive={archive} selectedWeek={selectedWeek} selectedDate={selectedDate} />
        </div>
        <div className="relative order-1 min-w-0 lg:order-2">{children}</div>
      </div>
    </main>
  );
}
