# Supabase setup for Lensed Memoir

Run these in your Supabase project: **SQL Editor** and **Storage**.

## 1. Tables (SQL Editor)

```sql
-- Photos (metadata; image files go in Storage bucket "photos")
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  storage_path text not null,
  alt text default '',
  created_at timestamptz default now()
);

-- Blogs
create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  created_at timestamptz default now()
);

-- Allow public read and write for this app (anon key).
-- Tighten with RLS/auth later if you add login.
alter table public.photos enable row level security;
alter table public.blogs enable row level security;

create policy "Allow anon read photos" on public.photos for select using (true);
create policy "Allow anon insert photos" on public.photos for insert with check (true);
create policy "Allow anon delete photos" on public.photos for delete using (true);

create policy "Allow anon read blogs" on public.blogs for select using (true);
create policy "Allow anon insert blogs" on public.blogs for insert with check (true);
create policy "Allow anon delete blogs" on public.blogs for delete using (true);
```

## 2. Storage bucket (Storage in dashboard)

1. Go to **Storage** → **New bucket**.
2. Name: `photos`.
3. **Public bucket**: turn ON (so image URLs work without signed links).
4. Create the bucket.
5. Under **Policies** for `photos`, add:
   - **Policy name**: Allow public upload/delete  
   - **Allowed operation**: All (or SELECT + INSERT + DELETE).  
   - **Target roles**: `anon` (or use "For full customization" and add a policy with `true` for SELECT, INSERT, DELETE).

Or in SQL (Storage policies can be added via SQL in some setups):

- In Storage → photos → Policies: "New policy" → "For full customization" → allow `anon` to SELECT, INSERT, DELETE on bucket `photos`.
