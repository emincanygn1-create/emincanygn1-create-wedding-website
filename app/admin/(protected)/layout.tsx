import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/admin/LogoutButton";

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
      <aside className="w-full sm:w-56 bg-olive-800 text-cream p-6 flex sm:flex-col gap-6 sm:gap-2 items-center sm:items-stretch">
        <p className="font-display text-xl">Yönetim Paneli</p>
        <nav className="flex-1 flex sm:flex-col gap-2 font-body text-sm">
          <a href="/admin" className="block py-2 px-3 rounded-lg bg-olive-700">
            Genel Bakış
          </a>
        </nav>
        <LogoutButton />
      </aside>
      <div className="flex-1 p-6 sm:p-10">{children}</div>
    </div>
  );
}
