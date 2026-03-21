"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Mic, Square, Upload } from "lucide-react";
import { createVoiceEntry } from "@/app/app/actions";

const initialState = { ok: false, message: "" };

export function VoiceEntryForm({ date, contextLabel }: { date?: string; contextLabel?: string }) {
  const [state, formAction, pending] = useActionState(createVoiceEntry, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [recordedLabel, setRecordedLabel] = useState("");

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setRecordedLabel("");
    }
  }, [state]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const file = new File([blob], `voice-memo-${Date.now()}.${mimeType.includes("webm") ? "webm" : "m4a"}`, {
          type: mimeType,
        });

        const dt = new DataTransfer();
        dt.items.add(file);
        if (fileInputRef.current) {
          fileInputRef.current.files = dt.files;
        }
        setRecordedLabel(`Recorded ${Math.max(1, Math.round(file.size / 1024))} KB ready to transcribe`);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setRecordedLabel("Recording… speak when you’re ready.");
    } catch {
      setRecordedLabel("Microphone access failed. You can still upload an audio file manually.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Voice memo</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Say it instead of typing it</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Record on the spot or upload an audio note. Receipts will turn it into journal material.
          </p>
        </div>
        <Mic className="h-5 w-5 text-amber-300" />
      </div>

      <form ref={formRef} action={formAction} className="mt-6 space-y-4">
        {date ? <input type="hidden" name="entryDate" value={date} /> : null}
        {contextLabel ? <input type="hidden" name="contextLabel" value={contextLabel} /> : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={recording ? stopRecording : startRecording}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold ${
              recording ? "bg-rose-300 text-black" : "bg-amber-300 text-black"
            }`}
          >
            {recording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {recording ? "Stop recording" : "Record now"}
          </button>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 font-semibold text-zinc-200">
            <Upload className="h-4 w-4" />
            Choose audio file
            <input ref={fileInputRef} name="audio" type="file" accept="audio/*" className="hidden" />
          </label>
        </div>

        {recordedLabel ? <p className="text-sm text-zinc-400">{recordedLabel}</p> : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">How did this feel?</label>
            <select name="mood" defaultValue="3" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none">
              <option value="1">Very low — rough / overwhelmed</option>
              <option value="2">Low — tense / drained</option>
              <option value="3">Neutral — ordinary / hard to read</option>
              <option value="4">Good — calm / decent</option>
              <option value="5">Great — energized / strong</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Tags</label>
            <input
              name="tags"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
              placeholder="voice, reflection, late-night"
            />
          </div>
        </div>
        <button disabled={pending} className="w-full rounded-full bg-amber-300 px-5 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-70">
          {pending ? "Transcribing..." : "Save voice memo"}
        </button>
        {state.message ? <p className="text-sm text-zinc-400">{state.message}</p> : null}
      </form>
    </section>
  );
}
