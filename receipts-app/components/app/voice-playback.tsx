"use client";

export function VoicePlayback({ url }: { url: string }) {
  return (
    <div className="voice-slip mt-4 rounded-2xl border border-[#5a4b3f] bg-black/20 p-3 pt-4">
      <p className="mb-3 text-xs uppercase tracking-[0.24em] text-zinc-500">Original voice memo</p>
      <audio controls preload="none" className="relative z-[1] w-full opacity-95">
        <source src={url} />
        Your browser does not support audio playback.
      </audio>
    </div>
  );
}
