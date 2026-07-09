import { getFaqs } from "@/lib/content";
import FaqManager from "@/components/admin/FaqManager";
import { getAdminLocaleAndDict } from "@/lib/i18n/admin-server";

export const dynamic = "force-dynamic";

export default async function FaqAdminPage() {
  const [faqs, { t }] = await Promise.all([getFaqs(), getAdminLocaleAndDict()]);

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl text-olive-800">{t.faq.title}</h1>
      <p className="mb-8 max-w-2xl font-body text-sm text-olive-500">{t.faq.intro}</p>
      <FaqManager initialFaqs={faqs} t={t} />
    </div>
  );
}
