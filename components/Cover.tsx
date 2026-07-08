"use client";

import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import Petals from "./Petals";
import { OrnamentCorner, OrnamentDivider } from "./Ornament";
import type { Dict } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export default function Cover({
  brideName,
  groomName,
  dateText,
  city,
  coverPhotoUrl,
  d,
  locale,
}: {
  brideName: string;
  groomName: string;
  dateText: string;
  city: string;
  coverPhotoUrl: string | null;
  d: Dict;
  locale: Locale;
}) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fade = Math.max(0, 1 - offset / 520);

  return (
    <section
      id="section-cover"
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden text-cream px-6 text-center"
    >
      <div
        className="absolute inset-0 bg-olive-700 bg-parallax animate-slowZoom"
        style={coverPhotoUrl ? { backgroundImage: `url(${coverPhotoUrl})` } : undefined}
      />
      <div
        className={`absolute inset-0 ${
          coverPhotoUrl
            ? "bg-gradient-to-b from-olive-900/75 via-olive-800/55 to-olive-900/90"
            : "bg-gradient-to-b from-olive-700 via-olive-600 to-olive-700"
        }`}
      />

      <OrnamentCorner className="absolute -top-4 -left-4 w-40 h-40 sm:w-52 sm:h-52 text-gold-light/30 rotate-180" />
      <OrnamentCorner className="absolute -bottom-4 -right-4 w-44 h-44 sm:w-60 sm:h-60 text-gold-light/30" />

      <Petals count={10} />

      <div className="absolute top-5 right-5 z-20">
        <LanguageSwitcher current={locale} tone="light" />
      </div>

      <div
        className="relative z-10 animate-fadeIn"
        style={{ transform: `translateY(${offset * 0.22}px)`, opacity: fade }}
      >
        <p className="eyebrow text-gold-light mb-6">{d.cover.theWeddingOf}</p>

        <h1 className="font-script text-6xl sm:text-7xl md:text-8xl leading-[1.15]">
          {brideName}
          <span className="block text-4xl sm:text-5xl text-gold-light my-1">&</span>
          {groomName}
        </h1>

        <OrnamentDivider className="w-40 h-8 text-gold-light/70 mx-auto my-7" />

        <p className="font-body tracking-[0.22em] text-xs sm:text-sm uppercase text-cream/90">
          {dateText}
          {dateText && city ? " · " : ""}
          {city}
        </p>

        <div className="mt-16 flex flex-col items-center gap-2 text-cream/70">
          <span className="text-[10px] tracking-[0.3em] uppercase">{d.cover.scroll}</span>
          <span className="block w-px h-12 bg-gradient-to-b from-cream/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
