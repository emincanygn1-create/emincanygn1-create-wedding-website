"use client";

import { useEffect } from "react";
import ErrorScreen from "@/components/ErrorScreen";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Beklenmedik hata:", error);
  }, [error]);

  return (
    <ErrorScreen
      title="Bir Şeyler Ters Gitti"
      text="Beklenmedik bir hata oluştu. Sayfayı yenilemeyi deneyin."
      retryLabel="Tekrar dene"
      homeLabel="Ana sayfaya dön"
      homeHref="/"
      onRetry={reset}
    />
  );
}
