import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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
  const stats = await getStats();

  return (
    <div>
      <h1 className="font-display text-3xl text-olive-800 mb-2">Hoş geldin 👋</h1>
      <p className="font-body text-olive-500 text-sm max-w-lg mb-10">
        Sol menüden site metinlerini (üç dilde), galeriyi, katılım cevaplarını,
        dilekleri ve misafirlerin yüklediği fotoğrafları yönetebilirsin.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl">
        <Stat label="Cevap" value={stats.rsvpCount} href="/admin/rsvps" />
        <Stat label="Gelecek Kişi" value={stats.totalGuests} href="/admin/rsvps" />
        <Stat label="Dilek" value={stats.wishCount} href="/admin/wishes" />
        <Stat label="Misafir Fotoğrafı" value={stats.photoCount} href="/admin/moments" />
      </div>
    </div>
  );
}
