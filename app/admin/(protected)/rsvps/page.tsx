import { getRsvps } from "@/lib/content";
import RsvpTable from "@/components/admin/RsvpTable";
import { getAdminLocaleAndDict } from "@/lib/i18n/admin-server";

export const dynamic = "force-dynamic";

export default async function RsvpAdminPage() {
  const [rsvps, { t }] = await Promise.all([getRsvps(), getAdminLocaleAndDict()]);

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl text-olive-800">{t.rsvps.title}</h1>
      <p className="mb-8 font-body text-sm text-olive-500">{t.rsvps.intro}</p>
      <RsvpTable initialRsvps={rsvps} t={t} />
    </div>
  );
}
