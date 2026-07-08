import Cover from "@/components/Cover";
import CoupleInfo from "@/components/CoupleInfo";
import SectionDivider from "@/components/SectionDivider";
import CountdownSection from "@/components/CountdownSection";
import EventDetails from "@/components/EventDetails";
import Gallery from "@/components/Gallery";
import Quote from "@/components/Quote";
import Wishes from "@/components/Wishes";
import GiftInfo from "@/components/GiftInfo";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Cover />
      <CoupleInfo />
      <SectionDivider />
      <CountdownSection />
      <EventDetails />
      <SectionDivider />
      <Gallery />
      <Quote />
      <Wishes />
      <SectionDivider />
      <GiftInfo />
      <Footer />
    </main>
  );
}
