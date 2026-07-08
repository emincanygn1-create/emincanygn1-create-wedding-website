-- ============================================
-- ADIM 8: RSVP AÇMA / KAPATMA
-- Supabase > SQL Editor'e yapıştır ve "Run".
-- ============================================

alter table site_content add column if not exists rsvp_enabled boolean default true;
alter table site_content add column if not exists rsvp_deadline timestamptz;

alter table site_content add column if not exists rsvp_closed_message text default '';
alter table site_content add column if not exists rsvp_closed_message_en text default '';
alter table site_content add column if not exists rsvp_closed_message_it text default '';

update site_content set rsvp_enabled = true where rsvp_enabled is null;

-- Form kapalıyken sunucu tarafında da yeni cevap kabul edilmesin.
-- (Arayüzü gizlemek yeterli değil; RLS kuralı da bunu bilmeli.)
drop policy if exists "Herkes rsvp gonderebilir" on rsvps;
create policy "Herkes rsvp gonderebilir" on rsvps
  for insert with check (
    char_length(name) between 1 and 80
    and char_length(coalesce(message, '')) <= 1000
    and guest_count between 1 and 20
    and exists (
      select 1 from site_content
       where id = 1
         and coalesce(rsvp_enabled, true) = true
         and (rsvp_deadline is null or now() < rsvp_deadline)
    )
  );
