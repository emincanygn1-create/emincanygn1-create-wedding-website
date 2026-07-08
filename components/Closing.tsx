import Reveal from "./Reveal";
import Petals from "./Petals";
import { OrnamentCorner, OrnamentDivider } from "./Ornament";
import type { Dict } from "@/lib/i18n/dictionaries";

export default function Closing({
  brideName,
  groomName,
  text,
  backgroundUrl,
  d,
}: {
  brideName: string;
  groomName: string;
  text: string;
  backgroundUrl: string | null;
  d: Dict;
}) {
  return (
    <section className="relative py-32 px-6 overflow-hidden text-cream">
      <div
        className="absolute inset-0 bg-olive-800 bg-parallax"
        style={backgroundUrl ? { backgroundImage: `url(${backgroundUrl})` } : undefined}
      />
      <div
        className={`absolute inset-0 ${
          backgroundUrl ? "bg-olive-900/85" : "bg-gradient-to-b from-olive-800 to-olive-900"
        }`}
      />

      <OrnamentCorner className="absolute -top-4 -left-4 w-40 h-40 text-gold-light/25 rotate-180" />
      <OrnamentCorner className="absolute -bottom-4 -right-4 w-44 h-44 text-gold-light/25" />
      <Petals count={8} />

      <div className="relative max-w-xl mx-auto text-center">
        <Reveal>
          <p className="eyebrow text-gold-light mb-3">{d.closing.eyebrow}</p>
          <h2 className="font-display text-3xl sm:text-4xl mb-6 leading-snug">
            {d.closing.title}
          </h2>
          <p className="font-body text-sm text-cream/80 leading-relaxed">
            {text || d.closing.text}
          </p>
          <OrnamentDivider className="w-40 h-8 text-gold-light/70 mx-auto my-10" />
        </Reveal>

        <Reveal variant="zoom" delay={150}>
          <p className="eyebrow text-cream/60 mb-4">{d.closing.seeYou}</p>
          <p className="font-script text-5xl sm:text-6xl text-cream leading-tight">
            {brideName}
            <span className="text-gold-light"> & </span>
            {groomName}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
