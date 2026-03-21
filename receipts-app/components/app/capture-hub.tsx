import { EntryForm } from "@/components/app/entry-form";
import { VoiceEntryForm } from "@/components/app/voice-entry-form";

export function CaptureHub() {
  return (
    <section id="entry-form" className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Capture</p>
        <h2 className="mt-2 font-serif text-3xl text-[#f5ecd8]">Catch the day before it slips away</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Text for clarity, voice for speed. This is the front door for everything that ends up in the notebook.
        </p>
      </div>
      <EntryForm />
      <VoiceEntryForm />
    </section>
  );
}
