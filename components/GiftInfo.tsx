"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import RevealText from "./RevealText";
import { OrnamentDivider } from "./Ornament";
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
  const [revealed, setRevealed] = useState(false);

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
    <section id="gift" className="relative px-6 py-28 scroll-mt-8">
      <Reveal>
        <p className="eyebrow text-center mb-3">{d.gift.eyebrow}</p>
        <RevealText
          text={d.gift.title}
          as="h2"
          className="mb-4 text-center font-display text-4xl text-olive-800"
        />
        <OrnamentDivider className="w-40 h-8 text-olive-400 mx-auto mb-14" />
      </Reveal>

      <Reveal variant="zoom">
        <div className="mx-auto max-w-md rounded-2xl border border-olive-200 bg-white p-8 text-center shadow-sm">
          <p className="font-body text-olive-600 text-sm mb-8 leading-relaxed">
            {d.gift.text}
          </p>

          <button
            onClick={() => setRevealed((v) => !v)}
            className="inline-flex items-center gap-2 border border-olive-400 text-olive-700 rounded-full px-6 py-2.5 text-xs tracking-widest uppercase hover:bg-olive-700 hover:text-cream transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="7" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 11h18M7 15h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {revealed ? d.gift.hide : d.gift.reveal}
          </button>

          <div
            className={`grid transition-all duration-500 ${
              revealed ? "grid-rows-[1fr] opacity-100 mt-7" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              {accountName && <p className="eyebrow mb-3">{accountName}</p>}
              <div className="flex items-center justify-center gap-3 bg-olive-50 border border-olive-200 rounded-lg px-4 py-3">
                <span className="font-body text-olive-700 text-sm tracking-wide break-all">
                  {iban}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="mt-4 bg-olive-700 text-cream rounded-full px-6 py-2.5 text-xs tracking-widest uppercase hover:bg-olive-800 transition-colors"
              >
                {copied ? d.gift.copied : d.gift.copy}
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
