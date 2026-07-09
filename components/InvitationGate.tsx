"use client";

import { useEffect, useState } from "react";
import Petals from "./Petals";
import BackgroundVideo from "./BackgroundVideo";
import RevealText from "./RevealText";
import { OrnamentCorner, OrnamentDivider } from "./Ornament";
import LanguageSwitcher from "./LanguageSwitcher";
import type { Dict } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { GATE_EVENT, GATE_SESSION_KEY } from "@/lib/gate";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

export default function InvitationGate({
  brideName,
  groomName,
  dateText,
  guestName,
  coverPhotoUrl,
  coverVideoUrl,
  eyebrow,
  d,
  locale,
}: {
  brideName: string;
  groomName: string;
  dateText: string;
  guestName: string;
  coverPhotoUrl: string | null;
  coverVideoUrl: string | null;
  eyebrow: string;
  d: Dict;
  locale: Locale;
}) {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setMounted(true);

    const alreadyOpened =
      window.sessionStorage.getItem(GATE_SESSION_KEY) === "1";

    if (alreadyOpened) {
      setHidden(true);
      return;
    }

    setHidden(false);
    window.scrollTo(0, 0);
    lockScroll();

    return () => unlockScroll(false);
  }, []);

  const handleOpen = () => {
    setClosing(true);
    window.sessionStorage.setItem(GATE_SESSION_KEY, "1");
    unlockScroll(false);
    window.dispatchEvent(new CustomEvent(GATE_EVENT));
    setTimeout(() => setHidden(true), 1100);
  };

  if (!mounted || hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[90] overflow-hidden ${
        closing ? "animate-curtainUp" : ""
      }`}
    >
      <BackgroundVideo src={coverVideoUrl} posterUrl={coverPhotoUrl} />
      <div className="absolute inset-0 bg-gradient-to-b from-olive-900/85 via-olive-800/70 to-olive-900/90" />

      <OrnamentCorner className="absolute -top-6 -left-6 w-44 h-44 text-gold-light/40 rotate-180" />
      <OrnamentCorner className="absolute -bottom-6 -right-6 w-52 h-52 text-gold-light/40" />

      <Petals count={12} />

      <div className="absolute top-5 right-5 z-10">
        <LanguageSwitcher current={locale} tone="light" />
      </div>

      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-cream">
        {eyebrow && (
          <p className="eyebrow mb-6 animate-fadeIn text-gold-light">{eyebrow}</p>
        )}

        <h1 className="font-script text-6xl sm:text-7xl md:text-8xl leading-tight text-cream">
          <RevealText text={brideName} as="span" delay={150} step={70} />
          <span className="block text-4xl sm:text-5xl text-gold-light my-2">
            <RevealText text="&" as="span" delay={450} />
          </span>
          <RevealText text={groomName} as="span" delay={550} step={70} />
        </h1>

        <OrnamentDivider className="w-44 h-8 text-gold-light/70 my-7 animate-fadeIn" />

        <p className="font-body tracking-[0.2em] text-sm uppercase text-cream/90 mb-12 animate-fadeIn">
          {dateText}
        </p>

        <div className="animate-fadeIn">
          <p className="eyebrow text-cream/60 mb-2">{d.cover.dear}</p>
          <p className="font-display text-2xl text-cream mb-1">
            {guestName || d.cover.guest}
          </p>
          <p className="font-body text-[11px] text-cream/50 max-w-xs mx-auto leading-relaxed">
            {d.cover.nameNote}
          </p>
        </div>

        <button
          onClick={handleOpen}
          className="mt-10 group inline-flex items-center gap-3 rounded-full border border-gold bg-gold/10 px-9 py-4 text-xs tracking-[0.25em] uppercase text-cream backdrop-blur transition-colors hover:bg-gold hover:text-olive-900 animate-floatSoft"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.4" />
            <path
              d="m3.6 7 8.4 6 8.4-6"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
          {d.cover.open}
        </button>
      </div>
    </div>
  );
}
