import type { Metadata } from "next";
import Preloader from "@/components/Preloader";
import Celebration from "@/components/Celebration";
import InvitationGate from "@/components/InvitationGate";
import Cover from "@/components/Cover";
import CoupleInfo from "@/components/CoupleInfo";
import CountdownSection from "@/components/CountdownSection";
import EventDetails from "@/components/EventDetails";
import Gallery from "@/components/Gallery";
import VideoSection from "@/components/VideoSection";
import Quote from "@/components/Quote";
import Rsvp from "@/components/Rsvp";
import Wishes from "@/components/Wishes";
import MomentsCta from "@/components/MomentsCta";
import GiftInfo from "@/components/GiftInfo";
import Closing from "@/components/Closing";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import StickyNav from "@/components/StickyNav";
import MusicPlayer from "@/components/MusicPlayer";

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

/** WhatsApp veya Instagram'da link paylaşılınca çıkan önizleme. */
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const content = await getSiteContent();

  const names = `${content?.bride_name ?? ""} & ${content?.groom_name ?? ""}`.trim();
  const dateText = formatDate(content?.wedding_date, locale);
  const city = lz(content, "wedding_city", locale);
  const d = getDictionary(locale);

  const title = names.length > 3 ? `${names} | ${d.cover.theWeddingOf}` : d.cover.theWeddingOf;
  const description = [dateText, city].filter(Boolean).join(" · ");
  const image = content?.cover_photo_url ?? undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function Home({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { to?: string };
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
  const brideName = content?.bride_name || "İsim";
  const groomName = content?.groom_name || "İsim";

  // Davetiyeye ?to=Ahmet%20Bey şeklinde misafir adı eklenebilir.
  const guestName = (searchParams?.to ?? "").toString().slice(0, 60);

  const receptionVenue = lz(content, "reception_venue", locale);
  const receptionAddress = lz(content, "reception_address", locale);

  // Katılım formu: panelden kapatılmış olabilir ya da son tarihi geçmiş olabilir.
  const deadline = content?.rsvp_deadline ? new Date(content.rsvp_deadline) : null;
  const deadlinePassed = deadline ? Date.now() > deadline.getTime() : false;
  const rsvpOpen = (content?.rsvp_enabled ?? true) && !deadlinePassed;
  const deadlineText = deadline ? formatDate(content?.rsvp_deadline, locale) : "";

  return (
    <main>
      <Preloader brideName={brideName} groomName={groomName} />
      <Celebration />

      <InvitationGate
        brideName={brideName}
        groomName={groomName}
        dateText={dateText}
        guestName={guestName}
        coverPhotoUrl={content?.cover_photo_url || null}
        coverVideoUrl={content?.cover_video_url || null}
        d={d}
        locale={locale}
      />

      <MusicPlayer src={content?.music_url || null} d={d} />
      <ScrollProgress />
      <StickyNav d={d} locale={locale} />

      <Cover
        brideName={brideName}
        groomName={groomName}
        dateText={dateText}
        city={city}
        coverPhotoUrl={content?.cover_photo_url || null}
        coverVideoUrl={content?.cover_video_url || null}
        d={d}
        locale={locale}
      />

      <CoupleInfo
        brideName={brideName}
        groomName={groomName}
        brideParents={lz(content, "bride_parents", locale)}
        groomParents={lz(content, "groom_parents", locale)}
        bridePhotoUrl={content?.bride_photo_url || null}
        groomPhotoUrl={content?.groom_photo_url || null}
        brideInstagram={content?.bride_instagram || ""}
        groomInstagram={content?.groom_instagram || ""}
        d={d}
      />

      <CountdownSection
        weddingDate={content?.wedding_date || new Date().toISOString()}
        calendarTitle={`${brideName} & ${groomName}`}
        calendarLocation={[receptionVenue, receptionAddress].filter(Boolean).join(", ")}
        backgroundUrl={photos[2]?.url || null}
        d={d}
      />

      <EventDetails
        ceremony={{
          venue: lz(content, "ceremony_venue", locale),
          dateText: lz(content, "ceremony_date_text", locale),
          timeText: lz(content, "ceremony_time_text", locale),
          address: lz(content, "ceremony_address", locale),
          mapUrl: content?.ceremony_map_url || "",
          photoUrl: photos[0]?.url || null,
        }}
        reception={{
          venue: receptionVenue,
          dateText: lz(content, "reception_date_text", locale),
          timeText: lz(content, "reception_time_text", locale),
          address: receptionAddress,
          mapUrl: content?.reception_map_url || "",
          photoUrl: photos[1]?.url || null,
        }}
        d={d}
      />

      <Gallery photos={photos} d={d} />

      <VideoSection videoUrl={content?.video_url || null} d={d} />

      <Quote
        text={lz(content, "quote_text", locale)}
        backgroundUrl={content?.quote_bg_url || null}
      />

      <MomentsCta d={d} locale={locale} previewPhotos={guestPhotos} />

      <Rsvp
        d={d}
        locale={locale}
        open={rsvpOpen}
        closedMessage={lz(content, "rsvp_closed_message", locale)}
        deadlineText={deadlineText}
      />

      <Wishes initialWishes={wishes} d={d} locale={locale} />

      <GiftInfo
        accountName={content?.gift_account_name || ""}
        iban={content?.gift_iban || ""}
        d={d}
      />

      <Closing
        brideName={brideName}
        groomName={groomName}
        text={lz(content, "closing_text", locale)}
        backgroundUrl={content?.closing_bg_url || null}
        d={d}
      />

      <Footer />
    </main>
  );
}
