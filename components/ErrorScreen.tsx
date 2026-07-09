"use client";

import { OrnamentDivider } from "./Ornament";

/** Hem 500 hem beklenmedik istemci hataları için ortak ekran. */
export default function ErrorScreen({
  title,
  text,
  retryLabel,
  homeLabel,
  homeHref,
  onRetry,
}: {
  title: string;
  text: string;
  retryLabel: string;
  homeLabel: string;
  homeHref: string;
  onRetry: () => void;
}) {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center bg-olive-900 px-6 text-center text-cream">
      <svg width="46" height="46" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z"
          stroke="#E3C766"
          strokeWidth="1.2"
        />
        <path d="M9.5 9.5 14.5 13M14.5 9.5 9.5 13" stroke="#E3C766" strokeWidth="1.2" strokeLinecap="round" />
      </svg>

      <OrnamentDivider className="mx-auto my-8 h-8 w-40 text-gold-light/60" />

      <h1 className="mb-4 font-display text-3xl">{title}</h1>
      <p className="mb-10 max-w-sm font-body text-sm leading-relaxed text-cream/70">
        {text}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onRetry}
          className="press rounded-full border border-gold bg-gold/10 px-8 py-3.5 text-xs uppercase tracking-[0.25em] text-cream transition-colors hover:bg-gold hover:text-olive-900"
        >
          {retryLabel}
        </button>
        <a
          href={homeHref}
          className="press rounded-full border border-cream/30 px-8 py-3.5 text-xs uppercase tracking-[0.25em] text-cream/80 transition-colors hover:bg-cream/10"
        >
          {homeLabel}
        </a>
      </div>
    </main>
  );
}
