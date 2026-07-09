import Reveal from "./Reveal";
import RevealText from "./RevealText";
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
    <section className="relative overflow-hidden bg-inherit px-6 py-28">
      {backgroundUrl && (
        <>
          <div
            className="absolute inset-0 bg-parallax"
            style={{ backgroundImage: `url(${backgroundUrl})` }}
          />
          {/* Kaplama bölümün kendi rengini miras alır (bg-inherit),
              böylece geri sayım nereye taşınırsa taşınsın uyum sağlar. */}
          <div className="absolute inset-0 bg-inherit opacity-[0.88]" />
        </>
      )}

      <div className="relative">
        <Reveal>
          <p className="eyebrow text-center mb-3">{d.countdown.saveDate}</p>
          <RevealText
            text={d.countdown.title}
            as="h2"
            className="mb-4 text-center font-display text-4xl text-olive-800"
          />
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
