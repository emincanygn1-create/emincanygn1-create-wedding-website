import Link from "next/link";
import Reveal from "@/components/Reveal";
import RevealText from "@/components/RevealText";
import StoryEntry from "@/components/StoryEntry";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { OrnamentDivider } from "@/components/Ornament";
import { getStoryPosts } from "@/lib/content";
import { lzRow } from "@/lib/localize";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default async function StoryPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const d = getDictionary(locale);
  const posts = await getStoryPosts();

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 border-b border-olive-200 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 font-body text-sm text-olive-600 transition-colors hover:text-olive-800"
          >
            <span className="text-lg leading-none">‹</span>
            <span className="hidden sm:inline">{d.story.back}</span>
          </Link>

          <p className="font-display text-lg text-olive-800">{d.story.title}</p>

          <LanguageSwitcher current={locale} tone="dark" />
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 pb-24 pt-12">
        <Reveal>
          <p className="eyebrow mb-3 text-center">{d.story.eyebrow}</p>
          <RevealText
            text={d.story.title}
            as="h1"
            className="mb-4 text-center font-display text-4xl text-olive-800"
          />
          <OrnamentDivider className="mx-auto mb-6 h-8 w-40 text-olive-400" />
          <p className="mb-10 text-center font-body text-sm text-olive-500">
            {d.story.subtitle}
          </p>
        </Reveal>

        {posts.length === 0 ? (
          <p className="py-20 text-center font-body text-sm text-olive-400">
            {d.story.empty}
          </p>
        ) : (
          posts.map((post, i) => (
            <StoryEntry
              key={post.id}
              index={i}
              full
              dateText={lzRow(post, "date_text", locale)}
              title={lzRow(post, "title", locale)}
              body={lzRow(post, "body", locale)}
              photoUrl={post.photo_url}
            />
          ))
        )}
      </div>
    </div>
  );
}
