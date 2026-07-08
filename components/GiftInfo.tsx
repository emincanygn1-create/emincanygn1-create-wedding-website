"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import type { Dict } from "@/lib/i18n/dictionaries";

export default function GiftInfo({
  accountName,
  iban,
  d,
}: {
  accountName: string;
  iban: string;
  d: Dict;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(iban);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // pano erişimi yoksa sessizce geç
    }
  };

  if (!iban) return null;

  return (
    <section id="gift" className="py-24 px-6 bg-olive-100/60 scroll-mt-8">
      <Reveal>
        <p className="eyebrow text-center mb-3">{d.gift.eyebrow}</p>
        <h2 className="font-display text-4xl text-center text-olive-800 mb-16">
          {d.gift.title}
        </h2>
      </Reveal>

      <Reveal variant="zoom">
        <div className="max-w-md mx-auto bg-cream border border-olive-200 rounded-2xl p-8 text-center">
          <p className="font-body text-olive-600 text-sm mb-6 leading-relaxed">
            {d.gift.text}
          </p>
          {accountName && <p className="eyebrow mb-2">{accountName}</p>}
          <div className="flex items-center justify-center gap-3 bg-olive-50 border border-olive-200 rounded-lg px-4 py-3">
            <span className="font-body text-olive-700 text-sm tracking-wide">{iban}</span>
          </div>
          <button
            onClick={handleCopy}
            className="mt-4 border border-olive-400 text-olive-700 rounded-full px-6 py-2 text-sm tracking-wide hover:bg-olive-700 hover:text-cream transition-colors"
          >
            {copied ? d.gift.copied : d.gift.copy}
          </button>
        </div>
      </Reveal>
    </section>
  );
}
