alter table public.entries drop constraint if exists entries_type_check;

alter table public.entries
  add constraint entries_type_check
  check (type in ('text', 'voice', 'image'));
