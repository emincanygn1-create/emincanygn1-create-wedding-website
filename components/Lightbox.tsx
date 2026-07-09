"use client";

import Image from "next/image";
import { useEffect, useCallback, useRef } from "react";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

export type LightboxItem = {
  url: string;
  caption?: string;
  author?: string;
};

export default function Lightbox({
  items,
  index,
  onClose,
  onIndexChange,
  closeLabel = "Kapat",
}: {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onIndexChange: (next: number) => void;
  closeLabel?: string;
}) {
  const go = useCallback(
    (step: number) => {
      const next = (index + step + items.length) % items.length;
      onIndexChange(next);
    },
    [index, items.length, onIndexChange]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    lockScroll();
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [go, onClose]);

  const touchStartX = useRef(0);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
  };

  const item = items[index];
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-olive-900/95 p-4"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button
        onClick={onClose}
        aria-label={closeLabel}
        className="absolute top-5 right-5 text-cream/80 hover:text-cream text-3xl leading-none"
      >
        ×
      </button>

      {items.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="←"
            className="absolute left-3 sm:left-8 text-cream/70 hover:text-cream text-4xl px-3"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="→"
            className="absolute right-3 sm:right-8 text-cream/70 hover:text-cream text-4xl px-3"
          >
            ›
          </button>
        </>
      )}

      <figure
        className="max-w-4xl w-full animate-lightboxIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ham dosya yerine optimize edilmiş görsel: düğün gecesi
            yüzlerce misafir aynı fotoğrafa tıklayınca bant genişliği yanmasın. */}
        <div className="relative h-[70svh] w-full">
          <Image
            src={item.url}
            alt={item.caption || ""}
            fill
            sizes="100vw"
            quality={80}
            className="rounded-xl object-contain"
          />
        </div>
        {(item.caption || item.author) && (
          <figcaption className="mt-4 text-center">
            {item.caption && (
              <p className="font-body text-cream/90 text-sm">{item.caption}</p>
            )}
            {item.author && (
              <p className="eyebrow mt-2 text-gold-light">{item.author}</p>
            )}
          </figcaption>
        )}
      </figure>
    </div>
  );
}
