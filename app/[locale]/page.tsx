import type { Metadata } from "next";
import type { ReactNode } from "react";

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
import WishesHighlight from "@/components/WishesHighlight";
import MomentsCta from "@/components/MomentsCta";
import GiftInfo from "@/components/GiftInfo";
import StorySection from "@/components/StorySection";
import Faq from "@/components/Faq";
import Closing from "@/components/Closing";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import StickyNav from "@/components/StickyNav";
import MusicPlayer from "@/components/MusicPlayer";

import {
  getSiteContent,
  getGalleryPhotos,
  getTopWishes,
  getWishCount,
  getGuestPhotos,
  getStoryPosts,
  getFaqs,
} from "@/lib/content";
import { formatDate } from "@/lib/formatDate";
import { lz } from "@/lib/localize";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import {
  assignTones,
  normalizeSections,
  toneClass,
  type SectionKey,
} from "@/lib/sections";
import { locales } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

/** Tarayıcı sekmesi ve link paylaşım önizlemesi. */
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const content = await getSiteContent();

  const names = `${content?.bride_name ?? ""} & ${content?.groom_name ?? ""}`.trim();
  const customTitle = lz(content, "site_title", locale);
  const customDescription = lz(content, "site_description", locale);

  const dateText = formatDate(content?.wedding_date, locale);
  const city = lz(content, "wedding_city", locale);

  const title = customTitle || (names.length > 3 ? names : "Wedding");
  const description =
    customDescription || [dateText, city].filter(Boolean).join(" · ");
  const image = content?.cover_photo_url ?? undefined;

  const languages = Object.fromEntries(
    locales.map((code) => [code, `/${code}`])
  );

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages,
    },
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

  const [content, photos, topWishes, wishCount, guestPhotos, storyPosts, faqs] =
    await Promise.all([
      getSiteContent(),
      getGalleryPhotos(),
      getTopWishes(3),
      getWishCount(),
      getGuestPhotos(4),
      getStoryPosts(),
      getFaqs(),
    ]);

  const dateText = formatDate(content?.wedding_date, locale);
  const city = lz(content, "wedding_city", locale);
  const brideName = content?.bride_name || "İsim";
  const groomName = content?.groom_name || "İsim";
  const coverEyebrow = lz(content, "cover_eyebrow", locale);
  const gateEnabled = content?.gate_enabled ?? false;

  const guestName = (searchParams?.to ?? "").toString().slice(0, 60);

  const receptionVenue = lz(content, "reception_venue", locale);
  const receptionAddress = lz(content, "reception_address", locale);

  // Katılım formu: panelden kapatılmış veya son tarihi geçmiş olabilir.
  const deadline = content?.rsvp_deadline ? new Date(content.rsvp_deadline) : null;
  const deadlinePassed = deadline ? Date.now() > deadline.getTime() : false;
  const rsvpOpen = (content?.rsvp_enabled ?? true) && !deadlinePassed;
  const deadlineText = deadline ? formatDate(content?.rsvp_deadline, locale) : "";

  // Panelden ayarlanan bölüm sırası ve görünürlüğü.
  const sections = normalizeSections(content?.section_config);

  /**
   * İçeriği olmayan bölümler hiç render edilmiyor (bileşen null dönüyor).
   * Bunları sıradan da çıkarmak gerekiyor, yoksa boş bir renk şeridi
   * bırakıyor ve renk sırasını kaydırıyorlar.
   */
  const rendersSomething: Record<SectionKey, boolean> = {
    couple: true,
    story: true,
    countdown: true,
    event: true,
    gallery: true,
    video: Boolean(content?.video_url),
    quote: Boolean(lz(content, "quote_text", locale)),
    moments: true,
    rsvp: true,
    wishes: true,
    faq: true,
    gift: Boolean(content?.gift_iban),
    closing: true,
  };

  const visibleSections = sections.filter(
    (section) => section.visible && rendersSomething[section.key]
  );

  // Arka plan renkleri bölümün kendisinden değil, sıradaki yerinden gelir.
  const tones = assignTones(visibleSections);

  const blocks: Record<SectionKey, ReactNode> = {
    couple: (
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
    ),
    story: (
      <StorySection
        posts={storyPosts.slice(0, 3)}
        totalCount={storyPosts.length}
        d={d}
        locale={locale}
      />
    ),
    countdown: (
      <CountdownSection
        weddingDate={content?.wedding_date || new Date().toISOString()}
        calendarTitle={`${brideName} & ${groomName}`}
        calendarLocation={[receptionVenue, receptionAddress].filter(Boolean).join(", ")}
        backgroundUrl={content?.countdown_bg_url || null}
        d={d}
      />
    ),
    event: (
      <EventDetails
        ceremony={{
          venue: lz(content, "ceremony_venue", locale),
          dateText: lz(content, "ceremony_date_text", locale),
          timeText: lz(content, "ceremony_time_text", locale),
          address: lz(content, "ceremony_address", locale),
          mapUrl: content?.ceremony_map_url || "",
          photoUrl: content?.ceremony_photo_url || null,
        }}
        reception={{
          venue: receptionVenue,
          dateText: lz(content, "reception_date_text", locale),
          timeText: lz(content, "reception_time_text", locale),
          address: receptionAddress,
          mapUrl: content?.reception_map_url || "",
          photoUrl: content?.reception_photo_url || null,
        }}
        singleEvent={content?.single_event ?? false}
        d={d}
      />
    ),
    gallery: <Gallery photos={photos} d={d} />,
    video: <VideoSection videoUrl={content?.video_url || null} d={d} />,
    quote: (
      <Quote
        text={lz(content, "quote_text", locale)}
        backgroundUrl={content?.quote_bg_url || null}
      />
    ),
    moments: <MomentsCta d={d} locale={locale} previewPhotos={guestPhotos} />,
    rsvp: (
      <Rsvp
        d={d}
        locale={locale}
        open={rsvpOpen}
        closedMessage={lz(content, "rsvp_closed_message", locale)}
        deadlineText={deadlineText}
      />
    ),
    wishes: (
      <WishesHighlight
        topWishes={topWishes}
        totalCount={wishCount}
        d={d}
        locale={locale}
      />
    ),
    faq: <Faq items={faqs} d={d} locale={locale} />,
    gift: (
      <GiftInfo
        accountName={content?.gift_account_name || ""}
        iban={content?.gift_iban || ""}
        d={d}
      />
    ),
    closing: (
      <Closing
        brideName={brideName}
        groomName={groomName}
        eyebrow={lz(content, "closing_eyebrow", locale)}
        title={lz(content, "closing_title", locale)}
        text={lz(content, "closing_text", locale)}
        seeYou={lz(content, "closing_seeyou", locale)}
        backgroundUrl={content?.closing_bg_url || null}
        d={d}
      />
    ),
  };

  return (
    <main>
      <Preloader brideName={brideName} groomName={groomName} />

      {gateEnabled && (
        <>
          <Celebration />
          <InvitationGate
            brideName={brideName}
            groomName={groomName}
            dateText={dateText}
            guestName={guestName}
            coverPhotoUrl={content?.cover_photo_url || null}
            coverVideoUrl={content?.cover_video_url || null}
            eyebrow={coverEyebrow}
            d={d}
            locale={locale}
          />
        </>
      )}

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
        eyebrow={coverEyebrow}
        gateEnabled={gateEnabled}
        d={d}
        locale={locale}
      />

      {visibleSections.map((section, i) => {
        const previous = i > 0 ? tones[i - 1] : null;

        // Açık iki ton arasında ince bir ayırıcı çizgi.
        // Koyu bölümlerin kenarına gerek yok, kontrast zaten var.
        const divider =
          previous && previous !== "dark" && tones[i] !== "dark"
            ? "border-t border-olive-200/70"
            : "";

        return (
          <div
            key={section.key}
            className={`${toneClass(tones[i])} ${divider}`}
          >
            {blocks[section.key]}
          </div>
        );
      })}

      <Footer />
    </main>
  );
}
