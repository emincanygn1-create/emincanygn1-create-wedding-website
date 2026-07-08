import Reveal from "./Reveal";

function EventCard({
  title,
  date,
  time,
  venue,
  address,
}: {
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
}) {
  return (
    <div className="bg-cream border border-olive-200 rounded-2xl p-8 sm:p-10 text-center max-w-sm w-full">
      <p className="eyebrow mb-3">{title}</p>
      <h3 className="font-display text-2xl text-olive-800 mb-6">{venue}</h3>

      <div className="space-y-2 font-body text-olive-600 text-sm mb-8">
        <p>{date}</p>
        <p>{time}</p>
        <p>{address}</p>
      </div>

      <button className="border border-olive-400 text-olive-700 rounded-full px-6 py-2 text-sm tracking-wide hover:bg-olive-700 hover:text-cream transition-colors">
        Haritada Gör
      </button>
    </div>
  );
}

export default function EventDetails() {
  return (
    <section className="py-24 px-6 bg-cream">
      <Reveal>
        <p className="eyebrow text-center mb-3">Ne Zaman, Nerede</p>
        <h2 className="font-display text-4xl text-center text-olive-800 mb-16">
          Etkinlik Detayları
        </h2>
      </Reveal>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        <Reveal>
          <EventCard
            title="Nikah Töreni"
            venue="[Nikah Salonu Adı]"
            date="[Gün, Tarih]"
            time="[Saat]"
            address="[Adres]"
          />
        </Reveal>
        <Reveal delay={150}>
          <EventCard
            title="Düğün Resepsiyonu"
            venue="[Düğün Salonu Adı]"
            date="[Gün, Tarih]"
            time="[Saat]"
            address="[Adres]"
          />
        </Reveal>
      </div>
    </section>
  );
}
