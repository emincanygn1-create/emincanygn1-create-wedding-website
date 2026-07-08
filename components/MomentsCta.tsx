import Link from "next/link";
import Reveal from "./Reveal";
import RevealText from "./RevealText";
import RevealImage from "./RevealImage";
import { OrnamentDivider } from "./Ornament";
import type { Dict } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { GuestPhoto } from "@/lib/types";

export default function MomentsCta({
  d,
  locale,
  previewPhotos,
}: {
  d: Dict;
  locale: Locale;
  previewPhotos: GuestPhoto[];
}) {
  const preview = previewPhotos.slice(0, 4);

  return (
    <section id="moments" className="py-24 px-6 bg-olive-700 text-cream scroll-mt-8">
      <Reveal>
        <p className="eyebrow text-center mb-3 text-gold-light">{d.moments.ctaEyebrow}</p>
        <RevealText
          text={d.moments.ctaTitle}
          as="h2"
          className="mb-4 text-center font-display text-4xl"
        />
        <OrnamentDivider className="w-40 h-8 text-gold-light/70 mx-auto mb-6" />
        <p className="text-center text-cream/80 font-body text-sm max-w-md mx-auto leading-relaxed mb-12">
          {d.moments.ctaText}
        </p>
      </Reveal>

      {preview.length > 0 && (
        <div className="max-w-3xl mx-auto grid grid-cols-4 gap-2 sm:gap-3 mb-12">
          {preview.map((photo, i) => (
            <RevealImage
              key={photo.id}
              src={photo.url}
              delay={i * 110}
              className="aspect-square overflow-hidden rounded-lg border border-cream/20"
            />
          ))}
        </div>
      )}

      <Reveal variant="zoom">
        <div className="text-center">
          <Link
            href={`/${locale}/moments`}
            className="inline-flex items-center gap-3 bg-cream text-olive-800 rounded-full px-8 py-4 text-sm tracking-widest uppercase hover:bg-gold-light transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="16.8" cy="7.2" r="1" fill="currentColor" />
            </svg>
            {d.moments.ctaButton}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
