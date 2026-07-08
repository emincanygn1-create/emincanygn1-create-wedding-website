-- ============================================
-- ADIM 4: İÇERİK YÖNETİMİ KURULUMU
-- Bu kodun tamamını Supabase > SQL Editor'e yapıştırıp
-- "Run" butonuna basman yeterli.
-- ============================================

-- Site içerik tablosu (tek satır, tüm metinleri tutar)
create table if not exists site_content (
  id integer primary key default 1,
  bride_name text default 'İsim Soyisim',
  groom_name text default 'İsim Soyisim',
  bride_parents text default '',
  groom_parents text default '',
  wedding_date timestamptz default '2027-06-12T16:00:00Z',
  wedding_city text default '',
  ceremony_venue text default '',
  ceremony_date_text text default '',
  ceremony_time_text text default '',
  ceremony_address text default '',
  ceremony_map_url text default '',
  reception_venue text default '',
  reception_date_text text default '',
  reception_time_text text default '',
  reception_address text default '',
  reception_map_url text default '',
  quote_text text default '',
  gift_account_name text default '',
  gift_iban text default '',
  bride_photo_url text,
  groom_photo_url text,
  video_url text,
  constraint single_row check (id = 1)
);

insert into site_content (id) values (1) on conflict (id) do nothing;

alter table site_content enable row level security;

drop policy if exists "Herkes okuyabilir" on site_content;
create policy "Herkes okuyabilir" on site_content for select using (true);

drop policy if exists "Sadece giris yapanlar guncelleyebilir" on site_content;
create policy "Sadece giris yapanlar guncelleyebilir" on site_content for update using (auth.role() = 'authenticated');

-- Fotoğraf galerisi tablosu
create table if not exists gallery_photos (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table gallery_photos enable row level security;

drop policy if exists "Herkes galeriyi okuyabilir" on gallery_photos;
create policy "Herkes galeriyi okuyabilir" on gallery_photos for select using (true);

drop policy if exists "Giris yapanlar ekleyebilir" on gallery_photos;
create policy "Giris yapanlar ekleyebilir" on gallery_photos for insert with check (auth.role() = 'authenticated');

drop policy if exists "Giris yapanlar silebilir" on gallery_photos;
create policy "Giris yapanlar silebilir" on gallery_photos for delete using (auth.role() = 'authenticated');

-- Fotoğraf / video depolama alanı (storage bucket)
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "Herkes medyayi gorebilir" on storage.objects;
create policy "Herkes medyayi gorebilir" on storage.objects for select using (bucket_id = 'media');

drop policy if exists "Giris yapanlar medya yukleyebilir" on storage.objects;
create policy "Giris yapanlar medya yukleyebilir" on storage.objects for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "Giris yapanlar medya silebilir" on storage.objects;
create policy "Giris yapanlar medya silebilir" on storage.objects for delete using (bucket_id = 'media' and auth.role() = 'authenticated');
