import { getSiteContent } from "@/lib/content";
import ContentForm from "@/components/admin/ContentForm";

export const dynamic = "force-dynamic";

export default async function ContentAdminPage() {
  const content = await getSiteContent();

  if (!content) {
    return (
      <p className="font-body text-rust">
        İçerik yüklenemedi. Supabase bağlantısını kontrol et (Adım 3&apos;teki SQL
        script&apos;i çalıştırdığından emin ol).
      </p>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-olive-800 mb-2">Site İçeriği</h1>
      <p className="font-body text-olive-500 text-sm mb-8">
        Buradaki bilgiler, kaydettiğin anda sitenin tamamına yansır.
      </p>
      <ContentForm initial={content} />
    </div>
  );
}
