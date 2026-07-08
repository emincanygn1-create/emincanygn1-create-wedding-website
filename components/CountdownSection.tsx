import Reveal from "./Reveal";
import Countdown from "./Countdown";
import AddToCalendar from "./AddToCalendar";
import { OrnamentDivider } from "./Ornament";
import type { Dict } from "@/lib/i18n/dictionaries";

export default function CountdownSection({
  weddingDate,
  calendarTitle,
  calendarLocation,
  backgroundUrl,
  d,
}: {
  weddingDate: string;
  calendarTitle: string;
  calendarLocation: string;
  backgroundUrl: string | null;
  d: Dict;
}) {
  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <div
        className="absolute inset-0 bg-olive-100 bg-parallax"
        style={backgroundUrl ? { backgroundImage: `url(${backgroundUrl})` } : undefined}
      />
      <div
        className={`absolute inset-0 ${
          backgroundUrl ? "bg-cream/90" : "bg-olive-100/60"
        }`}
      />

      <div className="relative">
        <Reveal>
          <p className="eyebrow text-center mb-3">{d.countdown.saveDate}</p>
          <h2 className="font-display text-4xl text-center text-olive-800 mb-4">
            {d.countdown.title}
          </h2>
          <OrnamentDivider className="w-40 h-8 text-olive-400 mx-auto mb-14" />
        </Reveal>

        <Reveal variant="zoom" delay={100}>
          <Countdown weddingDate={weddingDate} d={d} />
        </Reveal>

        <Reveal delay={200}>
          <div className="text-center mt-14">
            <AddToCalendar
              weddingDate={weddingDate}
              title={calendarTitle}
              location={calendarLocation}
              d={d}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
