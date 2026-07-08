import type { Locale } from "@/lib/i18n/config";
import type { SiteContent, TranslatableField } from "@/lib/types";

/**
 * Seçili dildeki metni döndürür.
 * Çeviri boşsa otomatik olarak Türkçesine düşer.
 */
export function lz(
  content: SiteContent | null | undefined,
  field: TranslatableField,
  locale: Locale
): string {
  if (!content) return "";

  const base = (content[field] as string | null) ?? "";

  if (locale === "tr") return base;

  const key = `${field}_${locale}` as keyof SiteContent;
  const translated = (content[key] as string | null) ?? "";

  return translated.trim() ? translated : base;
}
