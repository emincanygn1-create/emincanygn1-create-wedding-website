import QrGenerator from "@/components/admin/QrGenerator";
import { getAdminLocaleAndDict } from "@/lib/i18n/admin-server";

export const dynamic = "force-dynamic";

export default async function QrPage() {
  const { t } = await getAdminLocaleAndDict();

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl text-olive-800">{t.qr.title}</h1>
      <p className="mb-8 max-w-xl font-body text-sm text-olive-500">{t.qr.intro}</p>
      <QrGenerator t={t} />
    </div>
  );
}
