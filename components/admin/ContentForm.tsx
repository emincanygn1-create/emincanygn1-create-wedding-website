"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { SiteContent, TranslatableField } from "@/lib/types";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";

/** Dile göre değişmeyen alanlar. */
const BASE_FIELDS: { name: keyof SiteContent; label: string }[] = [
  { name: "bride_name", label: "Gelin Adı Soyadı" },
  { name: "groom_name", label: "Damat Adı Soyadı" },
  { name: "ceremony_map_url", label: "Nikah Google Maps Linki" },
  { name: "reception_map_url", label: "Düğün Google Maps Linki" },
  { name: "gift_account_name", label: "Hediye Hesap Sahibi Adı" },
  { name: "gift_iban", label: "IBAN" },
];

/** Her dil için ayrı yazılabilen alanlar. */
const TRANSLATED_FIELDS: {
  name: TranslatableField;
  label: string;
  multiline?: boolean;
}[] = [
  { name: "bride_parents", label: "Gelin Aile Bilgisi (örn: Ayşe & Ali'nin kızı)" },
  { name: "groom_parents", label: "Damat Aile Bilgisi" },
  { name: "wedding_city", label: "Düğün Şehri" },
  { name: "ceremony_venue", label: "Nikah Salonu Adı" },
  { name: "ceremony_date_text", label: "Nikah Tarihi (yazı olarak)" },
  { name: "ceremony_time_text", label: "Nikah Saati" },
  { name: "ceremony_address", label: "Nikah Adresi" },
  { name: "reception_venue", label: "Düğün Salonu Adı" },
  { name: "reception_date_text", label: "Düğün Tarihi (yazı olarak)" },
  { name: "reception_time_text", label: "Düğün Saati" },
  { name: "reception_address", label: "Düğün Adresi" },
  { name: "quote_text", label: "Alıntı / Söz", multiline: true },
];

function fieldKey(name: TranslatableField, lang: Locale): keyof SiteContent {
  return (lang === "tr" ? name : `${name}_${lang}`) as keyof SiteContent;
}

