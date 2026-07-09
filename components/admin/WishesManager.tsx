"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDateTime } from "@/lib/formatDate";
import type { Wish } from "@/lib/types";

export default function WishesManager({
  initialWishes,
}: {
  initialWishes: Wish[];
}) {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);

  const toggleVisible = async (wish: Wish) => {
    const supabase = createClient();
    const next = !wish.is_visible;
    const { error } = await supabase
      .from("wishes")
      .update({ is_visible: next })
      .eq("id", wish.id);
    if (!error) {
      setWishes((prev) =>
        prev.map((w) => (w.id === wish.id ? { ...w, is_visible: next } : w))
      );
    }
  };

  const remove = async (wish: Wish) => {
    if (!window.confirm("Bu dileği kalıcı olarak silmek istediğine emin misin?")) return;
    const supabase = createClient();
    await supabase.from("wishes").delete().eq("id", wish.id);
    setWishes((prev) => prev.filter((w) => w.id !== wish.id));
  };

  if (wishes.length === 0) {
    return <p className="font-body text-olive-500 text-sm">Henüz dilek yok.</p>;
  }

  return (
    <div className="space-y-3 max-w-3xl">
      {wishes.map((wish) => (
        <div
          key={wish.id}
          className={`bg-white border rounded-xl p-5 ${
            wish.is_visible ? "border-olive-200" : "border-rust/40 bg-rust/5"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-body text-olive-800 text-sm leading-relaxed whitespace-pre-line break-words">
                {wish.message}
              </p>
              <p className="text-xs text-olive-400 mt-3 font-body">
                {wish.name} · ♥ {wish.likes} · {formatDateTime(wish.created_at)} ·{" "}
                {wish.locale.toUpperCase()}
                {!wish.is_visible && (
                  <span className="text-rust"> · sitede gizli</span>
                )}
              </p>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => toggleVisible(wish)}
                className="border border-olive-300 text-olive-600 rounded-full px-4 py-1.5 text-xs hover:bg-olive-100 transition-colors whitespace-nowrap"
              >
                {wish.is_visible ? "Gizle" : "Göster"}
              </button>
              <button
                onClick={() => remove(wish)}
                className="text-rust text-xs hover:underline"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
