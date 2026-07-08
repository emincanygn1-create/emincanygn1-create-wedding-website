import Cover from "@/components/Cover";
import CoupleInfo from "@/components/CoupleInfo";
import SectionDivider from "@/components/SectionDivider";
import CountdownSection from "@/components/CountdownSection";
import EventDetails from "@/components/EventDetails";
import Gallery from "@/components/Gallery";
import VideoSection from "@/components/VideoSection";
import Quote from "@/components/Quote";
import Wishes from "@/components/Wishes";
import GiftInfo from "@/components/GiftInfo";
import Footer from "@/components/Footer";
import { getSiteContent, getGalleryPhotos } from "@/lib/content";
import { formatDateTr } from "@/lib/formatDate";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getSiteContent();
  const photos = await getGalleryPhotos();

  const dateText = formatDateTr(content?.wedding_date);

  return (
    <main>
      <Cover
        brideName={content?.bride_name || "İsim"}
        groomName={content?.groom_name || "İsim"}
        dateText={dateText}
        city={content?.wedding_city || ""}
      />
      <CoupleInfo
        brideName={content?.bride_name || "İsim Soyisim"}
        groomName={content?.groom_name || "İsim Soyisim"}
        brideParents={content?.bride_parents || ""}
        groomParents={content?.groom_parents || ""}
        bridePhotoUrl={content?.bride_photo_url || null}
        groomPhotoUrl={content?.groom_photo_url || null}
      />
      <SectionDivider />
      <CountdownSection weddingDate={content?.wedding_date || new Date().toISOString()} />
      <EventDetails
        ceremony={{
          venue: content?.ceremony_venue || "[Nikah Salonu Adı]",
          dateText: content?.ceremony_date_text || "[Gün, Tarih]",
          timeText: content?.ceremony_time_text || "[Saat]",
          address: content?.ceremony_address || "[Adres]",
          mapUrl: content?.ceremony_map_url || "",
        }}
        reception={{
          venue: content?.reception_venue || "[Düğün Salonu Adı]",
          dateText: content?.reception_date_text || "[Gün, Tarih]",
          timeText: content?.reception_time_text || "[Saat]",
          address: content?.reception_address || "[Adres]",
          mapUrl: content?.reception_map_url || "",
        }}
      />
      <SectionDivider />
      <Gallery photos={photos} />
      <VideoSection videoUrl={content?.video_url || null} />
      <Quote text={content?.quote_text || ""} />
      <Wishes />
      <SectionDivider />
      <GiftInfo
        accountName={content?.gift_account_name || ""}
        iban={content?.gift_iban || ""}
      />
      <Footer
        brideName={content?.bride_name || "İsim"}
        groomName={content?.groom_name || "İsim"}
        dateText={dateText}
        city={content?.wedding_city || ""}
      />
    </main>
  );
}
