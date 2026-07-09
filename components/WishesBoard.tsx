"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import RevealText from "./RevealText";
import WishCard from "./WishCard";
import LanguageSwitcher from "./LanguageSwitcher";
import { OrnamentDivider } from "./Ornament";
import { createClient } from "@/lib/supabase/client";
import { readLiked, saveLiked, WISH_LIKES_KEY } from "@/lib/likes";
import { withCount, type Dict } from "@/lib/i18n/dictionaries";
import type { Wish } from "@/lib/types";
import type { Locale } from "@/lib/i18n/config";

const PAGE_SIZE = 9;

const inputClass =
  "w-full rounded-lg border border-olive-200 bg-white px-4 py-3 font-body text-sm text-olive-800 transition-colors placeholder:text-olive-400 focus:border-olive-400 focus:outline-none";

type Sort = "new" | "top";

export default function WishesBoard({
  initialWishes,
  d,
  locale,
}: {
  initialWishes: Wish[];
  d: Dict;
  locale: Locale;
}) {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [liked, setLiked] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>("new");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => setLiked(readLiked(WISH_LIKES_KEY)), []);

  const sorted = useMemo(() => {
    const copy = [...wishes];
    if (sort === "top") {
      copy.sort(
        (a, b) =>
          b.likes - a.likes ||
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return copy;
  }, [wishes, sort]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    if (!name.trim() || !message.trim()) {
      setError(d.wishes.required);
      return;
    }

    setSending(true);
    setError("");
    setNotice("");

    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("wishes")
      .insert({
        name: name.trim().slice(0, 60),
        message: message.trim().slice(0, 800),
        locale,
      })
      .select()
      .single();

    setSending(false);

    if (insertError || !data) {
      setError(d.wishes.error);
      return;
    }

    setWishes((prev) => [data as Wish, ...prev]);
    setSort("new");
    setName("");
    setMessage("");
    setNotice(d.wishes.success);
    setTimeout(() => setNotice(""), 4000);
  };

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

  const shown = sorted.slice(0, visibleCount);

  const sortButton = (key: Sort, label: string) => (
    <button
      onClick={() => {
        setSort(key);
        setVisibleCount(PAGE_SIZE);
      }}
      className={`rounded-full px-5 py-2 text-xs tracking-wide transition-colors ${
        sort === key
          ? "bg-olive-700 text-cream"
          : "border border-olive-300 text-olive-600 hover:bg-olive-100"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 border-b border-olive-200 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 font-body text-sm text-olive-600 transition-colors hover:text-olive-800"
          >
            <span className="text-lg leading-none">‹</span>
            <span className="hidden sm:inline">{d.wishes.back}</span>
          </Link>

          <p className="font-display text-lg text-olive-800">{d.wishes.title}</p>

          <LanguageSwitcher current={locale} tone="dark" />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 pb-24 pt-12">
        <Reveal>
          <p className="eyebrow mb-3 text-center">{d.wishes.eyebrow}</p>
          <RevealText
            text={d.wishes.title}
            as="h1"
            className="mb-4 text-center font-display text-4xl text-olive-800"
          />
          <OrnamentDivider className="mx-auto mb-6 h-8 w-40 text-olive-400" />
          <p className="mb-14 text-center font-body text-sm text-olive-500">
            {d.wishes.pageSubtitle}
          </p>
        </Reveal>

        <div className="mx-auto max-w-lg">
          <Reveal>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={d.wishes.name}
                maxLength={60}
                className={inputClass}
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={d.wishes.message}
                rows={4}
                maxLength={800}
                className={`${inputClass} resize-none`}
              />

              {error && <p className="font-body text-sm text-rust">{error}</p>}
              {notice && <p className="font-body text-sm text-olive-600">{notice}</p>}

              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-full bg-olive-700 py-3.5 text-sm uppercase tracking-widest text-cream transition-colors hover:bg-olive-800 disabled:opacity-50"
              >
                {sending ? d.wishes.submitting : d.wishes.submit}
              </button>
            </form>
          </Reveal>
        </div>

        {wishes.length === 0 ? (
          <p className="mt-20 text-center font-body text-sm text-olive-400">
            {d.wishes.noneYet}
          </p>
        ) : (
          <>
            <div className="mt-20 flex flex-wrap items-center justify-between gap-4">
              <p className="eyebrow text-olive-400">
                {withCount(d.wishes.count, wishes.length)}
              </p>
              <div className="flex gap-2">
                {sortButton("new", d.wishes.sortNew)}
                {sortButton("top", d.wishes.sortTop)}
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((wish, i) => (
                <Reveal key={wish.id} delay={Math.min(i, 5) * 70}>
                  <WishCard
                    wish={wish}
                    liked={liked.includes(wish.id)}
                    onLike={handleLike}
                    d={d}
                  />
                </Reveal>
              ))}
            </div>

            {visibleCount < wishes.length && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="rounded-full border border-olive-400 px-6 py-2 text-sm tracking-wide text-olive-700 transition-colors hover:bg-olive-700 hover:text-cream"
                >
                  {d.wishes.loadMore}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
