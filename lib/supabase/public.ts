import { createClient } from "@supabase/supabase-js";

/**
 * Çerez okumayan, anonim Supabase istemcisi.
 *
 * `unstable_cache` içinde `cookies()` çağrılamaz — bu yüzden önbelleğe
 * alınan herkese açık okumalar bu istemciyi kullanır. RLS gereği sadece
 * `is_visible = true` satırları görür, ki zaten istediğimiz bu.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
