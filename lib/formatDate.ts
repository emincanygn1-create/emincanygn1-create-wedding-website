import { dateLocaleTag, type Locale } from "@/lib/i18n/config";

export function formatDate(iso: string | null | undefined, locale: Locale) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat(dateLocaleTag[locale], {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function formatDateTime(iso: string | null | undefined, locale: Locale = "tr") {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat(dateLocaleTag[locale], {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

/** Geriye dönük uyumluluk için. */
export function formatDateTr(iso: string | null | undefined) {
  return formatDate(iso, "tr");
}
