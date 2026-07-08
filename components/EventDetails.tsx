import Reveal from "./Reveal";
import RevealText from "./RevealText";
import RevealImage from "./RevealImage";
import { OrnamentDivider } from "./Ornament";
import type { Dict } from "@/lib/i18n/dictionaries";

type EventInfo = {
  venue: string;
  dateText: string;
  timeText: string;
  address: string;
  mapUrl: string;
  photoUrl?: string | null;
};

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
    <div className="group relative w-full max-w-sm overflow-hidden rounded-2xl border border-olive-200 bg-cream shadow-sm transition-transform duration-500 hover:-translate-y-1.5">
      {info.photoUrl && (
        <RevealImage
          src={info.photoUrl}
          className="h-44 w-full"
          imgClassName="transition-transform duration-700 group-hover:scale-110"
          parallax
          strength={14}
        />
      )}

      <div className="p-8 sm:p-10 text-center">
        <p className="eyebrow mb-3">{title}</p>
        <RevealText
          text={info.venue}
          as="h3"
          className="mb-5 font-script text-3xl leading-tight text-olive-800"
          step={60}
        />

        <OrnamentDivider className="w-28 h-6 text-olive-300 mx-auto mb-6" />

        <div className="space-y-1.5 font-body text-olive-600 text-sm mb-8">
          <p className="text-olive-800">{info.dateText}</p>
          <p>{info.timeText}</p>
          <p className="text-xs leading-relaxed text-olive-500 pt-2">{info.address}</p>
        </div>

        {info.mapUrl && (
          <a
            href={info.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-olive-400 text-olive-700 rounded-full px-6 py-2.5 text-xs tracking-widest uppercase hover:bg-olive-700 hover:text-cream transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            {mapLabel}
          </a>
        )}
      </div>
    </div>
  );
}

export default function EventDetails({
  ceremony,
  reception,
  d,
}: {
  ceremony: EventInfo;
  reception: EventInfo;
  d: Dict;
}) {
  return (
    <section id="event" className="relative py-28 px-6 bg-cream scroll-mt-8">
      <Reveal>
        <p className="eyebrow text-center mb-3">{d.events.eyebrow}</p>
        <RevealText
          text={d.events.title}
          as="h2"
          className="mb-4 text-center font-display text-4xl text-olive-800"
        />
        <OrnamentDivider className="w-40 h-8 text-olive-400 mx-auto mb-16" />
      </Reveal>

      <div className="flex flex-col md:flex-row items-stretch justify-center gap-8">
        <Reveal variant="left" className="flex justify-center">
          <EventCard title={d.events.ceremony} info={ceremony} mapLabel={d.events.map} />
        </Reveal>
        <Reveal variant="right" delay={150} className="flex justify-center">
          <EventCard title={d.events.reception} info={reception} mapLabel={d.events.map} />
        </Reveal>
      </div>
    </section>
  );
}
