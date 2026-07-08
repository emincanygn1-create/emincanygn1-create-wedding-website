import Reveal from "./Reveal";
import type { Dict } from "@/lib/i18n/dictionaries";

function Person({
  role,
  name,
  parents,
  photoUrl,
  placeholder,
}: {
  role: string;
  name: string;
  parents: string;
  photoUrl: string | null;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col items-center text-center max-w-xs">
      <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-olive-100 border border-olive-200 flex items-center justify-center mb-6 overflow-hidden">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-olive-400 text-sm font-body">{placeholder}</span>
        )}
      </div>
      <p className="eyebrow mb-2">{role}</p>
      <h3 className="font-display text-3xl text-olive-800 mb-3">{name}</h3>
      {parents && (
        <p className="font-body text-sm text-olive-600 leading-relaxed">{parents}</p>
      )}
    </div>
  );
}

export default function CoupleInfo({
  brideName,
  groomName,
  brideParents,
  groomParents,
  bridePhotoUrl,
  groomPhotoUrl,
  d,
}: {
  brideName: string;
  groomName: string;
  brideParents: string;
  groomParents: string;
  bridePhotoUrl: string | null;
  groomPhotoUrl: string | null;
  d: Dict;
}) {
  return (
    <section id="couple" className="py-24 px-6 bg-cream scroll-mt-8">
      <Reveal>
        <p className="eyebrow text-center mb-3">{d.couple.eyebrow}</p>
        <h2 className="font-display text-4xl text-center text-olive-800 mb-16">
          {d.couple.title}
        </h2>
      </Reveal>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-16 sm:gap-24">
        <Reveal variant="left">
          <Person
            role={d.couple.bride}
            name={brideName}
            parents={brideParents}
            photoUrl={bridePhotoUrl}
            placeholder={d.couple.photoPlaceholder}
          />
        </Reveal>

        <Reveal variant="zoom" delay={150}>
          <span className="font-display italic text-4xl text-gold hidden sm:block">&</span>
        </Reveal>

        <Reveal variant="right" delay={150}>
          <Person
            role={d.couple.groom}
            name={groomName}
            parents={groomParents}
            photoUrl={groomPhotoUrl}
            placeholder={d.couple.photoPlaceholder}
          />
        </Reveal>
      </div>
    </section>
  );
}
