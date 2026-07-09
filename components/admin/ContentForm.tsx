"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import SectionOrderEditor from "./SectionOrderEditor";
import type { SiteContent, TranslatableField } from "@/lib/types";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";
import type { AdminDict } from "@/lib/i18n/admin";
import { normalizeSections, type SectionSetting } from "@/lib/sections";

type BaseField = keyof AdminDict["fields"] & keyof SiteContent;

/** Dile göre değişmeyen alanlar. */
const BASE_FIELDS: BaseField[] = [
  "bride_name",
  "groom_name",
  "ceremony_map_url",
  "reception_map_url",
  "gift_account_name",
  "gift_iban",
  "bride_instagram",
  "groom_instagram",
];

/** Her dil için ayrı yazılabilen alanlar. */
const TRANSLATED_FIELDS: { name: TranslatableField; multiline?: boolean }[] = [
  { name: "site_title" },
  { name: "site_description" },
  { name: "cover_eyebrow" },
  { name: "bride_parents" },
  { name: "groom_parents" },
  { name: "wedding_city" },
  { name: "ceremony_venue" },
  { name: "ceremony_date_text" },
  { name: "ceremony_time_text" },
  { name: "ceremony_address" },
  { name: "reception_venue" },
  { name: "reception_date_text" },
  { name: "reception_time_text" },
  { name: "reception_address" },
  { name: "quote_text", multiline: true },
  { name: "closing_eyebrow" },
  { name: "closing_title" },
  { name: "closing_text", multiline: true },
  { name: "closing_seeyou" },
  { name: "rsvp_closed_message", multiline: true },
];

const HINTED_FIELDS = new Set<TranslatableField>([
  "site_title",
  "cover_eyebrow",
  "closing_eyebrow",
]);

function fieldKey(name: TranslatableField, lang: Locale): keyof SiteContent {
  return (lang === "tr" ? name : `${name}_${lang}`) as keyof SiteContent;
}

type UploadKey =
  | "cover_photo_url"
  | "cover_video_url"
  | "bride_photo_url"
  | "groom_photo_url"
  | "ceremony_photo_url"
  | "reception_photo_url"
  | "countdown_bg_url"
  | "quote_bg_url"
  | "closing_bg_url"
  | "video_url"
  | "music_url";

const UPLOADS: {
  key: UploadKey;
  labelKey: keyof AdminDict["uploads"];
  hintKey?: keyof AdminDict["uploads"];
  accept: string;
  preview: "image" | "none";
}[] = [
  {
    key: "cover_photo_url",
    labelKey: "cover_photo_url",
    hintKey: "cover_photo_hint",
    accept: "image/*",
    preview: "image",
  },
  {
    key: "cover_video_url",
    labelKey: "cover_video_url",
    hintKey: "cover_video_hint",
    accept: "video/mp4,video/webm",
    preview: "none",
  },
  {
    key: "bride_photo_url",
    labelKey: "bride_photo_url",
    accept: "image/*",
    preview: "image",
  },
  {
    key: "groom_photo_url",
    labelKey: "groom_photo_url",
    accept: "image/*",
    preview: "image",
  },
  {
    key: "ceremony_photo_url",
    labelKey: "ceremony_photo_url",
    hintKey: "event_photo_hint",
    accept: "image/*",
    preview: "image",
  },
  {
    key: "reception_photo_url",
    labelKey: "reception_photo_url",
    hintKey: "event_photo_hint",
    accept: "image/*",
    preview: "image",
  },
  {
    key: "countdown_bg_url",
    labelKey: "countdown_bg_url",
    hintKey: "countdown_bg_hint",
    accept: "image/*",
    preview: "image",
  },
  {
    key: "quote_bg_url",
    labelKey: "quote_bg_url",
    hintKey: "quote_bg_hint",
    accept: "image/*",
    preview: "image",
  },
  {
    key: "closing_bg_url",
    labelKey: "closing_bg_url",
    hintKey: "closing_bg_hint",
    accept: "image/*",
    preview: "image",
  },
  {
    key: "video_url",
    labelKey: "video_url",
    hintKey: "video_hint",
    accept: "video/*",
    preview: "none",
  },
  {
    key: "music_url",
    labelKey: "music_url",
    hintKey: "music_hint",
    accept: "audio/*",
    preview: "none",
  },
];

