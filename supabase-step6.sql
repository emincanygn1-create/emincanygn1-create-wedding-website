-- ============================================
-- ADIM 6: TASARIM ALANLARI
-- Kapak fotoğrafı, arka plan görselleri, müzik, kapanış metni.
-- Supabase > SQL Editor'e yapıştır ve "Run".
-- ============================================

alter table site_content add column if not exists cover_photo_url text;
alter table site_content add column if not exists quote_bg_url text;
alter table site_content add column if not exists closing_bg_url text;
alter table site_content add column if not exists music_url text;

alter table site_content add column if not exists bride_instagram text default '';
alter table site_content add column if not exists groom_instagram text default '';

alter table site_content add column if not exists closing_text text default '';
alter table site_content add column if not exists closing_text_en text default '';
alter table site_content add column if not exists closing_text_it text default '';

-- Müzik dosyası da mevcut "media" alanına yüklenecek.
-- Ses dosyalarına izin vermek için bucket ayarını genişletiyoruz.
update storage.buckets
   set file_size_limit = 52428800
 where id = 'media';
