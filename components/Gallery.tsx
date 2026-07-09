"use client";

import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import RevealText from "./RevealText";
import RevealImage from "./RevealImage";
import Lightbox from "./Lightbox";
import { OrnamentDivider } from "./Ornament";
import { createClient } from "@/lib/supabase/client";
import { readLiked, saveLiked, GALLERY_LIKES_KEY } from "@/lib/likes";
import type { GalleryPhoto } from "@/lib/types";
import type { Dict } from "@/lib/i18n/dictionaries";

/** Mozaik düzeni: bazı kareler büyük gelir, ızgara monoton durmaz. */
function spanClass(index: number) {
  const pattern = index % 6;
  if (pattern === 0) return "col-span-2 row-span-2";
  if (pattern === 3) return "col-span-2";
  return "";
}

export default function Gallery({
  photos: initialPhotos,
  d,
}: {
  photos: GalleryPhoto[];
  d: Dict;
}) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [liked, setLiked] = useState<string[]>([]);

  useEffect(() => setLiked(readLiked(GALLERY_LIKES_KEY)), []);

  const handleLike = async (photo: GalleryPhoto) => {
    if (liked.includes(photo.id)) return;

    const next = [...liked, photo.id];
    setLiked(next);
    saveLiked(GALLERY_LIKES_KEY, next);

    setPhotos((prev) =>
      prev.map((p) => (p.id === photo.id ? { ...p, likes: p.likes + 1 } : p))
    );

    const supabase = createClient();
    await supabase.rpc("increment_gallery_likes", { photo_id: photo.id });
  };

  return (
    <section id="gallery" className="relative px-6 py-28 scroll-mt-8">
      <Reveal>
        <p className="eyebrow mb-3 text-center">{d.gallery.eyebrow}</p>
        <RevealText
          text={d.gallery.title}
          as="h2"
          className="mb-4 text-center font-display text-4xl text-olive-800"
        />
        <OrnamentDivider className="mx-auto mb-16 h-8 w-40 text-olive-400" />
      </Reveal>

      {photos.length === 0 ? (
        <p className="text-center font-body text-sm text-olive-500">{d.gallery.empty}</p>
      ) : (
        <div className="mx-auto grid max-w-4xl auto-rows-[110px] grid-cols-4 gap-2 sm:auto-rows-[150px] sm:gap-3">
          {photos.map((photo, i) => {
            const isLiked = liked.includes(photo.id);

            return (
              <div
                key={photo.id}
                className={`group relative overflow-hidden rounded-xl border border-olive-300 bg-olive-200/70 ${spanClass(i)}`}
              >
                <button
                  onClick={() => setOpenIndex(i)}
                  aria-label={d.gallery.title}
                  className="block h-full w-full"
                >
                  <RevealImage
                    src={photo.url}
                    delay={Math.min(i, 6) * 90}
                    sizes="(max-width: 640px) 50vw, 300px"
                    className="h-full w-full"
                    imgClassName="transition-transform duration-700 group-hover:scale-110"
                  />
                  <span className="absolute inset-0 bg-olive-900/0 transition-colors group-hover:bg-olive-900/25" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(photo);
                  }}
                  disabled={isLiked}
                  aria-label={isLiked ? d.wishes.liked : d.wishes.like}
                  className={`absolute bottom-2 right-2 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs backdrop-blur transition-colors ${
                    isLiked
                      ? "bg-rust text-cream"
                      : "bg-cream/85 text-olive-700 hover:bg-cream"
                  }`}
                >
                  <span className={isLiked ? "animate-heartPop" : ""}>♥</span>
                  {photo.likes > 0 && (
                    <span className="tabular-nums">{photo.likes}</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {openIndex !== null && (
        <Lightbox
          items={photos.map((p) => ({ url: p.url }))}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onIndexChange={setOpenIndex}
        />
      )}
    </section>
  );
}
