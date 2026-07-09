-- ============================================
-- ADIM 10: BAŞLIK, KAPI ANAHTARI, BÖLÜM SIRASI,
--          GALERİ BEĞENİSİ, DÜZENLENEBİLİR KAPANIŞ
-- Supabase > SQL Editor'e yapıştır ve "Run".
-- ============================================

-- --- Tarayıcı sekmesinde ve link önizlemesinde görünen başlık
alter table site_content add column if not exists site_title text default '';
alter table site_content add column if not exists site_title_en text default '';
alter table site_content add column if not exists site_title_it text default '';

alter table site_content add column if not exists site_description text default '';
alter table site_content add column if not exists site_description_en text default '';
alter table site_content add column if not exists site_description_it text default '';

-- --- Kapakta isimlerin üstündeki küçük yazı ("Düğün Davetiyesi" vb.)
-- Boş bırakılırsa hiç gösterilmez.
alter table site_content add column if not exists cover_eyebrow text default '';
alter table site_content add column if not exists cover_eyebrow_en text default '';
alter table site_content add column if not exists cover_eyebrow_it text default '';

-- --- Kapanış bölümünün başlıkları
alter table site_content add column if not exists closing_eyebrow text default '';
alter table site_content add column if not exists closing_eyebrow_en text default '';
alter table site_content add column if not exists closing_eyebrow_it text default '';

alter table site_content add column if not exists closing_title text default '';
alter table site_content add column if not exists closing_title_en text default '';
alter table site_content add column if not exists closing_title_it text default '';

alter table site_content add column if not exists closing_seeyou text default '';
alter table site_content add column if not exists closing_seeyou_en text default '';
alter table site_content add column if not exists closing_seeyou_it text default '';

-- --- Davetiye kapısı ("Davetiyeyi Aç" ekranı) açık mı?
-- Varsayılan kapalı: düğüne yaklaşınca panelden açarsın.
alter table site_content add column if not exists gate_enabled boolean default false;
update site_content set gate_enabled = false where gate_enabled is null;

-- --- Bölümlerin sırası ve görünürlüğü
alter table site_content add column if not exists section_config jsonb;

-- --- Galeri fotoğraflarına beğeni
alter table gallery_photos add column if not exists likes integer not null default 0;

create or replace function increment_gallery_likes(photo_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_likes integer;
begin
  update gallery_photos
     set likes = likes + 1
   where id = photo_id
  returning likes into new_likes;

  return coalesce(new_likes, 0);
end;
$$;

grant execute on function increment_gallery_likes(uuid) to anon, authenticated;
