import { getGalleryPhotos } from "@/lib/content";
import GalleryManager from "@/components/admin/GalleryManager";

export const dynamic = "force-dynamic";

export default async function GalleryAdminPage() {
  const photos = await getGalleryPhotos();

  return (
    <div>
      <h1 className="font-display text-3xl text-olive-800 mb-2">Fotoğraf Galerisi</h1>
      <p className="font-body text-olive-500 text-sm mb-8">
        Sitenin galeri bölümünde görünecek fotoğrafları buradan ekleyip
        silebilirsin.
      </p>
      <GalleryManager initialPhotos={photos} />
    </div>
  );
}
