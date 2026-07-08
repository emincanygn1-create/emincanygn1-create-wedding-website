import Reveal from "./Reveal";

const sampleMessages = [
  { name: "Ayşe & Mehmet", text: "Nice bir ömür sizi bekliyor, tebrikler!" },
  { name: "Elif K.", text: "Birbirinize her zaman böyle mutlu bakın." },
];

export default function Wishes() {
  return (
    <section className="py-24 px-6 bg-cream">
      <Reveal>
        <p className="eyebrow text-center mb-3">Bize Katılın</p>
        <h2 className="font-display text-4xl text-center text-olive-800 mb-4">
          Dilek Bırakın
        </h2>
        <p className="text-center text-olive-500 font-body text-sm mb-16">
          (Bu form bir sonraki aşamada aktif hale getirilecek)
        </p>
      </Reveal>

      <div className="max-w-lg mx-auto">
        <Reveal>
          <div className="space-y-4">
            <input
              disabled
              placeholder="Adınız"
              className="w-full border border-olive-200 rounded-lg px-4 py-3 bg-olive-50 text-olive-400 font-body text-sm"
            />
            <textarea
              disabled
              placeholder="Dileğinizi buraya yazın..."
              rows={4}
              className="w-full border border-olive-200 rounded-lg px-4 py-3 bg-olive-50 text-olive-400 font-body text-sm resize-none"
            />
            <button
              disabled
              className="w-full bg-olive-300 text-cream rounded-full py-3 text-sm tracking-wide cursor-not-allowed"
            >
              Gönder
            </button>
          </div>
        </Reveal>

        <div className="mt-14 space-y-4">
          {sampleMessages.map((m, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="bg-olive-50 border border-olive-100 rounded-xl p-5">
                <p className="font-body text-olive-700 text-sm leading-relaxed mb-2">
                  {m.text}
                </p>
                <p className="eyebrow text-olive-400">{m.name}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
