"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import RevealText from "./RevealText";
import { OrnamentDivider } from "./Ornament";
import { lzRow } from "@/lib/localize";
import type { Faq as FaqItem } from "@/lib/types";
import type { Dict } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

function Item({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border transition-colors ${
        open ? "border-gold/50 bg-white" : "border-olive-200 bg-white/70"
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
      >
        <span className="font-display text-lg leading-snug text-olive-800">
          {question}
        </span>

        <span
          className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            open
              ? "rotate-45 border-gold bg-gold/10 text-gold-dark"
              : "border-olive-300 text-olive-500"
          }`}
          aria-hidden
        >
          <span className="absolute h-px w-3 bg-current" />
          <span className="absolute h-3 w-px bg-current" />
        </span>
      </button>

      <div
        className={`grid transition-all duration-500 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6">
            <div className="mb-4 h-px w-10 bg-gold/40" />
            <p className="whitespace-pre-line font-body text-sm leading-relaxed text-olive-600">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Faq({
  items,
  d,
  locale,
}: {
  items: FaqItem[];
  d: Dict;
  locale: Locale;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="faq" className="px-6 py-28 scroll-mt-8">
      <Reveal>
        <p className="eyebrow mb-3 text-center">{d.faq.eyebrow}</p>
        <RevealText
          text={d.faq.title}
          as="h2"
          className="mb-4 text-center font-display text-4xl text-olive-800"
        />
        <OrnamentDivider className="mx-auto mb-6 h-8 w-40 text-olive-400" />
        <p className="mx-auto mb-14 max-w-md text-center font-body text-sm text-olive-500">
          {d.faq.subtitle}
        </p>
      </Reveal>

      {items.length === 0 ? (
        <p className="text-center font-body text-sm text-olive-400">{d.faq.empty}</p>
      ) : (
        <div className="mx-auto max-w-2xl space-y-3">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={Math.min(i, 5) * 70}>
              <Item
                question={lzRow(item, "question", locale)}
                answer={lzRow(item, "answer", locale)}
                open={openId === item.id}
                onToggle={() => setOpenId(openId === item.id ? null : item.id)}
              />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
