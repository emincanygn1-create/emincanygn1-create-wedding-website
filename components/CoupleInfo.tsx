import Reveal from "./Reveal";
import RevealText from "./RevealText";
import PhotoFrame from "./PhotoFrame";
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
  delay = 0,
}: {
  role: string;
  name: string;
  parents: string;
  photoUrl: string | null;
  placeholder: string;
  instagram: string;
  delay?: number;
}) {
  return (
    <div className="flex max-w-xs flex-col items-center text-center">
      <PhotoFrame src={photoUrl} alt={name} placeholder={placeholder} delay={delay} />

      <p className="eyebrow mb-2 mt-10">{role}</p>
      <RevealText
        text={name}
        as="h3"
        className="mb-3 font-script text-4xl leading-tight text-olive-800"
        step={70}
      />
      {parents && (
        <p className="font-body text-sm leading-relaxed text-olive-600">{parents}</p>
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
    <section id="couple" className="relative overflow-hidden px-6 py-28 scroll-mt-8">
      <Reveal>
        <p className="eyebrow text-center mb-3">{d.couple.eyebrow}</p>
        <RevealText
          text={d.couple.title}
          as="h2"
          className="mb-4 text-center font-display text-4xl text-olive-800"
        />
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
            delay={120}
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
            delay={260}
          />
        </Reveal>
      </div>
    </section>
  );
}
