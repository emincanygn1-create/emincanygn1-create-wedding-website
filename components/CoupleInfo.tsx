import Reveal from "./Reveal";
import { OrnamentDivider } from "./Ornament";
import type { Dict } from "@/lib/i18n/dictionaries";

function InstagramLink({ handle }: { handle: string }) {
  if (!handle) return null;
  const clean = handle.replace(/^@/, "").trim();
  if (!clean) return null;

  return (
    <a
      href={`https://instagram.com/${clean}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex items-center gap-2 border border-olive-300 text-olive-600 rounded-full px-4 py-1.5 text-xs font-body hover:bg-olive-700 hover:text-cream hover:border-olive-700 transition-colors"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
      </svg>
      @{clean}
    </a>
  );
}

function Person({
  role,
  name,
  parents,
  photoUrl,
  placeholder,
  instagram,
}: {
  role: string;
  name: string;
  parents: string;
  photoUrl: string | null;
  placeholder: string;
  instagram: string;
}) {
  return (
    <div className="flex flex-col items-center text-center max-w-xs">
      <div className="relative">
        <div className="absolute -inset-2.5 arch border border-gold/40" />
        <div className="arch w-44 h-60 sm:w-52 sm:h-72 overflow-hidden bg-olive-100 border border-olive-200 flex items-center justify-center">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <span className="text-olive-400 text-sm font-body">{placeholder}</span>
          )}
        </div>
      </div>

      <p className="eyebrow mt-8 mb-2">{role}</p>
      <h3 className="font-script text-4xl text-olive-800 mb-3 leading-tight">{name}</h3>
      {parents && (
        <p className="font-body text-sm text-olive-600 leading-relaxed">{parents}</p>
      )}
      <InstagramLink handle={instagram} />
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
  brideInstagram,
  groomInstagram,
  d,
}: {
  brideName: string;
  groomName: string;
  brideParents: string;
  groomParents: string;
  bridePhotoUrl: string | null;
  groomPhotoUrl: string | null;
  brideInstagram: string;
  groomInstagram: string;
  d: Dict;
}) {
  return (
    <section
      id="couple"
      className="relative py-28 px-6 bg-cream scroll-mt-8 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-olive-100/70 to-transparent" />

      <Reveal>
        <p className="eyebrow text-center mb-3">{d.couple.eyebrow}</p>
        <h2 className="font-display text-4xl text-center text-olive-800 mb-4">
          {d.couple.title}
        </h2>
        <OrnamentDivider className="w-40 h-8 text-olive-400 mx-auto mb-16" />
      </Reveal>

      <div className="relative flex flex-col sm:flex-row items-center justify-center gap-16 sm:gap-20">
        <Reveal variant="left">
          <Person
            role={d.couple.bride}
            name={brideName}
            parents={brideParents}
            photoUrl={bridePhotoUrl}
            placeholder={d.couple.photoPlaceholder}
            instagram={brideInstagram}
          />
        </Reveal>

        <Reveal variant="zoom" delay={150}>
          <span className="font-script text-6xl text-gold hidden sm:block">&</span>
        </Reveal>

        <Reveal variant="right" delay={150}>
          <Person
            role={d.couple.groom}
            name={groomName}
            parents={groomParents}
            photoUrl={groomPhotoUrl}
            placeholder={d.couple.photoPlaceholder}
            instagram={groomInstagram}
          />
        </Reveal>
      </div>
    </section>
  );
}
