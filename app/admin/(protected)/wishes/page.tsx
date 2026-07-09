import { getWishes } from "@/lib/content";
import WishesManager from "@/components/admin/WishesManager";
import { getAdminLocaleAndDict } from "@/lib/i18n/admin-server";

export const dynamic = "force-dynamic";

export default async function WishesAdminPage() {
  const [wishes, { t }] = await Promise.all([getWishes(), getAdminLocaleAndDict()]);

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl text-olive-800">{t.wishes.title}</h1>
      <p className="mb-8 font-body text-sm text-olive-500">{t.wishes.intro}</p>
      <WishesManager initialWishes={wishes} t={t} />
    </div>
  );
}
