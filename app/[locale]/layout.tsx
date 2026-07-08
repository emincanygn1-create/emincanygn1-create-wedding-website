import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  return <>{children}</>;
}
