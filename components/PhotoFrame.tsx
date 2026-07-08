import RevealImage from "./RevealImage";

/**
 * Gelin / damat fotoğrafı için çerçeve.
 *
 * Fotoğraf çerçevenin içinde, 12 px'lik bir iç boşlukla durur —
 * hiçbir hat fotoğrafın üzerine binmez. Köşe işaretleri çerçevenin
 * dış kenarına oturur.
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
    <div className="frame-outer relative w-52 sm:w-64">
      <div className="frame-inner relative h-64 bg-olive-100 sm:h-80">
        {src ? (
          <RevealImage
            src={src}
            alt={alt}
            delay={delay}
            parallax
            strength={16}
            className="h-full w-full"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-body text-sm text-olive-400">{placeholder}</span>
          </div>
        )}
      </div>

      {/* çerçevenin dış köşelerinde ince altın işaretler */}
      <span className="frame-corner -left-px -top-px border-l border-t rounded-tl-[32px]" />
      <span className="frame-corner -right-px -top-px border-r border-t rounded-tr-[32px]" />
      <span className="frame-corner -bottom-px -left-px border-b border-l rounded-bl-[32px]" />
      <span className="frame-corner -bottom-px -right-px border-b border-r rounded-br-[32px]" />
    </div>
  );
}
