import Reveal from "./Reveal";

function Person({ role, name, parents }: { role: string; name: string; parents: string }) {
  return (
    <div className="flex flex-col items-center text-center max-w-xs">
      <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-olive-100 border border-olive-200 flex items-center justify-center mb-6 overflow-hidden">
        <span className="text-olive-400 text-sm font-body">Fotoğraf Alanı</span>
      </div>
      <p className="eyebrow mb-2">{role}</p>
      <h3 className="font-display text-3xl text-olive-800 mb-3">{name}</h3>
      <p className="font-body text-sm text-olive-600 leading-relaxed">{parents}</p>
    </div>
  );
}

export default function CoupleInfo() {
  return (
    <section className="py-24 px-6 bg-cream">
      <Reveal>
        <p className="eyebrow text-center mb-3">Bizi Tanıyın</p>
        <h2 className="font-display text-4xl text-center text-olive-800 mb-16">
          Mutlu Çift
        </h2>
      </Reveal>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-16 sm:gap-24">
        <Reveal>
          <Person
            role="Gelin"
            name="İsim Soyisim"
            parents="[Anne Adı] & [Baba Adı]'nın kızı"
          />
        </Reveal>

        <Reveal delay={150}>
          <span className="font-display italic text-4xl text-gold hidden sm:block">&</span>
        </Reveal>

        <Reveal delay={150}>
          <Person
            role="Damat"
            name="İsim Soyisim"
            parents="[Anne Adı] & [Baba Adı]'nın oğlu"
          />
        </Reveal>
      </div>
    </section>
  );
}
