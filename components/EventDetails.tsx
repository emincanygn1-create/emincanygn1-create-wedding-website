import Reveal from "./Reveal";
import RevealText from "./RevealText";
import RevealImage from "./RevealImage";
import { OrnamentDivider } from "./Ornament";
import type { Dict } from "@/lib/i18n/dictionaries";

export type EventInfo = {
  venue: string;
  dateText: string;
  timeText: string;
  address: string;
  mapUrl: string;
  photoUrl?: string | null;
};

function MapButton({ url, label }: { url: string; label: string }) {
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="press inline-flex items-center gap-2 rounded-full border border-olive-400 px-6 py-2.5 text-xs uppercase tracking-widest text-olive-700 transition-colors hover:bg-olive-700 hover:text-cream"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      {label}
    </a>
  );
}

function CardShell({
  children,
  photoUrl,
  wide = false,
}: {
  children: React.ReactNode;
  photoUrl?: string | null;
  wide?: boolean;
}) {
  return (
    <div
      className={`group relative w-full overflow-hidden rounded-2xl border border-olive-200 bg-cream shadow-sm transition-transform duration-500 hover:-translate-y-1.5 ${
        wide ? "max-w-xl" : "max-w-sm"
      }`}
    >
      {photoUrl && (
        <RevealImage
          src={photoUrl}
          className={wide ? "h-56 w-full" : "h-44 w-full"}
          imgClassName="transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, 480px"
          parallax
          strength={14}
        />
      )}
      <div className="p-8 text-center sm:p-10">{children}</div>
    </div>
  );
}

/** Nikah ve düğün ayrı ayrı. */
function EventCard({
  title,
  info,
  mapLabel,
}: {
  title: string;
  info: EventInfo;
  mapLabel: string;
}) {
  return (
    <CardShell photoUrl={info.photoUrl}>
      <p className="eyebrow mb-3">{title}</p>
      <RevealText
        text={info.venue}
        as="h3"
        className="mb-5 font-script text-3xl leading-tight text-olive-800"
        step={60}
      />
      <OrnamentDivider className="mx-auto mb-6 h-6 w-28 text-olive-300" />

      <div className="mb-8 space-y-1.5 font-body text-sm text-olive-600">
        <p className="text-olive-800">{info.dateText}</p>
        <p>{info.timeText}</p>
        <p className="pt-2 text-xs leading-relaxed text-olive-500">{info.address}</p>
      </div>

      <MapButton url={info.mapUrl} label={mapLabel} />
    </CardShell>
  );
}

/** Nikah ve düğün aynı yerde: tek kart, iki saat. */
function CombinedCard({
  ceremony,
  reception,
  d,
}: {
  ceremony: EventInfo;
  reception: EventInfo;
  d: Dict;
}) {
  // Hangi alan doluysa o kullanılır. Bilgileri sadece nikah
  // alanlarına yazmış olabilirsin, sadece düğün alanlarına da.
  const pick = (a: string, b: string) => (a.trim() ? a : b);

  const venue = pick(ceremony.venue, reception.venue);
  const dateText = pick(ceremony.dateText, reception.dateText);
  const address = pick(ceremony.address, reception.address);
  const mapUrl = pick(ceremony.mapUrl, reception.mapUrl);
  const photoUrl = ceremony.photoUrl || reception.photoUrl || null;

  const schedule = [
    { label: d.events.ceremony, time: ceremony.timeText },
    { label: d.events.reception, time: reception.timeText },
  ].filter((row) => row.time.trim());

  return (
    <CardShell photoUrl={photoUrl} wide>
      <p className="eyebrow mb-3">{d.events.combined}</p>
      {venue && (
        <RevealText
          text={venue}
          as="h3"
          className="mb-5 font-script text-4xl leading-tight text-olive-800"
          step={60}
        />
      )}
      <OrnamentDivider className="mx-auto mb-7 h-6 w-32 text-olive-300" />

      {dateText && (
        <p className="mb-6 font-body text-sm text-olive-800">{dateText}</p>
      )}

      {schedule.length > 0 && (
        <div className="mx-auto mb-7 max-w-xs">
          {schedule.map((row, i) => (
            <div
              key={row.label}
              className={`flex items-center justify-between gap-6 py-3 font-body text-sm ${
                i > 0 ? "border-t border-olive-100" : ""
              }`}
            >
              <span className="text-olive-500">{row.label}</span>
              <span className="font-display text-lg text-olive-800 tabular-nums">
                {row.time}
              </span>
            </div>
          ))}
        </div>
      )}

      {address && (
        <p className="mb-8 font-body text-xs leading-relaxed text-olive-500">
          {address}
        </p>
      )}

      <MapButton url={mapUrl} label={d.events.map} />
    </CardShell>
  );
}

export default function EventDetails({
  ceremony,
  reception,
  singleEvent = false,
  d,
}: {
  ceremony: EventInfo;
  reception: EventInfo;
  singleEvent?: boolean;
  d: Dict;
}) {
  return (
    <section id="event" className="relative bg-cream px-6 py-28 scroll-mt-8">
      <Reveal>
        <p className="eyebrow mb-3 text-center">{d.events.eyebrow}</p>
        <RevealText
          text={d.events.title}
          as="h2"
          className="mb-4 text-center font-display text-4xl text-olive-800"
        />
        <OrnamentDivider className="mx-auto mb-16 h-8 w-40 text-olive-400" />
      </Reveal>

      {singleEvent ? (
        <Reveal variant="zoom" className="flex justify-center">
          <CombinedCard ceremony={ceremony} reception={reception} d={d} />
        </Reveal>
      ) : (
        <div className="flex flex-col items-stretch justify-center gap-8 md:flex-row">
          <Reveal variant="left" className="flex justify-center">
            <EventCard title={d.events.ceremony} info={ceremony} mapLabel={d.events.map} />
          </Reveal>
          <Reveal variant="right" delay={150} className="flex justify-center">
            <EventCard
              title={d.events.reception}
              info={reception}
              mapLabel={d.events.map}
            />
          </Reveal>
        </div>
      )}
    </section>
  );
}
