"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import ErrorScreen from "@/components/ErrorScreen";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const raw = typeof params?.locale === "string" ? params.locale : undefined;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const d = getDictionary(locale);

  useEffect(() => {
    console.error("Sayfa hatası:", error);
  }, [error]);

  return (
    <ErrorScreen
      title={d.error.title}
      text={d.error.text}
      retryLabel={d.error.retry}
      homeLabel={d.error.home}
      homeHref={`/${locale}`}
      onRetry={reset}
    />
  );
}
