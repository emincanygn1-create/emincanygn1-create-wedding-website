import Reveal from "./Reveal";
import Countdown from "./Countdown";

export default function CountdownSection() {
  return (
    <section className="py-24 px-6 bg-olive-100/60">
      <Reveal>
        <p className="eyebrow text-center mb-3">Geriye Kalan Süre</p>
        <h2 className="font-display text-4xl text-center text-olive-800 mb-14">
          Büyük Güne Sayılı Günler
        </h2>
      </Reveal>
      <Reveal delay={100}>
        <Countdown />
      </Reveal>
    </section>
  );
}
