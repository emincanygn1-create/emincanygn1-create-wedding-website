-- ============================================
-- ADIM 5: RSVP + DİLEKLER + MİSAFİR GALERİSİ + 3 DİL
-- Bu kodun tamamını Supabase > SQL Editor'e yapıştırıp
-- "Run" butonuna basman yeterli. Tekrar tekrar çalıştırmak zararsız.
-- ============================================


-- --------------------------------------------
-- 1) SITE_CONTENT: İngilizce ve İtalyanca sütunları
-- Boş bırakılan alanlarda site otomatik olarak Türkçesini gösterir.
-- --------------------------------------------
alter table site_content add column if not exists bride_parents_en text default '';
alter table site_content add column if not exists bride_parents_it text default '';
alter table site_content add column if not exists groom_parents_en text default '';
alter table site_content add column if not exists groom_parents_it text default '';
alter table site_content add column if not exists wedding_city_en text default '';
alter table site_content add column if not exists wedding_city_it text default '';
alter table site_content add column if not exists ceremony_venue_en text default '';
alter table site_content add column if not exists ceremony_venue_it text default '';
alter table site_content add column if not exists ceremony_date_text_en text default '';
alter table site_content add column if not exists ceremony_date_text_it text default '';
alter table site_content add column if not exists ceremony_time_text_en text default '';
alter table site_content add column if not exists ceremony_time_text_it text default '';
alter table site_content add column if not exists ceremony_address_en text default '';
alter table site_content add column if not exists ceremony_address_it text default '';
alter table site_content add column if not exists reception_venue_en text default '';
alter table site_content add column if not exists reception_venue_it text default '';
alter table site_content add column if not exists reception_date_text_en text default '';
alter table site_content add column if not exists reception_date_text_it text default '';
alter table site_content add column if not exists reception_time_text_en text default '';
alter table site_content add column if not exists reception_time_text_it text default '';
alter table site_content add column if not exists reception_address_en text default '';
alter table site_content add column if not exists reception_address_it text default '';
alter table site_content add column if not exists quote_text_en text default '';
alter table site_content add column if not exists quote_text_it text default '';


-- --------------------------------------------
-- 2) RSVP (Katılım bildirimi)
-- Herkes gönderebilir, sadece sen (admin) okuyabilirsin.
-- --------------------------------------------
create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text default '',
  phone text default '',
  attending boolean not null default true,
  guest_count integer not null default 1,
  side text default '',            -- 'bride' | 'groom' | ''
  message text default '',
  locale text default 'tr',
  created_at timestamptz default now()
);

alter table rsvps enable row level security;

drop policy if exists "Herkes rsvp gonderebilir" on rsvps;
create policy "Herkes rsvp gonderebilir" on rsvps
  for insert with check (
    char_length(name) between 1 and 80
    and char_length(coalesce(message, '')) <= 1000
    and guest_count between 1 and 20
  );

drop policy if exists "Sadece admin rsvp okur" on rsvps;
create policy "Sadece admin rsvp okur" on rsvps
  for select using (auth.role() = 'authenticated');

drop policy if exists "Sadece admin rsvp siler" on rsvps;
create policy "Sadece admin rsvp siler" on rsvps
  for delete using (auth.role() = 'authenticated');


-- --------------------------------------------
-- 3) DİLEKLER (yorum kutusu)
-- Herkes yazabilir ve okuyabilir. Sen gizleyebilir / silebilirsin.
-- --------------------------------------------
create table if not exists wishes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  locale text default 'tr',
  is_visible boolean not null default true,
  created_at timestamptz default now()
);

alter table wishes enable row level security;

drop policy if exists "Herkes dilek yazabilir" on wishes;
create policy "Herkes dilek yazabilir" on wishes
  for insert with check (
    char_length(name) between 1 and 60
    and char_length(message) between 1 and 800
  );

drop policy if exists "Herkes gorunen dilekleri okur" on wishes;
create policy "Herkes gorunen dilekleri okur" on wishes
  for select using (is_visible = true or auth.role() = 'authenticated');

drop policy if exists "Admin dilek gunceller" on wishes;
create policy "Admin dilek gunceller" on wishes
  for update using (auth.role() = 'authenticated');

drop policy if exists "Admin dilek siler" on wishes;
create policy "Admin dilek siler" on wishes
  for delete using (auth.role() = 'authenticated');


-- --------------------------------------------
-- 4) MİSAFİR FOTOĞRAFLARI (Instagram tarzı akış)
-- --------------------------------------------
create table if not exists guest_photos (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  storage_path text default '',
  caption text default '',
  uploader_name text default '',
  likes integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz default now()
);

create index if not exists guest_photos_created_idx on guest_photos (created_at desc);

alter table guest_photos enable row level security;

drop policy if exists "Herkes misafir fotosu ekler" on guest_photos;
create policy "Herkes misafir fotosu ekler" on guest_photos
  for insert with check (
    char_length(url) > 0
    and char_length(coalesce(caption, '')) <= 300
    and char_length(coalesce(uploader_name, '')) <= 60
  );

drop policy if exists "Herkes gorunen fotolari okur" on guest_photos;
create policy "Herkes gorunen fotolari okur" on guest_photos
  for select using (is_visible = true or auth.role() = 'authenticated');

drop policy if exists "Admin misafir fotosu gunceller" on guest_photos;
create policy "Admin misafir fotosu gunceller" on guest_photos
  for update using (auth.role() = 'authenticated');

drop policy if exists "Admin misafir fotosu siler" on guest_photos;
create policy "Admin misafir fotosu siler" on guest_photos
  for delete using (auth.role() = 'authenticated');


-- Beğeni sayacı: misafirler tabloyu güncelleyemez, sadece bu fonksiyonu çağırır.
create or replace function increment_photo_likes(photo_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_likes integer;
begin
  update guest_photos
     set likes = likes + 1
   where id = photo_id and is_visible = true
  returning likes into new_likes;

  return coalesce(new_likes, 0);
end;
$$;

grant execute on function increment_photo_likes(uuid) to anon, authenticated;


-- --------------------------------------------
-- 5) MİSAFİR FOTOĞRAFLARI İÇİN DEPOLAMA ALANI
-- 15 MB sınırı + sadece resim dosyaları.
-- --------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'guest-media',
  'guest-media',
  true,
  15728640,
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update
  set public = true,
      file_size_limit = 15728640,
      allowed_mime_types = array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

drop policy if exists "Herkes misafir medyasini gorebilir" on storage.objects;
create policy "Herkes misafir medyasini gorebilir" on storage.objects
  for select using (bucket_id = 'guest-media');

drop policy if exists "Herkes misafir medyasi yukleyebilir" on storage.objects;
create policy "Herkes misafir medyasi yukleyebilir" on storage.objects
  for insert with check (bucket_id = 'guest-media');

drop policy if exists "Admin misafir medyasini siler" on storage.objects;
create policy "Admin misafir medyasini siler" on storage.objects
  for delete using (bucket_id = 'guest-media' and auth.role() = 'authenticated');
