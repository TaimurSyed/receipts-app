alter table public.insights
  add column if not exists scope text not null default 'week';

alter table public.insights
  add column if not exists period_start date;

update public.insights
set scope = 'week'
where scope is null or scope = '';

update public.insights
set period_start = coalesce(period_start, week_start)
where period_start is null;

alter table public.insights drop constraint if exists insights_scope_check;
alter table public.insights
  add constraint insights_scope_check
  check (scope in ('week', 'month'));
