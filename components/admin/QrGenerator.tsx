"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";
import type { AdminDict } from "@/lib/i18n/admin";

type Target = "home" | "moments" | "wishes";

const PATHS: Record<Target, string> = {
  home: "",
  moments: "/moments",
  wishes: "/wishes",
};

export default function QrGenerator({ t }: { t: AdminDict }) {
  const [origin, setOrigin] = useState("");
  const [target, setTarget] = useState<Target>("moments");
  const [locale, setLocale] = useState<Locale>("tr");
  const [size, setSize] = useState(512);
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => setOrigin(window.location.origin), []);

  const url = origin ? `${origin}/${locale}${PATHS[target]}` : "";

  useEffect(() => {
    if (!url) return;

    QRCode.toDataURL(url, {
      width: size,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#3F4E32", light: "#FAF6EC" },
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(""));
  }, [url, size]);

  const download = () => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `qr-${target}-${locale}.png`;
    link.click();
  };

  const pill = (active: boolean) =>
    `rounded-full px-5 py-2 text-xs tracking-wide transition-colors ${
      active
        ? "bg-olive-700 text-cream"
        : "border border-olive-300 text-olive-600 hover:bg-olive-100"
    }`;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <p className="mb-2 font-body text-xs text-olive-500">{t.qr.target}</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setTarget("home")} className={pill(target === "home")}>
            {t.qr.home}
          </button>
          <button
            onClick={() => setTarget("moments")}
            className={pill(target === "moments")}
          >
            {t.qr.moments}
          </button>
          <button
            onClick={() => setTarget("wishes")}
            className={pill(target === "wishes")}
          >
            {t.qr.wishes}
          </button>
        </div>
      </div>

      <div>
        <p className="mb-2 font-body text-xs text-olive-500">{t.invite.language}</p>
        <div className="flex gap-2">
          {locales.map((code) => (
            <button
              key={code}
              onClick={() => setLocale(code)}
              className={pill(locale === code)}
            >
              {localeNames[code]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 font-body text-xs text-olive-500">
          {t.qr.size}: {size} px
        </p>
        <input
          type="range"
          min={256}
          max={1024}
          step={128}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="w-64"
        />
      </div>

      <div className="rounded-2xl border border-olive-200 bg-white p-6 text-center">
        {dataUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dataUrl}
              alt="QR"
              className="mx-auto h-56 w-56 rounded-lg border border-olive-200"
            />
            <p className="mt-4 break-all font-body text-xs text-olive-500">{url}</p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={download}
                className="rounded-full bg-olive-700 px-6 py-2.5 text-xs tracking-wide text-cream transition-colors hover:bg-olive-800"
              >
                {t.qr.download}
              </button>
              <button
                onClick={() => window.print()}
                className="rounded-full border border-olive-400 px-6 py-2.5 text-xs tracking-wide text-olive-700 transition-colors hover:bg-olive-100"
              >
                {t.qr.print}
              </button>
            </div>
          </>
        ) : (
          <p className="font-body text-sm text-olive-400">…</p>
        )}
      </div>
    </div>
  );
}
