import Cover from "@/components/Cover";
import CoupleInfo from "@/components/CoupleInfo";
import SectionDivider from "@/components/SectionDivider";
import CountdownSection from "@/components/CountdownSection";
import EventDetails from "@/components/EventDetails";
import Gallery from "@/components/Gallery";
import VideoSection from "@/components/VideoSection";
import Quote from "@/components/Quote";
import Rsvp from "@/components/Rsvp";
import Wishes from "@/components/Wishes";
import MomentsCta from "@/components/MomentsCta";
import GiftInfo from "@/components/GiftInfo";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import StickyNav from "@/components/StickyNav";

import {
  getSiteContent,
  getGalleryPhotos,
  getWishes,
  getGuestPhotos,
} from "@/lib/content";
import { formatDate } from "@/lib/formatDate";
import { lz } from "@/lib/localize";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default async function Home({
  params,
}: {
  params: { locale: string };
}) {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const d = getDictionary(locale);

  const [content, photos, wishes, guestPhotos] = await Promise.all([
    getSiteContent(),
    getGalleryPhotos(),
    getWishes(),
    getGuestPhotos(),
  ]);

  const dateText = formatDate(content?.wedding_date, locale);
  const city = lz(content, "wedding_city", locale);

  return (
    <main>
      <ScrollProgress />
      <StickyNav d={d} locale={locale} />

      <Cover
        brideName={content?.bride_name || "İsim"}
        groomName={content?.groom_name || "İsim"}
        dateText={dateText}
        city={city}
        d={d}
        locale={locale}
      />

      <CoupleInfo
        brideName={content?.bride_name || "İsim Soyisim"}
        groomName={content?.groom_name || "İsim Soyisim"}
        brideParents={lz(content, "bride_parents", locale)}
        groomParents={lz(content, "groom_parents", locale)}
        bridePhotoUrl={content?.bride_photo_url || null}
        groomPhotoUrl={content?.groom_photo_url || null}
        d={d}
      />

      <SectionDivider />

      <CountdownSection
        weddingDate={content?.wedding_date || new Date().toISOString()}
        d={d}
      />

      <EventDetails
        ceremony={{
          venue: lz(content, "ceremony_venue", locale),
          dateText: lz(content, "ceremony_date_text", locale),
          timeText: lz(content, "ceremony_time_text", locale),
          address: lz(content, "ceremony_address", locale),
          mapUrl: content?.ceremony_map_url || "",
        }}
        reception={{
          venue: lz(content, "reception_venue", locale),
          dateText: lz(content, "reception_date_text", locale),
          timeText: lz(content, "reception_time_text", locale),
          address: lz(content, "reception_address", locale),
          mapUrl: content?.reception_map_url || "",
        }}
        d={d}
      />

      <SectionDivider />

      <Gallery photos={photos} d={d} />

      <VideoSection videoUrl={content?.video_url || null} d={d} />

      <Quote text={lz(content, "quote_text", locale)} />

      <MomentsCta d={d} locale={locale} previewPhotos={guestPhotos} />

      <Rsvp d={d} locale={locale} />

      <SectionDivider />

      <Wishes initialWishes={wishes} d={d} locale={locale} />

      <SectionDivider />

      <GiftInfo
        accountName={content?.gift_account_name || ""}
        iban={content?.gift_iban || ""}
        d={d}
      />

      <Footer
        brideName={content?.bride_name || "İsim"}
        groomName={content?.groom_name || "İsim"}
        dateText={dateText}
        city={city}
        d={d}
      />
    </main>
  );
}
