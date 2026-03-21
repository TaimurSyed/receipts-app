"use client";

export function VoicePlayback({ url }: { url: string }) {
  return (
    <div className="mt-4 rounded-2xl border border-[#5a4b3f] bg-black/20 p-3">
      <p className="mb-2 text-xs uppercase tracking-[0.24em] text-zinc-500">Original voice memo</p>
      <audio controls preload="none" className="w-full">
        <source src={url} />
        Your browser does not support audio playback.
      </audio>
    </div>
  );
}
