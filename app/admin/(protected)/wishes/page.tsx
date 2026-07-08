import { getWishes } from "@/lib/content";
import WishesManager from "@/components/admin/WishesManager";

export const dynamic = "force-dynamic";

export default async function WishesAdminPage() {
  const wishes = await getWishes();

  return (
    <div>
      <h1 className="font-display text-3xl text-olive-800 mb-2">Dilekler</h1>
      <p className="font-body text-olive-500 text-sm mb-8">
        Uygunsuz bir mesaj gelirse gizleyebilir veya tamamen silebilirsin. Gizlenen
        mesajlar sitede görünmez.
      </p>
      <WishesManager initialWishes={wishes} />
    </div>
  );
}
