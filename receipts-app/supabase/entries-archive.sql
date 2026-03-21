alter table public.entries
  add column if not exists archived boolean not null default false;
