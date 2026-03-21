create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  focus_area text,
  tone_preference text default 'direct',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('text', 'voice')),
  title text,
  content text not null,
  transcript text,
  mood_score int check (mood_score between 1 and 5),
  tags text[] not null default '{}',
  source text not null default 'manual',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('pattern', 'contradiction', 'weekly_receipt')),
  title text not null,
  body text not null,
  confidence text not null check (confidence in ('low', 'medium', 'high')),
  evidence_entry_ids uuid[] not null default '{}',
  archived boolean not null default false,
  week_start date,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;
alter table public.entries enable row level security;
alter table public.insights enable row level security;

create policy "Users can read own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

create policy "Users can read own entries"
  on public.entries
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own entries"
  on public.entries
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own entries"
  on public.entries
  for update
  using (auth.uid() = user_id);

create policy "Users can delete own entries"
  on public.entries
  for delete
  using (auth.uid() = user_id);

create policy "Users can read own insights"
  on public.insights
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own insights"
  on public.insights
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own insights"
  on public.insights
  for update
  using (auth.uid() = user_id);
