alter table public.annotations
  add column if not exists author text not null default 'user' check (author in ('user', 'ai'));

alter table public.annotations
  add column if not exists reply_to uuid references public.annotations (id) on delete cascade;
