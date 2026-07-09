"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDateTime } from "@/lib/formatDate";
import type { GuestPhoto } from "@/lib/types";
import type { AdminDict } from "@/lib/i18n/admin";

export default function MomentsManager({
  initialPhotos,
  t,
}: {
  initialPhotos: GuestPhoto[];
  t: AdminDict;
}) {
  const [photos, setPhotos] = useState<GuestPhoto[]>(initialPhotos);

  const toggleVisible = async (photo: GuestPhoto) => {
    const supabase = createClient();
    const next = !photo.is_visible;
    const { error } = await supabase
      .from("guest_photos")
      .update({ is_visible: next })
      .eq("id", photo.id);
    if (!error) {
      setPhotos((prev) =>
        prev.map((p) => (p.id === photo.id ? { ...p, is_visible: next } : p))
      );
    }
  };

  const remove = async (photo: GuestPhoto) => {
    if (!window.confirm(t.common.confirmDelete)) return;

    const supabase = createClient();
    await supabase.from("guest_photos").delete().eq("id", photo.id);
    if (photo.storage_path) {
      await supabase.storage.from("guest-media").remove([photo.storage_path]);
    }
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
  };

  if (photos.length === 0) {
    return (
      <p className="font-body text-olive-500 text-sm">{t.moments.empty}</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className={`bg-white border rounded-xl overflow-hidden ${
            photo.is_visible ? "border-olive-200" : "border-rust/40"
          }`}
        >
          <div className="relative aspect-square bg-olive-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt=""
              loading="lazy"
              className={`w-full h-full object-cover ${
                photo.is_visible ? "" : "opacity-40 grayscale"
              }`}
            />
            {!photo.is_visible && (
              <span className="absolute top-3 left-3 bg-rust text-cream text-[10px] tracking-wider uppercase rounded-full px-3 py-1">
                {t.moments.hidden}
              </span>
            )}
          </div>

          <div className="p-4">
            {photo.caption && (
              <p className="font-body text-olive-700 text-sm mb-2 break-words">
                {photo.caption}
              </p>
            )}
            <p className="text-xs text-olive-400 font-body">
              {photo.uploader_name || t.moments.anonymous} · ♥ {photo.likes} ·{" "}
              {formatDateTime(photo.created_at)}
            </p>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => toggleVisible(photo)}
                className="border border-olive-300 text-olive-600 rounded-full px-4 py-1.5 text-xs hover:bg-olive-100 transition-colors"
              >
                {photo.is_visible ? t.common.hide : t.common.show}
              </button>
              <button
                onClick={() => remove(photo)}
                className="text-rust text-xs hover:underline ml-auto"
              >
                {t.common.delete}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
