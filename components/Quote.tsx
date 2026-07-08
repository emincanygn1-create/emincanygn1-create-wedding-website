import Reveal from "./Reveal";

export default function Quote({ text }: { text: string }) {
  if (!text) return null;

  return (
    <section className="py-24 px-6 bg-olive-700 text-cream">
      <Reveal>
        <div className="max-w-2xl mx-auto text-center">
          <span className="font-display text-6xl text-gold-light leading-none">"</span>
          <p className="font-display italic text-2xl sm:text-3xl leading-relaxed -mt-4">
            {text}
          </p>
          <div className="w-12 h-px bg-gold mx-auto mt-8" />
        </div>
      </Reveal>
    </section>
  );
}
