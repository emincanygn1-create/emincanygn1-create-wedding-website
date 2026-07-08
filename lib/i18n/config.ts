export const locales = ["tr", "en", "it"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

export const localeNames: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  it: "Italiano",
};

export const localeShort: Record<Locale, string> = {
  tr: "TR",
  en: "EN",
  it: "IT",
};

/** Ülke koduna göre otomatik dil seçimi. Listede olmayan ülkeler İngilizce görür. */
export const countryToLocale: Record<string, Locale> = {
  TR: "tr",
  IT: "it",
  CH: "it", // İsviçre'nin İtalyanca konuşulan bölgeleri
  SM: "it", // San Marino
  VA: "it", // Vatikan
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export const dateLocaleTag: Record<Locale, string> = {
  tr: "tr-TR",
  en: "en-GB",
  it: "it-IT",
};
