import RevealImage from "./RevealImage";
import RevealText from "./RevealText";
import Reveal from "./Reveal";

/** Zaman çizgisinin bir durağı. Tek sayılı olanlarda fotoğraf sağa geçer. */
export default function StoryEntry({
  dateText,
  title,
  body,
  photoUrl,
  index,
  full = false,
}: {
  dateText: string;
  title: string;
  body: string;
  photoUrl: string | null;
  index: number;
  /** Ayrı sayfada metnin tamamı gösterilir. */
  full?: boolean;
}) {
  const flipped = index % 2 === 1;

  return (
    <div className="relative">
      {/* ortadaki ince çizgi ve düğüm — sadece geniş ekranda */}
      <span className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-olive-200 md:block" />
      <span className="pointer-events-none absolute left-1/2 top-14 hidden h-3 w-3 -translate-x-1/2 rounded-full border border-gold bg-cream md:block" />

      <div
        className={`flex flex-col items-center gap-10 py-10 md:flex-row md:gap-16 ${
          flipped ? "md:flex-row-reverse" : ""
        }`}
      >
        <div className="w-full md:w-1/2">
          {photoUrl ? (
            <RevealImage
              src={photoUrl}
              alt={title}
              parallax
              strength={14}
              sizes="(max-width: 768px) 100vw, 460px"
              className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-olive-200"
            />
          ) : (
            <div className="aspect-[4/3] w-full rounded-2xl border border-dashed border-olive-200 bg-olive-100/50" />
          )}
        </div>

        <div
          className={`w-full md:w-1/2 ${
            flipped ? "md:pr-12 md:text-right" : "md:pl-12"
          }`}
        >
          <Reveal variant={flipped ? "right" : "left"}>
            {dateText && <p className="eyebrow mb-3">{dateText}</p>}
          </Reveal>

          <RevealText
            text={title}
            as="h3"
            className="mb-5 font-script text-4xl leading-tight text-olive-800"
            step={60}
          />

          <Reveal variant={flipped ? "right" : "left"} delay={120}>
            <p
              className={`whitespace-pre-line font-body text-sm leading-relaxed text-olive-600 ${
                full ? "" : "line-clamp-5"
              }`}
            >
              {body}
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
