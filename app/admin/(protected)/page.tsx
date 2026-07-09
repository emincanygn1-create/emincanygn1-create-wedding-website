import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAdminLocaleAndDict } from "@/lib/i18n/admin-server";

export const dynamic = "force-dynamic";

async function getStats() {
  const supabase = await createClient();

  const [rsvpAll, rsvpYes, wishes, guestPhotos] = await Promise.all([
    supabase.from("rsvps").select("guest_count", { count: "exact" }),
    supabase.from("rsvps").select("guest_count").eq("attending", true),
    supabase.from("wishes").select("id", { count: "exact", head: true }),
    supabase.from("guest_photos").select("id", { count: "exact", head: true }),
  ]);

  const totalGuests = (rsvpYes.data ?? []).reduce(
    (sum, row) => sum + (row.guest_count ?? 0),
    0
  );

  return {
    rsvpCount: rsvpAll.count ?? 0,
    attendingCount: rsvpYes.data?.length ?? 0,
    totalGuests,
    wishCount: wishes.count ?? 0,
    photoCount: guestPhotos.count ?? 0,
  };
}

function Stat({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white border border-olive-200 rounded-2xl p-6 hover:border-olive-400 transition-colors"
    >
      <p className="font-display text-4xl text-olive-800">{value}</p>
      <p className="eyebrow mt-2 text-olive-400">{label}</p>
    </Link>
  );
}

export default async function AdminHome() {
  const [stats, { t }] = await Promise.all([getStats(), getAdminLocaleAndDict()]);

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl text-olive-800">
        {t.dashboard.welcome}
      </h1>
      <p className="mb-10 max-w-lg font-body text-sm text-olive-500">
        {t.dashboard.intro}
      </p>

      <div className="grid max-w-3xl grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label={t.dashboard.responses} value={stats.rsvpCount} href="/admin/rsvps" />
        <Stat label={t.dashboard.guests} value={stats.totalGuests} href="/admin/rsvps" />
        <Stat label={t.dashboard.wishes} value={stats.wishCount} href="/admin/wishes" />
        <Stat
          label={t.dashboard.guestPhotos}
          value={stats.photoCount}
          href="/admin/moments"
        />
      </div>
    </div>
  );
}
