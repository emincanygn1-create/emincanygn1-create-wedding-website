"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import RevealText from "./RevealText";
import RevealImage from "./RevealImage";
import Lightbox from "./Lightbox";
import { OrnamentDivider } from "./Ornament";
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
  photos,
  d,
}: {
  photos: GalleryPhoto[];
  d: Dict;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="gallery" className="relative py-28 px-6 bg-olive-100/60 scroll-mt-8">
      <Reveal>
        <p className="eyebrow text-center mb-3">{d.gallery.eyebrow}</p>
        <RevealText
          text={d.gallery.title}
          as="h2"
          className="mb-4 text-center font-display text-4xl text-olive-800"
        />
        <OrnamentDivider className="w-40 h-8 text-olive-400 mx-auto mb-16" />
      </Reveal>

      {photos.length === 0 ? (
        <p className="text-center text-olive-500 font-body text-sm">{d.gallery.empty}</p>
      ) : (
        <div className="grid grid-cols-4 auto-rows-[110px] sm:auto-rows-[150px] gap-2 sm:gap-3 max-w-4xl mx-auto">
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              onClick={() => setOpenIndex(i)}
              className={`group relative block h-full w-full overflow-hidden rounded-xl border border-olive-300 bg-olive-200/70 ${spanClass(i)}`}
            >
              <RevealImage
                src={photo.url}
                delay={Math.min(i, 6) * 90}
                className="h-full w-full"
                imgClassName="transition-transform duration-700 group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-olive-900/0 transition-colors group-hover:bg-olive-900/25" />
            </button>
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
