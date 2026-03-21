"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function PageNav({
  items,
  showBack = true,
}: {
  items: Array<{ label: string; href?: string }>;
  showBack?: boolean;
}) {
  const router = useRouter();

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
      {showBack ? (
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-full border border-[#5a4b3f] bg-[#1a1714] px-4 py-2 font-semibold text-[#f1e7d4] transition hover:bg-[#221d18]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 text-zinc-500">
        {items.map((item, index) => (
          <span key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href ? (
              <Link href={item.href} className="transition hover:text-zinc-300">
                {item.label}
              </Link>
            ) : (
              <span className="text-zinc-300">{item.label}</span>
            )}
            {index < items.length - 1 ? <span>/</span> : null}
          </span>
        ))}
      </div>
    </div>
  );
}
