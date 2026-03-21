import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10 lg:px-8">
      <div className="grid w-full gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
        <section className="space-y-6">
          <p className="text-xs uppercase tracking-[0.24em] text-amber-300">Receipts auth</p>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            Sign in and let your patterns start counting.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-400">
            Receipts is built to turn messy notes into evidence-backed insight. Auth is the gate between the idea and a usable product.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
            <Link href="/" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white">
              Back to landing page
            </Link>
            <Link href="/app" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white">
              View app shell
            </Link>
          </div>
        </section>

        <AuthForm mode="sign-in" />
      </div>
    </main>
  );
}
