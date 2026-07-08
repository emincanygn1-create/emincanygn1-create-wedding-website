export default function Cover() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-olive-700 via-olive-600 to-olive-700 text-cream px-6 text-center">
      {/* dekoratif yaprak deseni - arka plan */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
        <svg
          className="absolute -top-10 -left-10 w-72 h-72"
          viewBox="0 0 200 200"
          fill="none"
        >
          <path
            d="M100 10 C 160 40, 160 160, 100 190 C 40 160, 40 40, 100 10 Z"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
        <svg
          className="absolute -bottom-16 -right-16 w-96 h-96"
          viewBox="0 0 200 200"
          fill="none"
        >
          <path
            d="M100 10 C 160 40, 160 160, 100 190 C 40 160, 40 40, 100 10 Z"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="relative animate-fadeIn">
        <p className="eyebrow text-gold-light mb-6">Davetlisiniz</p>

        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-tight mb-4">
          İsim <span className="italic text-gold-light">&</span> İsim
        </h1>

        <div className="w-16 h-px bg-gold mx-auto my-6" />

        <p className="font-body tracking-widest text-sm sm:text-base uppercase text-cream/90">
          [Düğün Tarihi] · [Şehir]
        </p>

        <div className="mt-14 flex flex-col items-center gap-2 text-cream/70">
          <span className="text-xs tracking-widest uppercase">Aşağı Kaydırın</span>
          <span className="block w-px h-10 bg-cream/40 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
