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
  { name: "bride_instagram", label: "Gelin Instagram kullanıcı adı (@ olmadan)" },
  { name: "groom_instagram", label: "Damat Instagram kullanıcı adı (@ olmadan)" },
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
  { name: "closing_text", label: "Kapanış Metni (teşekkür bölümü)", multiline: true },
];

function fieldKey(name: TranslatableField, lang: Locale): keyof SiteContent {
  return (lang === "tr" ? name : `${name}_${lang}`) as keyof SiteContent;
}

type UploadKey =
  | "bride_photo_url"
  | "groom_photo_url"
  | "cover_photo_url"
  | "cover_video_url"
  | "quote_bg_url"
  | "closing_bg_url"
  | "video_url"
  | "music_url";

const UPLOADS: {
  key: UploadKey;
  label: string;
  hint?: string;
  accept: string;
  preview: "image" | "none";
}[] = [
  {
    key: "cover_photo_url",
    label: "Kapak Fotoğrafı",
    hint: "Davetiye kapısında ve açılış ekranında tam sayfa görünür. Dikey (portre) fotoğraf en iyi sonucu verir.",
    accept: "image/*",
    preview: "image",
  },
  {
    key: "cover_video_url",
    label: "Kapak Videosu",
    hint: "Kapak fotoğrafının üzerinde sessiz ve döngüsel oynar. Kapak fotoğrafını da yüklü bırak: video hazır olana kadar o görünür, veri tasarrufu açık telefonlarda video hiç indirilmez. 20 MB'ı geçmemesi önerilir.",
    accept: "video/mp4,video/webm,video/quicktime",
    preview: "none",
  },
  { key: "bride_photo_url", label: "Gelin Fotoğrafı", accept: "image/*", preview: "image" },
  { key: "groom_photo_url", label: "Damat Fotoğrafı", accept: "image/*", preview: "image" },
  {
    key: "quote_bg_url",
    label: "Alıntı Bölümü Arka Planı",
    hint: "Boş bırakırsan düz zeytin yeşili kullanılır.",
    accept: "image/*",
    preview: "image",
  },
  {
    key: "closing_bg_url",
    label: "Kapanış Bölümü Arka Planı",
    hint: "Boş bırakırsan düz zeytin yeşili kullanılır.",
    accept: "image/*",
    preview: "image",
  },
  {
    key: "video_url",
    label: "Hikaye Videosu",
    hint: "Galerinin altındaki \"Bizim Hikayemiz\" bölümünde, oynat butonuyla izlenir. Kapak videosuyla karıştırma.",
    accept: "video/*",
    preview: "none",
  },
  {
    key: "music_url",
    label: "Arka Plan Müziği",
    hint: "Misafir davetiyeyi açtığı anda çalmaya başlar, sol alttaki butondan susturulabilir. MP3 önerilir.",
    accept: "audio/*",
    preview: "none",
  },
];

export default function ContentForm({ initial }: { initial: SiteContent }) {
  const [form, setForm] = useState<SiteContent>(initial);
  const [lang, setLang] = useState<Locale>("tr");
  const [weddingDateLocal, setWeddingDateLocal] = useState(
    initial.wedding_date
      ? new Date(initial.wedding_date).toISOString().slice(0, 16)
      : ""
  );
  const [files, setFiles] = useState<Partial<Record<UploadKey, File>>>({});
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
      for (const upload of UPLOADS) {
        const file = files[upload.key];
        if (!file) continue;

        const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
        const path = `${upload.key}-${Date.now()}.${extension}`;

        const { error } = await supabase.storage.from("media").upload(path, file);
        if (error) throw error;

        const { data } = supabase.storage.from("media").getPublicUrl(path);
        updates[upload.key] = data.publicUrl;
      }

      const { error: updateError } = await supabase
        .from("site_content")
        .update(updates)
        .eq("id", 1);
      if (updateError) throw updateError;

      setMessage("Kaydedildi ✓");
      setFiles({});
      setForm((prev) => ({ ...prev, ...(updates as Partial<SiteContent>) }));
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

      <section className="space-y-8">
        <h2 className="eyebrow">Fotoğraflar, Video ve Müzik</h2>

        {UPLOADS.map((upload) => {
          const currentUrl = form[upload.key] as string | null;
          const selected = files[upload.key];

          return (
            <div key={upload.key}>
              <label className="block text-xs text-olive-500 mb-1 font-body">
                {upload.label}
              </label>
              {upload.hint && (
                <p className="text-[11px] text-olive-400 font-body mb-3 max-w-md leading-relaxed">
                  {upload.hint}
                </p>
              )}

              {upload.preview === "image" && currentUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentUrl}
                  alt=""
                  className="w-24 h-24 rounded-lg object-cover mb-3 border border-olive-200"
                />
              )}

              {upload.preview === "none" && currentUrl && (
                <p className="text-xs text-olive-500 mb-2 font-body">
                  Yüklü bir dosya var.
                </p>
              )}

              <input
                type="file"
                accept={upload.accept}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setFiles((prev) => ({ ...prev, [upload.key]: file ?? undefined }));
                }}
                className="text-sm font-body"
              />

              {selected && (
                <p className="text-[11px] text-olive-500 font-body mt-2">
                  Seçildi: {selected.name} — kaydedince yüklenecek.
                </p>
              )}
            </div>
          );
        })}
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
