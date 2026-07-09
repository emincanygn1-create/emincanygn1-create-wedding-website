"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import RevealText from "./RevealText";
import WishCard from "./WishCard";
import { OrnamentDivider } from "./Ornament";
import { createClient } from "@/lib/supabase/client";
import { readLiked, saveLiked, WISH_LIKES_KEY } from "@/lib/likes";
import { withCount, type Dict } from "@/lib/i18n/dictionaries";
import type { Wish } from "@/lib/types";
import type { Locale } from "@/lib/i18n/config";

/** Ana sayfada: en çok beğenilen birkaç dilek ve tüm dileklere giden bağlantı. */
export default function WishesHighlight({
  topWishes,
  totalCount,
  d,
  locale,
}: {
  topWishes: Wish[];
  totalCount: number;
  d: Dict;
  locale: Locale;
}) {
  const [wishes, setWishes] = useState<Wish[]>(topWishes);
  const [liked, setLiked] = useState<string[]>([]);

  useEffect(() => setLiked(readLiked(WISH_LIKES_KEY)), []);

  const handleLike = async (wish: Wish) => {
    if (liked.includes(wish.id)) return;

    const next = [...liked, wish.id];
    setLiked(next);
    saveLiked(WISH_LIKES_KEY, next);

    setWishes((prev) =>
      prev.map((w) => (w.id === wish.id ? { ...w, likes: w.likes + 1 } : w))
    );

    const supabase = createClient();
    await supabase.rpc("increment_wish_likes", { wish_id: wish.id });
  };

  return (
    <section id="wishes" className="scroll-mt-8 bg-cream px-6 py-28">
      <Reveal>
        <p className="eyebrow mb-3 text-center">{d.wishes.eyebrow}</p>
        <RevealText
          text={wishes.length > 0 ? d.wishes.topTitle : d.wishes.title}
          as="h2"
          className="mb-4 text-center font-display text-4xl text-olive-800"
        />
        <OrnamentDivider className="mx-auto mb-6 h-8 w-40 text-olive-400" />
        <p className="mx-auto mb-14 max-w-md text-center font-body text-sm leading-relaxed text-olive-500">
          {d.wishes.subtitle}
        </p>
      </Reveal>

      {wishes.length === 0 ? (
        <p className="mb-12 text-center font-body text-sm text-olive-400">
          {d.wishes.empty}
        </p>
      ) : (
        <div className="mx-auto mb-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishes.map((wish, i) => (
            <Reveal key={wish.id} delay={i * 90}>
              <WishCard
                wish={wish}
                liked={liked.includes(wish.id)}
                onLike={handleLike}
                d={d}
              />
            </Reveal>
          ))}
        </div>
      )}

      <Reveal variant="zoom">
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={`/${locale}/wishes`}
            className="rounded-full bg-olive-700 px-8 py-3.5 text-xs uppercase tracking-widest text-cream transition-colors hover:bg-olive-800"
          >
            {d.wishes.leaveOne}
          </Link>

          {totalCount > 0 && (
            <Link
              href={`/${locale}/wishes`}
              className="rounded-full border border-olive-400 px-8 py-3.5 text-xs uppercase tracking-widest text-olive-700 transition-colors hover:bg-olive-100"
            >
              {d.wishes.seeAll} ({withCount(d.wishes.count, totalCount)})
            </Link>
          )}
        </div>
      </Reveal>
    </section>
  );
}
