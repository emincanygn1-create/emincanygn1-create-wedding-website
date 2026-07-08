import RevealImage from "./RevealImage";

/**
 * Gelin / damat fotoğrafı için çerçeve.
 * Yumuşak köşeli dikdörtgen, arkasında kaydırılmış altın hat,
 * köşelerinde ince kesikler. Kemer (mezar taşı) formu kullanılmaz.
 */
export default function PhotoFrame({
  src,
  alt,
  placeholder,
  delay = 0,
}: {
  src: string | null;
  alt: string;
  placeholder: string;
  delay?: number;
}) {
  return (
    <div className="relative">
      {/* arkada kaydırılmış altın çerçeve */}
      <div className="frame-outline absolute -left-3 -top-3 h-full w-full" />

      <div className="frame-photo relative h-64 w-48 overflow-hidden border border-olive-200 bg-olive-100 sm:h-80 sm:w-60">
        {src ? (
          <RevealImage
            src={src}
            alt={alt}
            delay={delay}
            parallax
            strength={18}
            className="h-full w-full"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-body text-sm text-olive-400">{placeholder}</span>
          </div>
        )}

        <span className="frame-inline pointer-events-none absolute inset-2" />
      </div>

      {/* köşe kesikleri */}
      <span className="pointer-events-none absolute -left-3 -top-3 h-5 w-5 border-l border-t border-gold" />
      <span className="pointer-events-none absolute -bottom-1 -right-1 h-5 w-5 border-b border-r border-gold" />
    </div>
  );
}
