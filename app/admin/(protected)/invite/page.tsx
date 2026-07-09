import { getSiteContent } from "@/lib/content";
import InviteLinkBuilder from "@/components/admin/InviteLinkBuilder";
import { getAdminLocaleAndDict } from "@/lib/i18n/admin-server";

export const dynamic = "force-dynamic";

export default async function InvitePage() {
  const [content, { t }] = await Promise.all([
    getSiteContent(),
    getAdminLocaleAndDict(),
  ]);

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl text-olive-800">{t.invite.title}</h1>
      <p className="mb-8 max-w-xl font-body text-sm text-olive-500">{t.invite.intro}</p>
      <InviteLinkBuilder
        brideName={content?.bride_name ?? ""}
        groomName={content?.groom_name ?? ""}
        t={t}
      />
    </div>
  );
}
