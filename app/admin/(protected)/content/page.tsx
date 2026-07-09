import { getSiteContent } from "@/lib/content";
import ContentForm from "@/components/admin/ContentForm";
import { getAdminLocaleAndDict } from "@/lib/i18n/admin-server";

export const dynamic = "force-dynamic";

export default async function ContentAdminPage() {
  const [content, { t }] = await Promise.all([
    getSiteContent(),
    getAdminLocaleAndDict(),
  ]);

  if (!content) {
    return <p className="font-body text-rust">{t.common.error}</p>;
  }

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-olive-800">{t.content.title}</h1>
      <ContentForm initial={content} t={t} />
    </div>
  );
}
