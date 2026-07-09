"use client";

import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import Petals from "./Petals";
import BackgroundVideo from "./BackgroundVideo";
import RevealText from "./RevealText";
import { OrnamentCorner, OrnamentDivider } from "./Ornament";
import type { Dict } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export default function Cover({
  brideName,
  groomName,
  dateText,
  city,
  coverPhotoUrl,
  coverVideoUrl,
  eyebrow,
  gateEnabled,
  d,
  locale,
}: {
  brideName: string;
  groomName: string;
  dateText: string;
  city: string;
  coverPhotoUrl: string | null;
  coverVideoUrl: string | null;
  /** Boşsa isimlerin üstünde hiçbir yazı görünmez. */
  eyebrow: string;
  gateEnabled: boolean;
  d: Dict;
  locale: Locale;
}) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setOffset(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const fade = Math.max(0, 1 - offset / 560);
  const hasMedia = Boolean(coverVideoUrl || coverPhotoUrl);

  return (
    <section
      id="section-cover"
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden text-cream px-6 text-center"
    >
      <BackgroundVideo
        src={coverVideoUrl}
        posterUrl={coverPhotoUrl}
        playOnOpen={gateEnabled}
      />

      <div
        className={`absolute inset-0 ${
          hasMedia
            ? "bg-gradient-to-b from-olive-900/75 via-olive-800/50 to-olive-900/95"
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
        className="relative z-10"
        style={{ transform: `translateY(${offset * 0.22}px)`, opacity: fade }}
      >
        {eyebrow && (
          <RevealText
            text={eyebrow}
            as="p"
            className="eyebrow mb-6 text-gold-light"
            step={40}
            waitForGate={gateEnabled}
          />
        )}

        <h1 className="font-script text-6xl sm:text-7xl md:text-8xl leading-[1.15]">
          <RevealText text={brideName} as="span" delay={120} step={70} waitForGate={gateEnabled} />
          <span className="block text-4xl sm:text-5xl text-gold-light my-1">
            <RevealText text="&" as="span" delay={420} waitForGate={gateEnabled} />
          </span>
          <RevealText text={groomName} as="span" delay={520} step={70} waitForGate={gateEnabled} />
        </h1>

        <OrnamentDivider className="w-40 h-8 text-gold-light/70 mx-auto my-7" />

        <RevealText
          text={`${dateText}${dateText && city ? " · " : ""}${city}`}
          as="p"
          className="font-body tracking-[0.22em] text-xs sm:text-sm uppercase text-cream/90"
          delay={800}
          step={35}
          waitForGate={gateEnabled}
        />

        <div className="mt-16 flex flex-col items-center gap-2 text-cream/70">
          <span className="text-[10px] tracking-[0.3em] uppercase">{d.cover.scroll}</span>
          <span className="block w-px h-12 bg-gradient-to-b from-cream/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
