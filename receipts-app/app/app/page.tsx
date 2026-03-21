import { Dashboard } from "@/components/app/dashboard";
import { Sidebar } from "@/components/app/sidebar";

export default function AppPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <Dashboard />
      </div>
    </main>
  );
}
