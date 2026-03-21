import Link from "next/link";

export function PageTurnNav({
  previous,
  next,
}: {
  previous?: { href: string; label: string };
  next?: { href: string; label: string };
}) {
  return (
    <div className="mt-8 flex items-center justify-between gap-4">
      {previous ? (
        <Link href={previous.href} className="rounded-full border border-[#5a4b3f] bg-[#1a1714] px-4 py-2 text-sm font-semibold text-[#f1e7d4]">
          ← {previous.label}
        </Link>
      ) : <div />}
      {next ? (
        <Link href={next.href} className="rounded-full border border-[#5a4b3f] bg-[#1a1714] px-4 py-2 text-sm font-semibold text-[#f1e7d4]">
          {next.label} →
        </Link>
      ) : null}
    </div>
  );
}
