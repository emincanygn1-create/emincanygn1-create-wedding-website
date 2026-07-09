"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ItemToolbar from "./ItemToolbar";
import type { Faq } from "@/lib/types";
import type { AdminDict } from "@/lib/i18n/admin";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";

const inputClass =
  "w-full rounded-lg border border-olive-200 px-4 py-2 font-body text-sm";

type Field = "question" | "answer";

function key(field: Field, lang: Locale) {
  return (lang === "tr" ? field : `${field}_${lang}`) as keyof Faq;
}

export default function FaqManager({
  initialFaqs,
  t,
}: {
  initialFaqs: Faq[];
  t: AdminDict;
}) {
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [langs, setLangs] = useState<Record<string, Locale>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const supabase = createClient();

  const patch = (id: string, changes: Partial<Faq>) =>
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...changes } : f)));

  const addFaq = async () => {
    setBusy("new");
    const { data, error } = await supabase
      .from("faqs")
      .insert({ sort_order: faqs.length })
      .select()
      .single();
    setBusy(null);

    if (error || !data) {
      setMessage(t.common.error);
      return;
    }
    setFaqs((prev) => [...prev, data as Faq]);
  };

  const saveFaq = async (faq: Faq) => {
    setBusy(faq.id);
    setMessage("");

    const { id, created_at, ...fields } = faq;
    void created_at;

    const { error } = await supabase.from("faqs").update(fields).eq("id", id);
    setBusy(null);
    setMessage(error ? t.common.error : t.common.saved);
    setTimeout(() => setMessage(""), 3000);
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= faqs.length) return;

    const next = [...faqs];
    [next[index], next[target]] = [next[target], next[index]];

    const reordered = next.map((faq, i) => ({ ...faq, sort_order: i }));
    setFaqs(reordered);

    await Promise.all(
      reordered.map((faq) =>
        supabase.from("faqs").update({ sort_order: faq.sort_order }).eq("id", faq.id)
      )
    );
  };

  const toggleVisible = async (faq: Faq) => {
    const next = !faq.is_visible;
    patch(faq.id, { is_visible: next });
    await supabase.from("faqs").update({ is_visible: next }).eq("id", faq.id);
  };

  const remove = async (faq: Faq) => {
    if (!window.confirm(t.common.confirmDelete)) return;
    await supabase.from("faqs").delete().eq("id", faq.id);
    setFaqs((prev) => prev.filter((f) => f.id !== faq.id));
  };

  return (
    <div className="max-w-3xl space-y-5 pb-16">
      <div className="flex items-center gap-4">
        <button
          onClick={addFaq}
          disabled={busy === "new"}
          className="rounded-full bg-olive-700 px-6 py-2.5 text-sm tracking-wide text-cream transition-colors hover:bg-olive-800 disabled:opacity-50"
        >
          + {t.faq.add}
        </button>
        {message && <p className="font-body text-sm text-olive-600">{message}</p>}
      </div>

      {faqs.length === 0 && (
        <p className="font-body text-sm text-olive-500">{t.faq.empty}</p>
      )}

      {faqs.map((faq, index) => {
        const lang = langs[faq.id] ?? "tr";

        return (
          <div
            key={faq.id}
            className={`space-y-4 rounded-2xl border bg-white p-6 ${
              faq.is_visible ? "border-olive-200" : "border-rust/40 opacity-70"
            }`}
          >
            <ItemToolbar
              index={index}
              total={faqs.length}
              visible={faq.is_visible}
              onMove={(direction) => move(index, direction)}
              onToggle={() => toggleVisible(faq)}
              onDelete={() => remove(faq)}
              t={t}
            />

            <p className="font-display text-lg text-olive-800">
              {faq.question || t.faq.unanswered}
            </p>

            <div className="flex gap-2">
              {locales.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLangs((prev) => ({ ...prev, [faq.id]: code }))}
                  className={`rounded-full px-4 py-1.5 text-xs tracking-wide transition-colors ${
                    lang === code
                      ? "bg-olive-700 text-cream"
                      : "border border-olive-300 text-olive-600 hover:bg-olive-100"
                  }`}
                >
                  {localeNames[code]}
                </button>
              ))}
            </div>

            <div>
              <label className="mb-1 block font-body text-xs text-olive-500">
                {t.faq.question}
              </label>
              <input
                type="text"
                value={(faq[key("question", lang)] as string) || ""}
                onChange={(e) =>
                  patch(faq.id, { [key("question", lang)]: e.target.value })
                }
                placeholder={lang === "tr" ? "" : faq.question}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block font-body text-xs text-olive-500">
                {t.faq.answer}
              </label>
              <textarea
                value={(faq[key("answer", lang)] as string) || ""}
                onChange={(e) =>
                  patch(faq.id, { [key("answer", lang)]: e.target.value })
                }
                placeholder={lang === "tr" ? "" : faq.answer}
                rows={4}
                className={inputClass}
              />
            </div>

            <button
              onClick={() => saveFaq(faq)}
              disabled={busy === faq.id}
              className="rounded-full bg-olive-700 px-6 py-2 text-sm tracking-wide text-cream transition-colors hover:bg-olive-800 disabled:opacity-50"
            >
              {busy === faq.id ? t.common.saving : t.common.save}
            </button>
          </div>
        );
      })}
    </div>
  );
}
