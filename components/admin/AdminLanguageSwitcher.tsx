"use client";

import { useRouter } from "next/navigation";
import {
  ADMIN_LOCALE_COOKIE,
  adminLocaleNames,
  adminLocales,
  type AdminLocale,
} from "@/lib/i18n/admin";

export default function AdminLanguageSwitcher({
  current,
  label,
}: {
  current: AdminLocale;
  label: string;
}) {
  const router = useRouter();

  const switchTo = (locale: AdminLocale) => {
    document.cookie = `${ADMIN_LOCALE_COOKIE}=${locale}; path=/; max-age=${
      60 * 60 * 24 * 365
    }; samesite=lax`;
    router.refresh();
  };

  return (
    <div>
      <p className="mb-2 text-[10px] uppercase tracking-widest text-cream/40">
        {label}
      </p>
      <div className="flex gap-1.5">
        {adminLocales.map((locale) => (
          <button
            key={locale}
            onClick={() => switchTo(locale)}
            className={`rounded-full px-3 py-1.5 font-body text-xs transition-colors ${
              locale === current
                ? "bg-cream text-olive-800"
                : "border border-cream/25 text-cream/70 hover:bg-olive-700"
            }`}
          >
            {adminLocaleNames[locale]}
          </button>
        ))}
      </div>
    </div>
  );
}
