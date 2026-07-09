import { getGuestPhotos } from "@/lib/content";
import MomentsManager from "@/components/admin/MomentsManager";
import { getAdminLocaleAndDict } from "@/lib/i18n/admin-server";

export const dynamic = "force-dynamic";

export default async function MomentsAdminPage() {
  const [photos, { t }] = await Promise.all([
    getGuestPhotos(),
    getAdminLocaleAndDict(),
  ]);

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl text-olive-800">{t.moments.title}</h1>
      <p className="mb-8 font-body text-sm text-olive-500">{t.moments.intro}</p>
      <MomentsManager initialPhotos={photos} t={t} />
    </div>
  );
}
