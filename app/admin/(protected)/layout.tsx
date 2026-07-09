import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/admin/LogoutButton";
import AdminLanguageSwitcher from "@/components/admin/AdminLanguageSwitcher";
import { getAdminLocaleAndDict } from "@/lib/i18n/admin-server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { locale, t } = await getAdminLocaleAndDict();

  const nav = [
    { href: "/admin", label: t.nav.overview },
    { href: "/admin/content", label: t.nav.content },
    { href: "/admin/gallery", label: t.nav.gallery },
    { href: "/admin/invite", label: t.nav.invite },
    { href: "/admin/rsvps", label: t.nav.rsvps },
    { href: "/admin/wishes", label: t.nav.wishes },
    { href: "/admin/moments", label: t.nav.moments },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-cream sm:flex-row">
      <aside className="flex w-full flex-col gap-6 bg-olive-800 p-6 text-cream sm:min-h-screen sm:w-60">
        <p className="font-display text-xl">{t.nav.title}</p>

        <nav className="flex flex-1 flex-wrap gap-2 font-body text-sm sm:flex-col">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 transition-colors hover:bg-olive-700"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <AdminLanguageSwitcher current={locale} label={t.nav.language} />
        <LogoutButton label={t.nav.logout} />
      </aside>

      <div className="flex-1 p-6 sm:p-10">{children}</div>
    </div>
  );
}
