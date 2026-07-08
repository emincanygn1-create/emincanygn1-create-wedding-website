import Reveal from "./Reveal";
import { OrnamentDivider } from "./Ornament";

export default function Quote({
  text,
  backgroundUrl,
}: {
  text: string;
  backgroundUrl: string | null;
}) {
  if (!text) return null;

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div
        className="absolute inset-0 bg-olive-700 bg-parallax"
        style={backgroundUrl ? { backgroundImage: `url(${backgroundUrl})` } : undefined}
      />
      <div
        className={`absolute inset-0 ${
          backgroundUrl ? "bg-olive-900/80" : "bg-olive-700"
        }`}
      />

      <Reveal soft>
        <div className="relative max-w-2xl mx-auto text-center text-cream">
          <span className="font-display text-7xl text-gold-light leading-none block">
            &ldquo;
          </span>
          <p className="font-display italic text-2xl sm:text-3xl leading-relaxed -mt-6">
            {text}
          </p>
          <OrnamentDivider className="w-40 h-8 text-gold-light/70 mx-auto mt-10" />
        </div>
      </Reveal>
    </section>
  );
}
