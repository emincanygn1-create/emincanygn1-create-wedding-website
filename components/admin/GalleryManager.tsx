"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { GalleryPhoto } from "@/lib/types";
import type { AdminDict } from "@/lib/i18n/admin";

export default function GalleryManager({
  initialPhotos,
  t,
}: {
  initialPhotos: GalleryPhoto[];
  t: AdminDict;
}) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const supabase = createClient();

    for (const file of Array.from(files)) {
      const path = `gallery-${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("media").upload(path, file);
      if (!error) {
        const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
        const { data: inserted } = await supabase
          .from("gallery_photos")
          .insert({ url: urlData.publicUrl, sort_order: photos.length })
          .select()
          .single();
        if (inserted) {
          setPhotos((prev) => [...prev, inserted as GalleryPhoto]);
        }
      }
    }

    setUploading(false);
    e.target.value = "";
    router.refresh();
  };

  const handleDelete = async (photo: GalleryPhoto) => {
    const supabase = createClient();
    await supabase.from("gallery_photos").delete().eq("id", photo.id);
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    router.refresh();
  };

  return (
    <div>
      <label className="inline-block bg-olive-700 text-cream rounded-full px-6 py-3 text-sm cursor-pointer hover:bg-olive-800 transition-colors">
        {uploading ? t.common.saving : `+ ${t.gallery.title}`}
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>

      {photos.length === 0 ? (
        <p className="text-olive-500 text-sm font-body mt-6">Henüz fotoğraf eklenmedi.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt=""
                className="w-full aspect-square object-cover rounded-lg border border-olive-200"
              />
              <button
                onClick={() => handleDelete(photo)}
                className="absolute top-2 right-2 bg-rust text-cream text-xs rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
