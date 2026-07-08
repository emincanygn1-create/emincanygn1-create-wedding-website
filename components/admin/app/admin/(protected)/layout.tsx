import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/admin/LogoutButton";

const NAV = [
  { href: "/admin", label: "Genel Bakış" },
  { href: "/admin/content", label: "Site İçeriği" },
  { href: "/admin/gallery", label: "Galeri" },
  { href: "/admin/invite", label: "Davetiye Linki" },
  { href: "/admin/rsvps", label: "Katılımlar" },
  { href: "/admin/wishes", label: "Dilekler" },
  { href: "/admin/moments", label: "Misafir Fotoğrafları" },
];

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

  return (
    <div className="min-h-screen bg-cream flex flex-col sm:flex-row">
      <aside className="w-full sm:w-60 bg-olive-800 text-cream p-6 flex flex-col gap-6 sm:min-h-screen">
        <p className="font-display text-xl">Yönetim Paneli</p>
        <nav className="flex-1 flex flex-wrap sm:flex-col gap-2 font-body text-sm">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block py-2 px-3 rounded-lg hover:bg-olive-700 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <LogoutButton />
      </aside>
      <div className="flex-1 p-6 sm:p-10">{children}</div>
    </div>
  );
}
