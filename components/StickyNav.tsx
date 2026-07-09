"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Dict } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

const ICONS: Record<string, React.ReactNode> = {
  couple: (
    <path
      d="M12 20s-7-4.5-7-9.5A4 4 0 0 1 12 8a4 4 0 0 1 7 2.5C19 15.5 12 20 12 20Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  ),
  event: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 10h16M9 3v4M15 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  gallery: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <path d="m5 17 4.5-4.5L13 16l2.5-2.5L19 17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </>
  ),
  rsvp: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m3.5 7.5 8.5 6 8.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </>
  ),
  wishes: (
    <path
      d="M20 12a7 7 0 0 1-7 7H8l-4 2 1.2-3.4A7 7 0 0 1 11 5h2a7 7 0 0 1 7 7Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  ),
  moments: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16.8" cy="7.2" r="1" fill="currentColor" />
    </>
  ),
};

export default function StickyNav({
  d,
  locale,
}: {
  d: Dict;
  locale: Locale;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
    { key: "couple", label: d.nav.couple, href: "#couple" },
    { key: "event", label: d.nav.event, href: "#event" },
    { key: "gallery", label: d.nav.gallery, href: "#gallery" },
    { key: "rsvp", label: d.nav.rsvp, href: "#rsvp" },
  ];

  return (
    <nav
      className={`sticky-nav safe-offset-bottom fixed left-1/2 z-40 -translate-x-1/2 transition-all duration-500 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-1 rounded-full border border-olive-300/60 bg-cream/90 px-2 py-2 shadow-lg">
        {items.map((item) => (
          <a
            key={item.key}
            href={item.href}
            aria-label={item.label}
            className="group flex flex-col items-center rounded-full px-3 py-1.5 text-olive-600 hover:text-olive-800 hover:bg-olive-100 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              {ICONS[item.key]}
            </svg>
            <span className="text-[9px] tracking-wider uppercase mt-0.5 hidden sm:block">
              {item.label}
            </span>
          </a>
        ))}

        <span className="w-px h-8 bg-olive-200 mx-1" />

        <Link
          href={`/${locale}/wishes`}
          aria-label={d.nav.wishes}
          className="flex flex-col items-center rounded-full px-3 py-1.5 text-olive-600 hover:text-olive-800 hover:bg-olive-100 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            {ICONS.wishes}
          </svg>
          <span className="text-[9px] tracking-wider uppercase mt-0.5 hidden sm:block">
            {d.nav.wishes}
          </span>
        </Link>

        <Link
          href={`/${locale}/moments`}
          aria-label={d.nav.moments}
          className="flex flex-col items-center rounded-full px-3 py-1.5 text-gold-dark hover:text-olive-800 hover:bg-olive-100 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            {ICONS.moments}
          </svg>
          <span className="text-[9px] tracking-wider uppercase mt-0.5 hidden sm:block">
            {d.nav.moments}
          </span>
        </Link>
      </div>
    </nav>
  );
}
