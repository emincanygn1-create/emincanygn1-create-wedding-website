import { getGalleryPhotos } from "@/lib/content";
import GalleryManager from "@/components/admin/GalleryManager";
import { getAdminLocaleAndDict } from "@/lib/i18n/admin-server";

export const dynamic = "force-dynamic";

export default async function GalleryAdminPage() {
  const [photos, { t }] = await Promise.all([
    getGalleryPhotos(),
    getAdminLocaleAndDict(),
  ]);

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl text-olive-800">{t.gallery.title}</h1>
      <p className="mb-8 font-body text-sm text-olive-500">{t.gallery.intro}</p>
      <GalleryManager initialPhotos={photos} t={t} />
    </div>
  );
}
