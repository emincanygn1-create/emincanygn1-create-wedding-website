-- ============================================
-- ADIM 13: HİKAYEMİZ + SIKÇA SORULAN SORULAR
-- Supabase > SQL Editor'e yapıştır ve "Run".
-- ============================================

-- --------------------------------------------
-- HİKAYEMİZ
-- --------------------------------------------
create table if not exists story_posts (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,
  photo_url text,

  date_text text default '',
  date_text_en text default '',
  date_text_it text default '',

  title text default '',
  title_en text default '',
  title_it text default '',

  body text default '',
  body_en text default '',
  body_it text default '',

  is_visible boolean not null default true,
  created_at timestamptz default now()
);

create index if not exists story_posts_order_idx on story_posts (sort_order, created_at);

alter table story_posts enable row level security;

drop policy if exists "Herkes hikayeyi okur" on story_posts;
create policy "Herkes hikayeyi okur" on story_posts
  for select using (is_visible = true or auth.role() = 'authenticated');

drop policy if exists "Admin hikaye ekler" on story_posts;
create policy "Admin hikaye ekler" on story_posts
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "Admin hikaye gunceller" on story_posts;
create policy "Admin hikaye gunceller" on story_posts
  for update using (auth.role() = 'authenticated');

drop policy if exists "Admin hikaye siler" on story_posts;
create policy "Admin hikaye siler" on story_posts
  for delete using (auth.role() = 'authenticated');


-- --------------------------------------------
-- SIKÇA SORULAN SORULAR
-- --------------------------------------------
create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null default 0,

  question text default '',
  question_en text default '',
  question_it text default '',

  answer text default '',
  answer_en text default '',
  answer_it text default '',

  is_visible boolean not null default true,
  created_at timestamptz default now()
);

create index if not exists faqs_order_idx on faqs (sort_order, created_at);

alter table faqs enable row level security;

drop policy if exists "Herkes sss okur" on faqs;
create policy "Herkes sss okur" on faqs
  for select using (is_visible = true or auth.role() = 'authenticated');

drop policy if exists "Admin sss ekler" on faqs;
create policy "Admin sss ekler" on faqs
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "Admin sss gunceller" on faqs;
create policy "Admin sss gunceller" on faqs
  for update using (auth.role() = 'authenticated');

drop policy if exists "Admin sss siler" on faqs;
create policy "Admin sss siler" on faqs
  for delete using (auth.role() = 'authenticated');
