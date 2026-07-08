import { createClient } from "@/lib/supabase/server";
import type { SiteContent, GalleryPhoto } from "@/lib/types";

export async function getSiteContent(): Promise<SiteContent | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_content")
    .select("*")
    .eq("id", 1)
    .single();

  return (data as SiteContent) ?? null;
}

export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("gallery_photos")
    .select("*")
    .order("sort_order", { ascending: true });

  return (data as GalleryPhoto[]) ?? [];
}
