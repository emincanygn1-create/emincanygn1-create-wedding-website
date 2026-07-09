-- ============================================
-- ADIM 14: YÜKLEME ANAHTARI + YEMEK TERCİHİ
-- Supabase > SQL Editor'e yapıştır ve "Run".
-- ============================================

-- --------------------------------------------
-- 1) Misafir fotoğraf yükleme anahtarı
-- Varsayılan KAPALI. Düğün sabahı panelden açarsın.
-- --------------------------------------------
alter table site_content add column if not exists uploads_enabled boolean default false;
update site_content set uploads_enabled = false where uploads_enabled is null;

-- Arayüzü gizlemek yeterli değil; veritabanı da bilmeli.
drop policy if exists "Herkes misafir fotosu ekler" on guest_photos;
create policy "Herkes misafir fotosu ekler" on guest_photos
  for insert with check (
    char_length(url) > 0
    and char_length(coalesce(caption, '')) <= 300
    and char_length(coalesce(uploader_name, '')) <= 60
    and exists (
      select 1 from site_content
       where id = 1 and coalesce(uploads_enabled, false) = true
    )
  );

-- Depolama tarafı da aynı anahtara baksın.
drop policy if exists "Herkes misafir medyasi yukleyebilir" on storage.objects;
create policy "Herkes misafir medyasi yukleyebilir" on storage.objects
  for insert with check (
    bucket_id = 'guest-media'
    and exists (
      select 1 from site_content
       where id = 1 and coalesce(uploads_enabled, false) = true
    )
  );


-- --------------------------------------------
-- 2) RSVP: yemek tercihi / alerji
-- --------------------------------------------
alter table rsvps add column if not exists diet text default '';

-- Insert kuralını yeni alanla birlikte yeniden kur.
drop policy if exists "Herkes rsvp gonderebilir" on rsvps;
create policy "Herkes rsvp gonderebilir" on rsvps
  for insert with check (
    char_length(name) between 1 and 80
    and char_length(coalesce(message, '')) <= 1000
    and char_length(coalesce(diet, '')) <= 300
    and guest_count between 1 and 20
    and exists (
      select 1 from site_content
       where id = 1
         and coalesce(rsvp_enabled, true) = true
         and (rsvp_deadline is null or now() < rsvp_deadline)
    )
  );

-- Aynı ismin iki kez cevap verdiğini panelde görebilmek için.
create index if not exists rsvps_name_idx on rsvps (lower(name));
