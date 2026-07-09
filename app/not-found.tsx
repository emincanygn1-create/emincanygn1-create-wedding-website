import Link from "next/link";
import { cookies } from "next/headers";
import { OrnamentDivider } from "@/components/Ornament";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

export default async function NotFound() {
  const store = await cookies();
  const cookieLocale = store.get("NEXT_LOCALE")?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;
  const d = getDictionary(locale);

  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center bg-olive-900 px-6 text-center text-cream">
      <p className="font-script text-7xl text-gold-light">404</p>

      <OrnamentDivider className="mx-auto my-8 h-8 w-40 text-gold-light/60" />

      <h1 className="mb-4 font-display text-3xl">{d.notFound.title}</h1>
      <p className="mb-10 max-w-sm font-body text-sm leading-relaxed text-cream/70">
        {d.notFound.text}
      </p>

      <Link
        href={`/${locale}`}
        className="press rounded-full border border-gold bg-gold/10 px-8 py-3.5 text-xs uppercase tracking-[0.25em] text-cream transition-colors hover:bg-gold hover:text-olive-900"
      >
        {d.notFound.home}
      </Link>
    </main>
  );
}
