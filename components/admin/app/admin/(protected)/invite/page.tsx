import { getSiteContent } from "@/lib/content";
import InviteLinkBuilder from "@/components/admin/InviteLinkBuilder";

export const dynamic = "force-dynamic";

export default async function InvitePage() {
  const content = await getSiteContent();

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl text-olive-800">Davetiye Linki</h1>
      <p className="mb-8 max-w-xl font-body text-sm text-olive-500">
        Her misafir için ismine özel bir link üret. Davetiyeyi açtığında kapakta
        &quot;Sayın Ahmet Bey&quot; yazar. İsim boş bırakılırsa &quot;Değerli
        Misafirimiz&quot; görünür.
      </p>
      <InviteLinkBuilder
        brideName={content?.bride_name ?? ""}
        groomName={content?.groom_name ?? ""}
      />
    </div>
  );
}
