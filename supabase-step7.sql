-- ============================================
-- ADIM 7: KAPAK VİDEOSU
-- Supabase > SQL Editor'e yapıştır ve "Run".
-- ============================================

alter table site_content add column if not exists cover_video_url text;

-- Video için depolama sınırını yükseltiyoruz (200 MB).
-- DİKKAT: Supabase'in ücretsiz planında proje geneli sınır 50 MB'dır ve
-- bu satır onu aşamaz. Daha büyük dosya için Pro plana geçmen ya da
-- videoyu başka bir yerde barındırıp panele URL'sini yapıştırman gerekir.
update storage.buckets
   set file_size_limit = 209715200
 where id = 'media';
