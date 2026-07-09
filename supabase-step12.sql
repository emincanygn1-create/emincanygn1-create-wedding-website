-- ============================================
-- ADIM 12: ETKİNLİK VE GERİ SAYIM GÖRSELLERİ
-- Artık galeriden rastgele fotoğraf çekilmiyor.
-- Supabase > SQL Editor'e yapıştır ve "Run".
-- ============================================

alter table site_content add column if not exists ceremony_photo_url text;
alter table site_content add column if not exists reception_photo_url text;
alter table site_content add column if not exists countdown_bg_url text;

-- Adım 11'i atladıysan bu satır da burada dursun, zararı yok.
alter table site_content add column if not exists single_event boolean default false;
update site_content set single_event = false where single_event is null;
