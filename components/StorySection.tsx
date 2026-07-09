import Link from "next/link";
import Reveal from "./Reveal";
import RevealText from "./RevealText";
import StoryEntry from "./StoryEntry";
import { OrnamentDivider } from "./Ornament";
import { lzRow } from "@/lib/localize";
import type { StoryPost } from "@/lib/types";
import type { Dict } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

export default function StorySection({
  posts,
  totalCount,
  d,
  locale,
}: {
  posts: StoryPost[];
  totalCount: number;
  d: Dict;
  locale: Locale;
}) {
  return (
    <section id="story" className="scroll-mt-8 bg-cream px-6 py-28">
      <Reveal>
        <p className="eyebrow mb-3 text-center">{d.story.eyebrow}</p>
        <RevealText
          text={d.story.title}
          as="h2"
          className="mb-4 text-center font-display text-4xl text-olive-800"
        />
        <OrnamentDivider className="mx-auto mb-6 h-8 w-40 text-olive-400" />
        <p className="mx-auto mb-10 max-w-md text-center font-body text-sm text-olive-500">
          {d.story.subtitle}
        </p>
      </Reveal>

      {posts.length === 0 ? (
        <p className="text-center font-body text-sm text-olive-400">{d.story.empty}</p>
      ) : (
        <>
          <div className="mx-auto max-w-4xl">
            {posts.map((post, i) => (
              <StoryEntry
                key={post.id}
                index={i}
                dateText={lzRow(post, "date_text", locale)}
                title={lzRow(post, "title", locale)}
                body={lzRow(post, "body", locale)}
                photoUrl={post.photo_url}
              />
            ))}
          </div>

          {totalCount > posts.length && (
            <Reveal variant="zoom">
              <div className="mt-12 text-center">
                <Link
                  href={`/${locale}/story`}
                  className="press inline-block rounded-full border border-olive-400 px-8 py-3.5 text-xs uppercase tracking-widest text-olive-700 transition-colors hover:bg-olive-700 hover:text-cream"
                >
                  {d.story.readAll}
                </Link>
              </div>
            </Reveal>
          )}
        </>
      )}
    </section>
  );
}
