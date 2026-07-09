import { createClient } from "@/lib/supabase/server";
import type {
  SiteContent,
  GalleryPhoto,
  Wish,
  GuestPhoto,
  Rsvp,
  StoryPost,
  Faq,
} from "@/lib/types";

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

export async function getWishes(): Promise<Wish[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("wishes")
    .select("*")
    .order("created_at", { ascending: false });

  return (data as Wish[]) ?? [];
}

/** Ana sayfada gösterilen, en çok beğenilen dilekler. */
export async function getTopWishes(limit = 3): Promise<Wish[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("wishes")
    .select("*")
    .order("likes", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data as Wish[]) ?? [];
}

export async function getWishCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("wishes")
    .select("id", { count: "exact", head: true });

  return count ?? 0;
}

export async function getGuestPhotos(limit?: number): Promise<GuestPhoto[]> {
  const supabase = await createClient();

  let query = supabase
    .from("guest_photos")
    .select("*")
    .order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data } = await query;
  return (data as GuestPhoto[]) ?? [];
}

/** Sadece admin panelinde kullanılır (RLS gereği giriş yapılmış olmalı). */
export async function getRsvps(): Promise<Rsvp[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("rsvps")
    .select("*")
    .order("created_at", { ascending: false });

  return (data as Rsvp[]) ?? [];
}

export async function getStoryPosts(limit?: number): Promise<StoryPost[]> {
  const supabase = await createClient();

  let query = supabase
    .from("story_posts")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (limit) query = query.limit(limit);

  const { data } = await query;
  return (data as StoryPost[]) ?? [];
}

export async function getFaqs(): Promise<Faq[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (data as Faq[]) ?? [];
}
