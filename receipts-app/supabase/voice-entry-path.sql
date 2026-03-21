alter table public.entries
  add column if not exists audio_path text;
