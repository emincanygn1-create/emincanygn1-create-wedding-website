import BackupPanel from "@/components/admin/BackupPanel";
import { createClient } from "@/lib/supabase/server";
import { getAdminLocaleAndDict } from "@/lib/i18n/admin-server";

export const dynamic = "force-dynamic";

const TABLES = ["rsvps", "wishes", "guest_photos", "story_posts", "faqs"];

export default async function BackupPage() {
  const [{ t }, supabase] = await Promise.all([
    getAdminLocaleAndDict(),
    createClient(),
  ]);

  const results = await Promise.all(
    TABLES.map((table) =>
      supabase.from(table).select("id", { count: "exact", head: true })
    )
  );

  const counts: Record<string, number> = {};
  TABLES.forEach((table, i) => {
    counts[table] = results[i].count ?? 0;
  });

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl text-olive-800">{t.backup.title}</h1>
      <p className="mb-8 max-w-xl font-body text-sm text-olive-500">{t.backup.intro}</p>
      <BackupPanel counts={counts} t={t} />
    </div>
  );
}
