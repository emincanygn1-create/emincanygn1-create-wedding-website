import { getGuestPhotos } from "@/lib/content";
import MomentsManager from "@/components/admin/MomentsManager";

export const dynamic = "force-dynamic";

export default async function MomentsAdminPage() {
  const photos = await getGuestPhotos();

  return (
    <div>
      <h1 className="font-display text-3xl text-olive-800 mb-2">
        Misafir Fotoğrafları
      </h1>
      <p className="font-body text-olive-500 text-sm mb-8">
        Misafirlerin &quot;Anı Duvarı&quot; sayfasına yüklediği fotoğraflar. İstemediğin
        bir kareyi gizleyebilir veya silebilirsin.
      </p>
      <MomentsManager initialPhotos={photos} />
    </div>
  );
}
