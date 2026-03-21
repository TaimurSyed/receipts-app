insert into storage.buckets (id, name, public)
values ('voice-memos', 'voice-memos', false)
on conflict (id) do nothing;

create policy "Users can upload own voice memos"
on storage.objects
for insert
with check (
  bucket_id = 'voice-memos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can read own voice memos"
on storage.objects
for select
using (
  bucket_id = 'voice-memos'
  and auth.uid()::text = (storage.foldername(name))[1]
);
