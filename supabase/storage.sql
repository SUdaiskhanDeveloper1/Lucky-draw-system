-- =============================================================================
--  Supabase Storage buckets + policies
--  Run AFTER schema.sql / rls.sql
-- =============================================================================

-- Create buckets (public read for display assets; receipts/documents are private)
insert into storage.buckets (id, name, public)
values
  ('avatars',          'avatars',          true),
  ('banners',          'banners',          true),
  ('campaign-images',  'campaign-images',  true),
  ('prize-images',     'prize-images',     true),
  ('payment-receipts', 'payment-receipts', false),
  ('documents',        'documents',        false)
on conflict (id) do nothing;

-- --- Public display buckets: anyone can read -------------------------------
drop policy if exists "public read display buckets" on storage.objects;
create policy "public read display buckets" on storage.objects
  for select using (bucket_id in ('avatars','banners','campaign-images','prize-images'));

-- Authenticated users can upload to their own avatar folder (avatars/<uid>/...)
drop policy if exists "users upload own avatar" on storage.objects;
create policy "users upload own avatar" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "users update own avatar" on storage.objects;
create policy "users update own avatar" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- Admins manage banners / campaign / prize images
drop policy if exists "admins manage display buckets" on storage.objects;
create policy "admins manage display buckets" on storage.objects
  for all to authenticated
  using (bucket_id in ('banners','campaign-images','prize-images') and public.is_admin())
  with check (bucket_id in ('banners','campaign-images','prize-images') and public.is_admin());

-- --- payment-receipts (private) --------------------------------------------
-- Users upload receipts into payment-receipts/<uid>/...
drop policy if exists "users upload receipts" on storage.objects;
create policy "users upload receipts" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'payment-receipts' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "users read own receipts" on storage.objects;
create policy "users read own receipts" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'payment-receipts'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );

-- --- documents (private, user-scoped) --------------------------------------
drop policy if exists "users manage own documents" on storage.objects;
create policy "users manage own documents" on storage.objects
  for all to authenticated
  using (
    bucket_id = 'documents'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  )
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
