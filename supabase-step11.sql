-- ============================================
-- ADIM 11: NİKAH VE DÜĞÜN TEK ETKİNLİK
-- Supabase > SQL Editor'e yapıştır ve "Run".
-- ============================================

-- Açıkken iki kart yerine tek kart gösterilir:
-- mekân, tarih ve adres nikah alanlarından alınır,
-- iki saat de alt alta listelenir.
alter table site_content add column if not exists single_event boolean default false;
update site_content set single_event = false where single_event is null;
