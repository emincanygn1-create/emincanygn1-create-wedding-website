-- ============================================
-- ADIM 9: DİLEKLERE BEĞENİ
-- Supabase > SQL Editor'e yapıştır ve "Run".
-- ============================================

alter table wishes add column if not exists likes integer not null default 0;

create index if not exists wishes_likes_idx on wishes (likes desc, created_at desc);

-- Misafirler dilek satırını güncelleyemez; sadece bu fonksiyonu çağırır.
create or replace function increment_wish_likes(wish_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_likes integer;
begin
  update wishes
     set likes = likes + 1
   where id = wish_id and is_visible = true
  returning likes into new_likes;

  return coalesce(new_likes, 0);
end;
$$;

grant execute on function increment_wish_likes(uuid) to anon, authenticated;
