-- ─── Run these in Supabase SQL Editor ─────────────────────────────────────────

-- 1. Profiles table (extends auth.users)
create table if not exists public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  email       text,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz default now()
);

-- 2. Test results table
create table if not exists public.test_results (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users on delete cascade not null,
  score      float8 not null,   -- actualMeanRatio (e.g. 0.93)
  ratio      float8 not null,   -- expectedTPR from survey
  status     text not null,     -- 'Normal Algı' | 'Yavaş Algı' | 'Hızlı Algı'
  test_type  text not null default 'Zaman Algısı Testi',
  created_at timestamptz default now()
);

-- 3. Row Level Security
alter table public.profiles    enable row level security;
alter table public.test_results enable row level security;

-- Profiles: users can read/update only their own row
create policy "profiles_select" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- Test results: users can read/insert/delete only their own rows
create policy "results_select" on public.test_results for select using (auth.uid() = user_id);
create policy "results_insert" on public.test_results for insert with check (auth.uid() = user_id);
create policy "results_delete" on public.test_results for delete using (auth.uid() = user_id);

-- 4. Storage buckets (create in Supabase Dashboard → Storage)
-- bucket: "avatars"    → public: false, allowed MIME: image/*
-- bucket: "blog-media" → public: true,  allowed MIME: image/*, application/pdf
