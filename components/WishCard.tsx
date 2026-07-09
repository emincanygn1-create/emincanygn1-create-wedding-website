"use client";

import type { Wish } from "@/lib/types";
import type { Dict } from "@/lib/i18n/dictionaries";

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function WishCard({
  wish,
  liked,
  onLike,
  d,
  tone = "light",
}: {
  wish: Wish;
  liked: boolean;
  onLike: (wish: Wish) => void;
  d: Dict;
  /** "light" = krem zemin, "dark" = koyu zemin */
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";

  return (
    <div
      className={`flex h-full gap-4 rounded-xl border p-5 ${
        dark
          ? "border-cream/15 bg-cream/5"
          : "border-olive-200 bg-white"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-body text-xs tracking-wide ${
          dark ? "bg-gold/80 text-olive-900" : "bg-olive-700 text-cream"
        }`}
      >
        {initials(wish.name) || "♥"}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <p
          className={`mb-3 whitespace-pre-line break-words font-body text-sm leading-relaxed ${
            dark ? "text-cream/90" : "text-olive-700"
          }`}
        >
          {wish.message}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3">
          <p className={`eyebrow ${dark ? "text-cream/50" : "text-olive-400"}`}>
            {wish.name}
          </p>

          <button
            onClick={() => onLike(wish)}
            disabled={liked}
            aria-label={liked ? d.wishes.liked : d.wishes.like}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${
              liked
                ? "border-rust bg-rust text-cream"
                : dark
                  ? "border-cream/25 text-cream/70 hover:border-cream/60"
                  : "border-olive-200 text-olive-500 hover:border-olive-400 hover:text-olive-700"
            }`}
          >
            <span className={liked ? "animate-heartPop" : ""}>♥</span>
            <span className="tabular-nums">{wish.likes}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
