import WishesBoard from "@/components/WishesBoard";
import { getWishes } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default async function WishesPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const d = getDictionary(locale);
  const wishes = await getWishes();

  return <WishesBoard initialWishes={wishes} d={d} locale={locale} />;
}
