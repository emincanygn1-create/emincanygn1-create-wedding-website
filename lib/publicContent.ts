import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type { SiteContent, GalleryPhoto, StoryPost, Faq } from "@/lib/types";

/**
 * Panelden nadiren değişen veriler 30 saniye önbellekte tutulur.
 * Düğün gecesi herkes aynı anda girdiğinde her ziyaret için
 * dört ayrı sorgu atmamak içindir.
 *
 * Panelde bir değişiklik yaptığında sitede en geç 30 saniye içinde görünür.
 * Dilekler, misafir fotoğrafları ve RSVP önbelleğe alınmaz — onlar canlı.
 */
const REVALIDATE = 30;

export const getPublicSiteContent = unstable_cache(
  async (): Promise<SiteContent | null> => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("site_content")
      .select("*")
      .eq("id", 1)
      .single();
    return (data as SiteContent) ?? null;
  },
  ["site-content"],
  { revalidate: REVALIDATE, tags: ["site-content"] }
);

export const getPublicGalleryPhotos = unstable_cache(
  async (): Promise<GalleryPhoto[]> => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("gallery_photos")
      .select("*")
      .order("sort_order", { ascending: true });
    return (data as GalleryPhoto[]) ?? [];
  },
  ["gallery-photos"],
  { revalidate: REVALIDATE, tags: ["gallery"] }
);

export const getPublicStoryPosts = unstable_cache(
  async (): Promise<StoryPost[]> => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("story_posts")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    return (data as StoryPost[]) ?? [];
  },
  ["story-posts"],
  { revalidate: REVALIDATE, tags: ["story"] }
);

export const getPublicFaqs = unstable_cache(
  async (): Promise<Faq[]> => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("faqs")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    return (data as Faq[]) ?? [];
  },
  ["faqs"],
  { revalidate: REVALIDATE, tags: ["faqs"] }
);
