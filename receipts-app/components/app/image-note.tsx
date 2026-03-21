import Image from "next/image";

export function ImageNote({ url }: { url: string }) {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-[#5a4b3f] bg-black/20">
      <Image src={url} alt="Notebook image attachment" width={1200} height={900} className="h-auto w-full object-cover" unoptimized />
    </div>
  );
}