const inputClass =
  "w-full rounded-lg border border-olive-200 px-4 py-2 font-body text-sm";

export default function ContentForm({
  initial,
  t,
}: {
  initial: SiteContent;
  t: AdminDict;
}) {
  const [form, setForm] = useState<SiteContent>(initial);
  const [sections, setSections] = useState<SectionSetting[]>(
    normalizeSections(initial.section_config)
  );
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

    updates.section_config = sections;

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

      setMessage(t.common.saved);
      setFiles({});
      setForm((prev) => ({ ...prev, ...(updates as Partial<SiteContent>) }));
      router.refresh();
    } catch {
      setMessage(t.common.error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-10 pb-16">
      {/* --- Tarih --- */}
      <section>
        <h2 className="eyebrow mb-4">{t.content.weddingDate}</h2>
        <input
          type="datetime-local"
          value={weddingDateLocal}
          onChange={(e) => setWeddingDateLocal(e.target.value)}
          className="rounded-lg border border-olive-200 px-4 py-2 font-body text-sm"
        />
        <p className="mt-2 font-body text-xs text-olive-400">
          {t.content.weddingDateHint}
        </p>
      </section>

      {/* --- Davetiye kapısı --- */}
      <section className="space-y-4 rounded-2xl border border-olive-200 bg-white p-6">
        <h2 className="eyebrow">{t.content.gate}</h2>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={form.gate_enabled ?? false}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, gate_enabled: e.target.checked }))
            }
            className="mt-1 h-4 w-4 accent-[#3F4E32]"
          />
          <span>
            <span className="block font-body text-sm text-olive-800">
              {t.content.gateEnabled}
            </span>
            <span className="mt-1 block font-body text-xs leading-relaxed text-olive-400">
              {t.content.gateHint}
            </span>
          </span>
        </label>
      </section>

      {/* --- Misafir yükleme --- */}
      <section className="space-y-4 rounded-2xl border border-olive-200 bg-white p-6">
        <h2 className="eyebrow">{t.content.uploads}</h2>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={form.uploads_enabled ?? false}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, uploads_enabled: e.target.checked }))
            }
            className="mt-1 h-4 w-4 accent-[#3F4E32]"
          />
          <span>
            <span className="block font-body text-sm text-olive-800">
              {t.content.uploadsEnabled}
            </span>
            <span className="mt-1 block font-body text-xs leading-relaxed text-olive-400">
              {t.content.uploadsHint}
            </span>
          </span>
        </label>
      </section>

      {/* --- Etkinlik --- */}
      <section className="space-y-4 rounded-2xl border border-olive-200 bg-white p-6">
        <h2 className="eyebrow">{t.content.event}</h2>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={form.single_event ?? false}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, single_event: e.target.checked }))
            }
            className="mt-1 h-4 w-4 accent-[#3F4E32]"
          />
          <span>
            <span className="block font-body text-sm text-olive-800">
              {t.content.singleEvent}
            </span>
            <span className="mt-1 block font-body text-xs leading-relaxed text-olive-400">
              {t.content.singleEventHint}
            </span>
          </span>
        </label>
      </section>

      {/* --- RSVP --- */}
      <section className="space-y-5 rounded-2xl border border-olive-200 bg-white p-6">
        <h2 className="eyebrow">{t.content.rsvp}</h2>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={form.rsvp_enabled ?? true}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, rsvp_enabled: e.target.checked }))
            }
            className="mt-1 h-4 w-4 accent-[#3F4E32]"
          />
          <span>
            <span className="block font-body text-sm text-olive-800">
              {t.content.rsvpEnabled}
            </span>
            <span className="block font-body text-xs text-olive-400">
              {t.content.rsvpEnabledHint}
            </span>
          </span>
        </label>

        <div>
          <label className="mb-1 block font-body text-xs text-olive-500">
            {t.content.rsvpDeadline} ({t.common.optional})
          </label>
          <input
            type="datetime-local"
            value={
              form.rsvp_deadline
                ? new Date(form.rsvp_deadline).toISOString().slice(0, 16)
                : ""
            }
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                rsvp_deadline: e.target.value
                  ? new Date(e.target.value).toISOString()
                  : null,
              }))
            }
            className="rounded-lg border border-olive-200 px-4 py-2 font-body text-sm"
          />
          <p className="mt-2 font-body text-xs text-olive-400">
            {t.content.rsvpDeadlineHint}
          </p>
          {form.rsvp_deadline && (
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, rsvp_deadline: null }))}
              className="mt-2 font-body text-xs text-rust hover:underline"
            >
              {t.common.clear}
            </button>
          )}
        </div>

        <p className="font-body text-xs text-olive-400">{t.content.rsvpClosedNote}</p>
      </section>

      {/* --- Bölüm sırası --- */}
      <section className="space-y-4">
        <h2 className="eyebrow">{t.content.sections}</h2>
        <p className="max-w-lg font-body text-xs leading-relaxed text-olive-400">
          {t.content.sectionsHint}
        </p>
        <SectionOrderEditor sections={sections} onChange={setSections} t={t} />
      </section>

      {/* --- Dilden bağımsız --- */}
      <section className="space-y-4">
        <h2 className="eyebrow">{t.content.baseFields}</h2>
        {BASE_FIELDS.map((field) => (
          <div key={field}>
            <label className="mb-1 block font-body text-xs text-olive-500">
              {t.fields[field]}
            </label>
            <input
              type="text"
              value={(form[field] as string) || ""}
              onChange={(e) => handleChange(field, e.target.value)}
              className={inputClass}
            />
          </div>
        ))}
      </section>

      {/* --- Çevrilebilir --- */}
      <section className="space-y-4">
        <h2 className="eyebrow">{t.content.translatedFields}</h2>

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

        <p className="font-body text-xs text-olive-400">
          {lang === "tr" ? t.content.trRequired : t.content.fallbackNote}
        </p>

        {TRANSLATED_FIELDS.map((field) => {
          const key = fieldKey(field.name, lang);
          const fallback = (form[field.name] as string) || "";
          const hint = HINTED_FIELDS.has(field.name)
            ? t.hints[field.name as keyof AdminDict["hints"]]
            : undefined;

          return (
            <div key={String(key)}>
              <label className="mb-1 block font-body text-xs text-olive-500">
                {t.fields[field.name]}
              </label>
              {hint && (
                <p className="mb-2 font-body text-[11px] leading-relaxed text-olive-400">
                  {hint}
                </p>
              )}
              {field.multiline ? (
                <textarea
                  value={(form[key] as string) || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  rows={3}
                  placeholder={lang === "tr" ? "" : fallback}
                  className={inputClass}
                />
              ) : (
                <input
                  type="text"
                  value={(form[key] as string) || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={lang === "tr" ? "" : fallback}
                  className={inputClass}
                />
              )}
            </div>
          );
        })}
      </section>

      {/* --- Dosyalar --- */}
      <section className="space-y-8">
        <h2 className="eyebrow">{t.content.media}</h2>

        {UPLOADS.map((upload) => {
          const currentUrl = form[upload.key] as string | null;
          const selected = files[upload.key];

          return (
            <div key={upload.key}>
              <label className="mb-1 block font-body text-xs text-olive-500">
                {t.uploads[upload.labelKey]}
              </label>
              {upload.hintKey && (
                <p className="mb-3 max-w-md font-body text-[11px] leading-relaxed text-olive-400">
                  {t.uploads[upload.hintKey]}
                </p>
              )}

              {upload.preview === "image" && currentUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentUrl}
                  alt=""
                  className="mb-3 h-24 w-24 rounded-lg border border-olive-200 object-cover"
                />
              )}

              {upload.preview === "none" && currentUrl && (
                <p className="mb-2 font-body text-xs text-olive-500">
                  {t.content.fileExists}
                </p>
              )}

              <input
                type="file"
                accept={upload.accept}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setFiles((prev) => ({ ...prev, [upload.key]: file ?? undefined }));
                }}
                className="font-body text-sm"
              />

              {selected && (
                <p className="mt-2 font-body text-[11px] text-olive-500">
                  {t.content.fileChosen}: {selected.name} — {t.content.fileChosenNote}
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
          className="rounded-full bg-olive-700 px-8 py-3 text-sm tracking-wide text-cream transition-colors hover:bg-olive-800 disabled:opacity-50"
        >
          {saving ? t.common.saving : t.common.save}
        </button>
        {message && <p className="font-body text-sm text-olive-600">{message}</p>}
      </div>
    </div>
  );
}
