"use client";

import { useEffect, useState } from "react";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";
import type { AdminDict } from "@/lib/i18n/admin";

export default function InviteLinkBuilder({
  brideName,
  groomName,
  t,
}: {
  brideName: string;
  groomName: string;
  t: AdminDict;
}) {
  const [origin, setOrigin] = useState("");
  const [guestName, setGuestName] = useState("");
  const [locale, setLocale] = useState<Locale>("tr");
  const [copied, setCopied] = useState(false);

  useEffect(() => setOrigin(window.location.origin), []);

  const link =
    origin +
    `/${locale}` +
    (guestName.trim() ? `?to=${encodeURIComponent(guestName.trim())}` : "");

  const greeting: Record<Locale, string> = {
    tr: `Sayın ${guestName.trim() || "..."},\n\n${brideName} & ${groomName} çiftinin düğün davetiyesini sizin için hazırladık. Aşağıdaki bağlantıdan açabilirsiniz:`,
    en: `Dear ${guestName.trim() || "..."},\n\nWe would be honoured by your presence at the wedding of ${brideName} & ${groomName}. You can open the invitation here:`,
    it: `Gentile ${guestName.trim() || "..."},\n\nSaremmo onorati della vostra presenza al matrimonio di ${brideName} & ${groomName}. Potete aprire l'invito qui:`,
  };

  const message = `${greeting[locale]}\n${link}`;

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // pano erişimi yoksa sessizce geç
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <label className="mb-1 block font-body text-xs text-olive-500">
          {t.invite.guestName}
        </label>
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Ahmet Bey ve Ailesi"
          maxLength={60}
          className="w-full rounded-lg border border-olive-200 px-4 py-2 font-body text-sm"
        />
      </div>

      <div>
        <label className="mb-2 block font-body text-xs text-olive-500">
          {t.invite.language}
        </label>
        <div className="flex gap-2">
          {locales.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLocale(code)}
              className={`rounded-full px-5 py-2 text-xs tracking-wide transition-colors ${
                locale === code
                  ? "bg-olive-700 text-cream"
                  : "border border-olive-300 text-olive-600 hover:bg-olive-100"
              }`}
            >
              {localeNames[code]}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-olive-200 bg-white p-5">
        <p className="eyebrow mb-3 text-olive-400">{t.invite.link}</p>
        <p className="break-all font-body text-sm text-olive-700">{link}</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => copy(link)}
            className="rounded-full bg-olive-700 px-5 py-2 text-xs tracking-wide text-cream transition-colors hover:bg-olive-800"
          >
            {copied ? t.common.copied : t.invite.copyLink}
          </button>

          <button
            onClick={() => copy(message)}
            className="rounded-full border border-olive-400 px-5 py-2 text-xs tracking-wide text-olive-700 transition-colors hover:bg-olive-100"
          >
            {t.invite.copyMessage}
          </button>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-olive-400 px-5 py-2 text-xs tracking-wide text-olive-700 transition-colors hover:bg-olive-100"
          >
            {t.invite.whatsapp}
          </a>
        </div>
      </div>

      <div className="rounded-xl border border-olive-200 bg-olive-50 p-5">
        <p className="eyebrow mb-3 text-olive-400">{t.invite.preview}</p>
        <p className="whitespace-pre-line font-body text-sm leading-relaxed text-olive-700">
          {message}
        </p>
      </div>
    </div>
  );
}
