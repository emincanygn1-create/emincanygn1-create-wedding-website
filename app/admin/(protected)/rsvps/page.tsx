import { getRsvps } from "@/lib/content";
import RsvpTable from "@/components/admin/RsvpTable";

export const dynamic = "force-dynamic";

export default async function RsvpAdminPage() {
  const rsvps = await getRsvps();

  return (
    <div>
      <h1 className="font-display text-3xl text-olive-800 mb-2">Katılım Cevapları</h1>
      <p className="font-body text-olive-500 text-sm mb-8">
        Misafirlerinin gönderdiği katılım bildirimleri. Listeyi Excel&apos;de açmak için
        CSV olarak indirebilirsin.
      </p>
      <RsvpTable initialRsvps={rsvps} />
    </div>
  );
}
