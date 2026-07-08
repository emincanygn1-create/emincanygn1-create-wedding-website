"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { locales, localeNames, localeShort, type Locale } from "@/lib/i18n/config";

export default function LanguageSwitcher({
  current,
  tone = "light",
}: {
  current: Locale;
  /** "light" = koyu zemin üstünde, "dark" = açık zemin üstünde */
  tone?: "light" | "dark";
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const switchTo = (locale: Locale) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;

    const segments = pathname.split("/");
    segments[1] = locale;
    const next = segments.join("/") || `/${locale}`;

    setOpen(false);
    router.push(next);
    router.refresh();
  };

  const triggerClass =
    tone === "light"
      ? "border-cream/40 text-cream hover:bg-cream/10"
      : "border-olive-300 text-olive-700 hover:bg-olive-100";

  return (
    <div ref={boxRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Language"
        className={`flex items-center gap-2 border rounded-full px-4 py-2 text-xs tracking-widest uppercase transition-colors ${triggerClass}`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        {localeShort[current]}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl border border-olive-200 bg-cream shadow-lg overflow-hidden z-50">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => switchTo(locale)}
              className={`w-full text-left px-4 py-3 text-sm font-body transition-colors ${
                locale === current
                  ? "bg-olive-100 text-olive-800"
                  : "text-olive-600 hover:bg-olive-50"
              }`}
            >
              {localeNames[locale]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
