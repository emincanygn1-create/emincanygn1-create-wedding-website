"use client";

import { useEffect, useCallback, useRef } from "react";

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
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
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
      className="fixed inset-0 z-[70] bg-olive-900/95 flex items-center justify-center p-4"
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.url}
          alt={item.caption || ""}
          className="w-full max-h-[78vh] object-contain rounded-xl"
        />
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
