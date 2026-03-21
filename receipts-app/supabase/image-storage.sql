insert into storage.buckets (id, name, public)
values ('image-notes', 'image-notes', false)
on conflict (id) do nothing;

create policy "Users can upload own image notes"
on storage.objects
for insert
with check (
  bucket_id = 'image-notes'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can read own image notes"
on storage.objects
for select
using (
  bucket_id = 'image-notes'
  and auth.uid()::text = (storage.foldername(name))[1]
);
