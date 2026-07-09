export const SECTION_KEYS = [
  "couple",
  "countdown",
  "event",
  "gallery",
  "video",
  "quote",
  "moments",
  "rsvp",
  "wishes",
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
