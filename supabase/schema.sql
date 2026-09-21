-- ===========================================================
-- Run this once in your Supabase project's SQL editor
-- (Dashboard → SQL Editor → New query → paste → Run).
-- ===========================================================

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('social-media','website','uiux','character','comic','ip-merch')),
  title text,
  media_url text not null,
  media_type text not null default 'image' check (media_type in ('image','video')),
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table projects enable row level security;

-- Anyone (including visitors who are not logged in) can read rows
-- that are published — this is what powers the public category pages.
create policy "Public can read published projects"
  on projects for select
  using (published = true);

-- Only a logged-in user (you) can insert, update, or delete rows —
-- this is what the admin page uses. Since you never expose a public
-- sign-up form, the only account that can ever be "authenticated"
-- is the one you create for yourself in Authentication → Users.
create policy "Authenticated user can manage projects"
  on projects for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');


-- ===========================================================
-- Storage: first create a bucket named exactly "media" in the
-- Storage tab of the dashboard (Storage → New bucket → name it
-- "media" → you can leave "Public bucket" OFF, these policies
-- handle access instead). Then run the policies below.
-- ===========================================================

create policy "Public can read media bucket"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "Authenticated user can upload to media bucket"
  on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "Authenticated user can delete from media bucket"
  on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');
