"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import Lightbox from "./Lightbox";
import type { GalleryPhoto } from "@/lib/types";
import type { Dict } from "@/lib/i18n/dictionaries";

export default function Gallery({
  photos,
  d,
}: {
  photos: GalleryPhoto[];
  d: Dict;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="gallery" className="py-24 px-6 bg-olive-100/60 scroll-mt-8">
      <Reveal>
        <p className="eyebrow text-center mb-3">{d.gallery.eyebrow}</p>
        <h2 className="font-display text-4xl text-center text-olive-800 mb-16">
          {d.gallery.title}
        </h2>
      </Reveal>

      {photos.length === 0 ? (
        <p className="text-center text-olive-500 font-body text-sm">
          {d.gallery.empty}
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {photos.map((photo, i) => (
            <Reveal key={photo.id} variant="zoom" delay={i * 70}>
              <button
                onClick={() => setOpenIndex(i)}
                className="block w-full aspect-square rounded-xl overflow-hidden bg-olive-200/70 border border-olive-300 hover:scale-[1.02] transition-transform"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </button>
            </Reveal>
          ))}
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
