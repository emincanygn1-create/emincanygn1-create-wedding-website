"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Lightbox from "@/components/Lightbox";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/client";
import type { GuestPhoto } from "@/lib/types";
import { withCount, type Dict } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

const MAX_BYTES = 15 * 1024 * 1024;
const NAME_KEY = "wedding_guest_name";
const LIKED_KEY = "wedding_liked_photos";

const inputClass =
  "w-full border border-olive-200 rounded-lg px-4 py-3 bg-cream text-olive-800 font-body text-sm placeholder:text-olive-400 focus:outline-none focus:border-olive-400 transition-colors";

function safeExtension(fileName: string) {
  const match = /\.([a-zA-Z0-9]{1,5})$/.exec(fileName);
  return match ? match[1].toLowerCase() : "jpg";
}

function readLiked(): string[] {
  try {
    const raw = window.localStorage.getItem(LIKED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export default function MomentsFeed({
  initialPhotos,
  d,
  locale,
}: {
  initialPhotos: GuestPhoto[];
  d: Dict;
  locale: Locale;
}) {
  const [photos, setPhotos] = useState<GuestPhoto[]>(initialPhotos);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [liked, setLiked] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [name, setName] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLiked(readLiked());
    const savedName = window.localStorage.getItem(NAME_KEY);
    if (savedName) setName(savedName);
  }, []);

  // Düğün sırasında yeni fotoğrafları sessizce çeker.
  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("guest_photos")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setPhotos(data as GuestPhoto[]);
  }, []);

  useEffect(() => {
    const timer = setInterval(refresh, 25000);
    return () => clearInterval(timer);
  }, [refresh]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFile = (selected: File | null) => {
    setError("");
    if (!selected) return;
    if (selected.size > MAX_BYTES) {
      setError(d.moments.tooBig);
      return;
    }
    setFile(selected);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setFile(null);
    setCaption("");
    setError("");
  };

  const handleUpload = async () => {
    if (!name.trim()) {
      setError(d.moments.needName);
      return;
    }
    if (!file) {
      setError(d.moments.needPhoto);
      return;
    }

    setUploading(true);
    setError("");

    const supabase = createClient();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${safeExtension(file.name)}`;

    const { error: uploadError } = await supabase.storage
      .from("guest-media")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setUploading(false);
      setError(d.moments.error);
      return;
    }

    const { data: urlData } = supabase.storage.from("guest-media").getPublicUrl(path);

    const { data: inserted, error: insertError } = await supabase
      .from("guest_photos")
      .insert({
        url: urlData.publicUrl,
        storage_path: path,
        caption: caption.trim().slice(0, 300),
        uploader_name: name.trim().slice(0, 60),
      })
      .select()
      .single();

    setUploading(false);

    if (insertError || !inserted) {
      setError(d.moments.error);
      return;
    }

    window.localStorage.setItem(NAME_KEY, name.trim());
    setPhotos((prev) => [inserted as GuestPhoto, ...prev]);
    closeDialog();
  };

  const handleLike = async (photo: GuestPhoto) => {
    if (liked.includes(photo.id)) return;

    const next = [...liked, photo.id];
    setLiked(next);
    try {
      window.localStorage.setItem(LIKED_KEY, JSON.stringify(next));
    } catch {
      // depolama kapalıysa sorun değil
    }

    setPhotos((prev) =>
      prev.map((p) => (p.id === photo.id ? { ...p, likes: p.likes + 1 } : p))
    );

    const supabase = createClient();
    await supabase.rpc("increment_photo_likes", { photo_id: photo.id });
  };

  const current = openIndex !== null ? photos[openIndex] : null;

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur border-b border-olive-200">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 text-olive-600 hover:text-olive-800 font-body text-sm transition-colors"
          >
            <span className="text-lg leading-none">‹</span>
            <span className="hidden sm:inline">{d.moments.back}</span>
          </Link>

          <p className="font-display text-lg text-olive-800">{d.moments.pageTitle}</p>

          <LanguageSwitcher current={locale} tone="dark" />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 pt-12 pb-32">
        <Reveal>
          <p className="eyebrow text-center mb-3">{d.moments.ctaEyebrow}</p>
          <h1 className="font-display text-4xl text-center text-olive-800 mb-4">
            {d.moments.pageTitle}
          </h1>
          <p className="text-center text-olive-500 font-body text-sm mb-3">
            {d.moments.pageSubtitle}
          </p>
          {photos.length > 0 && (
            <p className="text-center eyebrow text-olive-400 mb-12">
              {withCount(d.moments.photoCount, photos.length)}
            </p>
          )}
        </Reveal>

        {photos.length === 0 ? (
          <p className="text-center text-olive-400 font-body text-sm py-20">
            {d.moments.empty}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
            {photos.map((photo, i) => (
              <Reveal key={photo.id} variant="zoom" delay={Math.min(i, 6) * 60}>
                <button
                  onClick={() => setOpenIndex(i)}
                  className="group relative block w-full aspect-square rounded-xl overflow-hidden bg-olive-100 border border-olive-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.caption || ""}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-olive-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-left opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-cream text-xs font-body truncate">
                      {photo.uploader_name}
                    </p>
                    {photo.likes > 0 && (
                      <p className="text-cream/80 text-[11px] font-body">
                        ♥ {photo.likes}
                      </p>
                    )}
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {/* Yükleme butonu */}
      <button
        onClick={() => setDialogOpen(true)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-olive-700 text-cream rounded-full px-7 py-4 text-sm tracking-widest uppercase shadow-xl hover:bg-olive-800 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 16V5m0 0-4 4m4-4 4 4M5 19h14"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {d.moments.upload}
      </button>

      {/* Yükleme penceresi */}
      {dialogOpen && (
        <div
          className="fixed inset-0 z-[60] bg-olive-900/70 flex items-end sm:items-center justify-center p-0 sm:p-6"
          onClick={closeDialog}
        >
          <div
            className="w-full sm:max-w-md bg-cream rounded-t-3xl sm:rounded-2xl border border-olive-200 p-6 sm:p-8 animate-lightboxIn max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-2xl text-olive-800 mb-6 text-center">
              {d.moments.uploadTitle}
            </h3>

            <div className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={d.moments.yourName}
                maxLength={60}
                className={inputClass}
              />

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] || null)}
              />

              {preview ? (
                <div className="relative rounded-xl overflow-hidden border border-olive-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="" className="w-full max-h-72 object-cover" />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-3 right-3 bg-cream/90 text-olive-700 rounded-full px-4 py-2 text-xs font-body"
                  >
                    {d.moments.chooseAnother}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-olive-300 rounded-xl py-12 text-olive-500 font-body text-sm hover:border-olive-400 hover:text-olive-700 transition-colors"
                >
                  {d.moments.choosePhoto}
                </button>
              )}

              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder={d.moments.caption}
                rows={2}
                maxLength={300}
                className={`${inputClass} resize-none`}
              />

              {error && <p className="text-rust text-sm font-body">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeDialog}
                  disabled={uploading}
                  className="flex-1 border border-olive-300 text-olive-600 rounded-full py-3 text-sm tracking-wide hover:bg-olive-100 transition-colors disabled:opacity-50"
                >
                  {d.moments.cancel}
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 bg-olive-700 text-cream rounded-full py-3 text-sm tracking-wide hover:bg-olive-800 transition-colors disabled:opacity-50"
                >
                  {uploading ? d.moments.uploading : d.moments.share}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Büyütülmüş görünüm */}
      {openIndex !== null && current && (
        <>
          <Lightbox
            items={photos.map((p) => ({
              url: p.url,
              caption: p.caption,
              author: p.uploader_name,
            }))}
            index={openIndex}
            onClose={() => setOpenIndex(null)}
            onIndexChange={setOpenIndex}
            closeLabel={d.moments.close}
          />
          <button
            onClick={() => handleLike(current)}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-2 rounded-full px-6 py-3 text-sm font-body transition-colors ${
              liked.includes(current.id)
                ? "bg-rust text-cream"
                : "bg-cream/90 text-olive-800 hover:bg-cream"
            }`}
          >
            <span className={liked.includes(current.id) ? "animate-heartPop" : ""}>♥</span>
            {current.likes} {d.moments.likes}
          </button>
        </>
      )}
    </div>
  );
}
