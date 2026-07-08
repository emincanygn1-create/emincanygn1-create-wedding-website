import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import {
  defaultLocale,
  countryToLocale,
  isLocale,
  type Locale,
} from "@/lib/i18n/config";

const LOCALE_COOKIE = "NEXT_LOCALE";
const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Dil tespiti sırası:
 *  1) Daha önce elle seçilmiş dil (çerez)
 *  2) Bağlanılan konum (Vercel'in ülke başlığı)
 *  3) Tarayıcı dili
 *  4) Varsayılan: Türkçe
 */
function detectLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry");
  if (country) {
    const byCountry = countryToLocale[country.toUpperCase()];
    if (byCountry) return byCountry;
    // Listede olmayan her ülke İngilizce görsün.
    return "en";
  }

  const acceptLanguage = request.headers.get("accept-language") ?? "";
  for (const chunk of acceptLanguage.split(",")) {
    const code = chunk.split(";")[0].trim().slice(0, 2).toLowerCase();
    if (isLocale(code)) return code;
  }

  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Yönetim paneli çok dilli değil, sadece oturum kontrolü yapılır.
  if (pathname.startsWith("/admin")) {
    return updateSession(request);
  }

  const segments = pathname.split("/");
  const maybeLocale = segments[1];

  // URL zaten /tr, /en veya /it ile başlıyorsa dokunma.
  if (isLocale(maybeLocale)) {
    const headers = new Headers(request.headers);
    headers.set("x-locale", maybeLocale);

    const response = NextResponse.next({ request: { headers } });
    response.cookies.set(LOCALE_COOKIE, maybeLocale, {
      path: "/",
      maxAge: ONE_YEAR,
      sameSite: "lax",
    });
    return response;
  }

  // Dil öneki yoksa doğru dile yönlendir.
  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.redirect(url);
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: [
    /*
     * Şunlar hariç her yol:
     * - /_next (Next.js dosyaları)
     * - içinde nokta olan her şey (favicon.ico, resimler, vs.)
     */
    "/((?!_next|.*\\..*).*)",
  ],
};
