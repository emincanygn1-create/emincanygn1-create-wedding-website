import Reveal from "./Reveal";

export default function Gallery() {
  const placeholders = Array.from({ length: 6 });

  return (
    <section className="py-24 px-6 bg-olive-100/60">
      <Reveal>
        <p className="eyebrow text-center mb-3">Anılarımız</p>
        <h2 className="font-display text-4xl text-center text-olive-800 mb-16">
          Fotoğraf Galerisi
        </h2>
      </Reveal>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
        {placeholders.map((_, i) => (
          <Reveal key={i} delay={i * 80}>
            <div className="aspect-square rounded-xl bg-olive-200/70 border border-olive-300 flex items-center justify-center hover:scale-[1.02] transition-transform">
              <span className="text-olive-500 text-xs font-body">Fotoğraf {i + 1}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
