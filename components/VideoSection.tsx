import Reveal from "./Reveal";
import type { Dict } from "@/lib/i18n/dictionaries";

export default function VideoSection({
  videoUrl,
  d,
}: {
  videoUrl: string | null;
  d: Dict;
}) {
  if (!videoUrl) return null;

  return (
    <section className="py-24 px-6 bg-cream">
      <Reveal>
        <p className="eyebrow text-center mb-3">{d.video.eyebrow}</p>
        <h2 className="font-display text-4xl text-center text-olive-800 mb-16">
          {d.video.title}
        </h2>
      </Reveal>
      <Reveal variant="zoom">
        <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden border border-olive-200">
          <video src={videoUrl} controls className="w-full h-full" />
        </div>
      </Reveal>
    </section>
  );
}
