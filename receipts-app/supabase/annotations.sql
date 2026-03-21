create table if not exists public.annotations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  page_type text not null check (page_type in ('week', 'day')),
  page_key text not null,
  body text not null,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.annotations enable row level security;

create policy "Users can read own annotations"
  on public.annotations
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own annotations"
  on public.annotations
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own annotations"
  on public.annotations
  for update
  using (auth.uid() = user_id);

create policy "Users can delete own annotations"
  on public.annotations
  for delete
  using (auth.uid() = user_id);
