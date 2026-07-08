import Reveal from "./Reveal";
import type { GalleryPhoto } from "@/lib/types";

export default function Gallery({ photos }: { photos: GalleryPhoto[] }) {
  return (
    <section className="py-24 px-6 bg-olive-100/60">
      <Reveal>
        <p className="eyebrow text-center mb-3">Anılarımız</p>
        <h2 className="font-display text-4xl text-center text-olive-800 mb-16">
          Fotoğraf Galerisi
        </h2>
      </Reveal>

      {photos.length === 0 ? (
        <p className="text-center text-olive-500 font-body text-sm">
          Fotoğraflar yakında eklenecek.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {photos.map((photo, i) => (
            <Reveal key={photo.id} delay={i * 80}>
              <div className="aspect-square rounded-xl overflow-hidden bg-olive-200/70 border border-olive-300 hover:scale-[1.02] transition-transform">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt="" className="w-full h-full object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
