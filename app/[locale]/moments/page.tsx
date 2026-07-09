import MomentsFeed from "@/components/moments/MomentsFeed";
import { getGuestPhotos, getSiteContent } from "@/lib/content";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default async function MomentsPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const d = getDictionary(locale);

  const [photos, content] = await Promise.all([getGuestPhotos(), getSiteContent()]);

  return (
    <MomentsFeed
      initialPhotos={photos}
      uploadsEnabled={content?.uploads_enabled ?? false}
      d={d}
      locale={locale}
    />
  );
}
