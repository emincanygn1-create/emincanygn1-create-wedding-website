export const SECTION_KEYS = [
  "couple",
  "story",
  "countdown",
  "event",
  "gallery",
  "video",
  "quote",
  "moments",
  "rsvp",
  "wishes",
  "faq",
  "gift",
  "closing",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export type SectionSetting = {
  key: SectionKey;
  visible: boolean;
};

export const DEFAULT_SECTIONS: SectionSetting[] = SECTION_KEYS.map((key) => ({
  key,
  visible: true,
}));

function isSectionKey(value: unknown): value is SectionKey {
  return (
    typeof value === "string" &&
    (SECTION_KEYS as readonly string[]).includes(value)
  );
}

/**
 * Panelden gelen ayarı güvenli hale getirir:
 * bilinmeyen anahtarları atar, eksik bölümleri sona ekler.
 */
export function normalizeSections(raw: unknown): SectionSetting[] {
  if (!Array.isArray(raw)) return DEFAULT_SECTIONS;

  const seen = new Set<SectionKey>();
  const result: SectionSetting[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const key = (item as { key?: unknown }).key;
    if (!isSectionKey(key) || seen.has(key)) continue;

    seen.add(key);
    result.push({
      key,
      visible: (item as { visible?: unknown }).visible !== false,
    });
  }

  for (const key of SECTION_KEYS) {
    if (!seen.has(key)) result.push({ key, visible: true });
  }

  return result;
}

/**
 * Koyu zeminli bölümler. Bunların kendi arka planı (fotoğraf + koyu katman)
 * ve açık renkli yazısı var, sıradan bağımsız olarak hep koyu kalırlar.
 */
export const DARK_SECTIONS = new Set<SectionKey>(["quote", "moments", "closing"]);

export type SectionTone = "light" | "muted" | "dark";

/**
 * Krem #FAF6EC, açık zeytin #E8ECDF.
 * Opaklık KULLANMA: %60 açık zeytin, kremin üstünde #EFF0E4 ediyor
 * ve iki renk birbirinden ayırt edilemiyor.
 */
const TONE_CLASS: Record<SectionTone, string> = {
  light: "bg-cream",
  muted: "bg-olive-100",
  dark: "",
};

export function toneClass(tone: SectionTone) {
  return TONE_CLASS[tone];
}

/**
 * Görünen bölümlere sırayla renk dağıtır: krem, açık yeşil, krem...
 * Koyu bölümler sıraya karışmaz, aradan geçerler.
 *
 * Böylece panelden sırayı değiştirince renkler kendini yeniden düzenler;
 * iki aynı renk asla yan yana gelmez.
 */
export function assignTones(visible: SectionSetting[]): SectionTone[] {
  let light = true;

  return visible.map((section) => {
    if (DARK_SECTIONS.has(section.key)) return "dark";

    const tone: SectionTone = light ? "light" : "muted";
    light = !light;
    return tone;
  });
}
