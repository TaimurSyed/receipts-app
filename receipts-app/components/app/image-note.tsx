import Image from "next/image";

export function ImageNote({ url, compact = false }: { url: string; compact?: boolean }) {
  return (
    <div className={`attachment-slip mt-4 overflow-hidden rounded-2xl border border-[#5a4b3f] bg-[linear-gradient(180deg,rgba(255,248,235,0.05),rgba(0,0,0,0.18))] p-2 ${compact ? "pt-5" : "pt-6"}`}>
      <Image
        src={url}
        alt="Notebook image attachment"
        width={1200}
        height={900}
        className={`h-auto w-full rounded-[1rem] object-contain bg-black/10 shadow-[0_12px_24px_rgba(0,0,0,0.18)] ${compact ? "max-h-[16rem]" : "max-h-[26rem]"}`}
        unoptimized
      />
    </div>
  );
}
