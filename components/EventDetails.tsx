import Reveal from "./Reveal";
import type { Dict } from "@/lib/i18n/dictionaries";

type EventInfo = {
  venue: string;
  dateText: string;
  timeText: string;
  address: string;
  mapUrl: string;
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
    <div className="bg-cream border border-olive-200 rounded-2xl p-8 sm:p-10 text-center max-w-sm w-full transition-transform duration-500 hover:-translate-y-1">
      <p className="eyebrow mb-3">{title}</p>
      <h3 className="font-display text-2xl text-olive-800 mb-6">{info.venue}</h3>

      <div className="space-y-2 font-body text-olive-600 text-sm mb-8">
        <p>{info.dateText}</p>
        <p>{info.timeText}</p>
        <p>{info.address}</p>
      </div>

      {info.mapUrl && (
        <a
          href={info.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-olive-400 text-olive-700 rounded-full px-6 py-2 text-sm tracking-wide hover:bg-olive-700 hover:text-cream transition-colors"
        >
          {mapLabel}
        </a>
      )}
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
    <section id="event" className="py-24 px-6 bg-cream scroll-mt-8">
      <Reveal>
        <p className="eyebrow text-center mb-3">{d.events.eyebrow}</p>
        <h2 className="font-display text-4xl text-center text-olive-800 mb-16">
          {d.events.title}
        </h2>
      </Reveal>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        <Reveal variant="left">
          <EventCard title={d.events.ceremony} info={ceremony} mapLabel={d.events.map} />
        </Reveal>
        <Reveal variant="right" delay={150}>
          <EventCard title={d.events.reception} info={reception} mapLabel={d.events.map} />
        </Reveal>
      </div>
    </section>
  );
}