export default function ContentForm({ initial }: { initial: SiteContent }) {
  const [form, setForm] = useState<SiteContent>(initial);
  const [lang, setLang] = useState<Locale>("tr");
  const [weddingDateLocal, setWeddingDateLocal] = useState(
    initial.wedding_date
      ? new Date(initial.wedding_date).toISOString().slice(0, 16)
      : ""
  );
  const [bridePhotoFile, setBridePhotoFile] = useState<File | null>(null);
  const [groomPhotoFile, setGroomPhotoFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (name: keyof SiteContent, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    const supabase = createClient();

    const updates: Record<string, unknown> = { ...form };
    delete updates.id;

    if (weddingDateLocal) {
      updates.wedding_date = new Date(weddingDateLocal).toISOString();
    }

    try {
      if (bridePhotoFile) {
        const path = `bride-${Date.now()}-${bridePhotoFile.name}`;
        const { error } = await supabase.storage.from("media").upload(path, bridePhotoFile);
        if (error) throw error;
        const { data } = supabase.storage.from("media").getPublicUrl(path);
        updates.bride_photo_url = data.publicUrl;
      }

      if (groomPhotoFile) {
        const path = `groom-${Date.now()}-${groomPhotoFile.name}`;
        const { error } = await supabase.storage.from("media").upload(path, groomPhotoFile);
        if (error) throw error;
        const { data } = supabase.storage.from("media").getPublicUrl(path);
        updates.groom_photo_url = data.publicUrl;
      }

      if (videoFile) {
        const path = `video-${Date.now()}-${videoFile.name}`;
        const { error } = await supabase.storage.from("media").upload(path, videoFile);
        if (error) throw error;
        const { data } = supabase.storage.from("media").getPublicUrl(path);
        updates.video_url = data.publicUrl;
      }

      const { error: updateError } = await supabase
        .from("site_content")
        .update(updates)
        .eq("id", 1);
      if (updateError) throw updateError;

      setMessage("Kaydedildi ✓");
      setBridePhotoFile(null);
      setGroomPhotoFile(null);
      setVideoFile(null);
      router.refresh();
    } catch {
      setMessage("Bir hata oluştu, tekrar dene.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-10 pb-16">
      <section>
        <h2 className="eyebrow mb-4">Düğün Tarihi ve Saati</h2>
        <input
          type="datetime-local"
          value={weddingDateLocal}
          onChange={(e) => setWeddingDateLocal(e.target.value)}
          className="border border-olive-200 rounded-lg px-4 py-2 font-body text-sm"
        />
        <p className="text-xs text-olive-400 font-body mt-2">
          Geri sayımda ve kapak sayfasında kullanılır. Tarih her dilde otomatik olarak
          doğru biçimde yazılır.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="eyebrow">Dilden Bağımsız Bilgiler</h2>
        {BASE_FIELDS.map((field) => (
          <div key={String(field.name)}>
            <label className="block text-xs text-olive-500 mb-1 font-body">
              {field.label}
            </label>
            <input
              type="text"
              value={(form[field.name] as string) || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="w-full border border-olive-200 rounded-lg px-4 py-2 font-body text-sm"
            />
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="eyebrow">Çevrilebilir Metinler</h2>

        <div className="flex gap-2">
          {locales.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              className={`rounded-full px-5 py-2 text-xs tracking-wide transition-colors ${
                lang === code
                  ? "bg-olive-700 text-cream"
                  : "border border-olive-300 text-olive-600 hover:bg-olive-100"
              }`}
            >
              {localeNames[code]}
            </button>
          ))}
        </div>

        <p className="text-xs text-olive-400 font-body">
          {lang === "tr"
            ? "Türkçe alanlar zorunludur. İngilizce ve İtalyanca boş bırakılırsa site otomatik olarak Türkçesini gösterir."
            : "Boş bıraktığın alanlarda site otomatik olarak Türkçe metni gösterir."}
        </p>

        {TRANSLATED_FIELDS.map((field) => {
          const key = fieldKey(field.name, lang);
          const fallback = (form[field.name] as string) || "";
          return (
            <div key={String(key)}>
              <label className="block text-xs text-olive-500 mb-1 font-body">
                {field.label}
              </label>
              {field.multiline ? (
                <textarea
                  value={(form[key] as string) || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  rows={3}
                  placeholder={lang === "tr" ? "" : fallback}
                  className="w-full border border-olive-200 rounded-lg px-4 py-2 font-body text-sm"
                />
              ) : (
                <input
                  type="text"
                  value={(form[key] as string) || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={lang === "tr" ? "" : fallback}
                  className="w-full border border-olive-200 rounded-lg px-4 py-2 font-body text-sm"
                />
              )}
            </div>
          );
        })}
      </section>

      <section className="space-y-6">
        <h2 className="eyebrow">Fotoğraflar ve Video</h2>

        <div>
          <label className="block text-xs text-olive-500 mb-2 font-body">
            Gelin Fotoğrafı
          </label>
          {form.bride_photo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.bride_photo_url}
              alt=""
              className="w-20 h-20 rounded-full object-cover mb-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBridePhotoFile(e.target.files?.[0] || null)}
            className="text-sm font-body"
          />
        </div>

        <div>
          <label className="block text-xs text-olive-500 mb-2 font-body">
            Damat Fotoğrafı
          </label>
          {form.groom_photo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.groom_photo_url}
              alt=""
              className="w-20 h-20 rounded-full object-cover mb-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setGroomPhotoFile(e.target.files?.[0] || null)}
            className="text-sm font-body"
          />
        </div>

        <div>
          <label className="block text-xs text-olive-500 mb-2 font-body">Video</label>
          {form.video_url && (
            <p className="text-xs text-olive-500 mb-2 font-body">Mevcut bir video yüklü.</p>
          )}
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            className="text-sm font-body"
          />
        </div>
      </section>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-olive-700 text-cream rounded-full px-8 py-3 text-sm tracking-wide hover:bg-olive-800 transition-colors disabled:opacity-50"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
        {message && <p className="text-sm font-body text-olive-600">{message}</p>}
      </div>
    </div>
  );
}
