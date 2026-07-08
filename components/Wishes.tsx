"use client";

import { useState, type FormEvent } from "react";
import Reveal from "./Reveal";
import { OrnamentDivider } from "./Ornament";
import { createClient } from "@/lib/supabase/client";
import type { Wish } from "@/lib/types";
import { withCount, type Dict } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

const PAGE_SIZE = 6;

const inputClass =
  "w-full border border-olive-200 rounded-lg px-4 py-3 bg-white text-olive-800 font-body text-sm placeholder:text-olive-400 focus:outline-none focus:border-olive-400 transition-colors";

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Wishes({
  initialWishes,
  d,
  locale,
}: {
  initialWishes: Wish[];
  d: Dict;
  locale: Locale;
}) {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

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
    setName("");
    setMessage("");
    setNotice(d.wishes.success);
    setTimeout(() => setNotice(""), 4000);
  };

  const shown = wishes.slice(0, visibleCount);

  return (
    <section id="wishes" className="py-24 px-6 bg-cream scroll-mt-8">
      <Reveal>
        <p className="eyebrow text-center mb-3">{d.wishes.eyebrow}</p>
        <h2 className="font-display text-4xl text-center text-olive-800 mb-4">
          {d.wishes.title}
        </h2>
        <OrnamentDivider className="w-40 h-8 text-olive-400 mx-auto mb-6" />
        <p className="text-center text-olive-500 font-body text-sm mb-14">
          {d.wishes.subtitle}
        </p>
      </Reveal>

      <div className="max-w-lg mx-auto">
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

            {error && <p className="text-rust text-sm font-body">{error}</p>}
            {notice && <p className="text-olive-600 text-sm font-body">{notice}</p>}

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-olive-700 text-cream rounded-full py-3.5 text-sm tracking-widest uppercase hover:bg-olive-800 transition-colors disabled:opacity-50"
            >
              {sending ? d.wishes.submitting : d.wishes.submit}
            </button>
          </form>
        </Reveal>

        {wishes.length > 0 && (
          <p className="eyebrow text-center mt-16 mb-6 text-olive-400">
            {withCount(d.wishes.count, wishes.length)}
          </p>
        )}

        <div className="mt-4 space-y-4">
          {shown.length === 0 ? (
            <p className="text-center text-olive-400 font-body text-sm mt-12">
              {d.wishes.empty}
            </p>
          ) : (
            shown.map((wish, i) => (
              <Reveal key={wish.id} delay={Math.min(i, 4) * 80}>
                <div className="bg-olive-50 border border-olive-100 rounded-xl p-5 flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-olive-700 text-cream flex items-center justify-center text-xs font-body tracking-wide">
                    {initials(wish.name) || "♥"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-body text-olive-700 text-sm leading-relaxed mb-2 whitespace-pre-line break-words">
                      {wish.message}
                    </p>
                    <p className="eyebrow text-olive-400">{wish.name}</p>
                  </div>
                </div>
              </Reveal>
            ))
          )}
        </div>

        {visibleCount < wishes.length && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="border border-olive-400 text-olive-700 rounded-full px-6 py-2 text-sm tracking-wide hover:bg-olive-700 hover:text-cream transition-colors"
            >
              {d.wishes.loadMore}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
