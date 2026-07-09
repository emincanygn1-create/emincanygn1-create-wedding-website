import { cookies } from "next/headers";
import {
  ADMIN_LOCALE_COOKIE,
  getAdminDictionary,
  isAdminLocale,
  type AdminDict,
  type AdminLocale,
} from "./admin";

/**
 * Sunucu bileşenlerinde panel dilini ve sözlüğünü verir.
 * next/headers sadece sunucuda çalıştığı için ayrı dosyada duruyor.
 */
export async function getAdminLocaleAndDict(): Promise<{
  locale: AdminLocale;
  t: AdminDict;
}> {
  const store = await cookies();
  const value = store.get(ADMIN_LOCALE_COOKIE)?.value;
  const locale: AdminLocale = isAdminLocale(value) ? value : "tr";
  return { locale, t: getAdminDictionary(locale) };
}
