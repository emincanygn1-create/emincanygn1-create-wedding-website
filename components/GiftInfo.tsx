"use client";

import { useState } from "react";
import Reveal from "./Reveal";

export default function GiftInfo() {
  const [copied, setCopied] = useState(false);
  const iban = "TR00 0000 0000 0000 0000 0000 00";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(iban);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // pano erişimi yoksa sessizce geç
    }
  };

  return (
    <section className="py-24 px-6 bg-olive-100/60">
      <Reveal>
        <p className="eyebrow text-center mb-3">Sevginizle Yanımızda Olun</p>
        <h2 className="font-display text-4xl text-center text-olive-800 mb-16">
          Düğün Hediyesi
        </h2>
      </Reveal>

      <Reveal>
        <div className="max-w-md mx-auto bg-cream border border-olive-200 rounded-2xl p-8 text-center">
          <p className="font-body text-olive-600 text-sm mb-6 leading-relaxed">
            Anlayışınız ve sevginiz bizim için en büyük hediye. Yine de katkıda
            bulunmak isterseniz, aşağıdaki hesabı kullanabilirsiniz.
          </p>
          <p className="eyebrow mb-2">İsim Soyisim</p>
          <div className="flex items-center justify-center gap-3 bg-olive-50 border border-olive-200 rounded-lg px-4 py-3">
            <span className="font-body text-olive-700 text-sm tracking-wide">{iban}</span>
          </div>
          <button
            onClick={handleCopy}
            className="mt-4 border border-olive-400 text-olive-700 rounded-full px-6 py-2 text-sm tracking-wide hover:bg-olive-700 hover:text-cream transition-colors"
          >
            {copied ? "Kopyalandı ✓" : "IBAN'ı Kopyala"}
          </button>
        </div>
      </Reveal>
    </section>
  );
}
