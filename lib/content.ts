import { createClient } from "@/lib/supabase/server";
import type {
  SiteContent,
  GalleryPhoto,
  Wish,
  GuestPhoto,
  Rsvp,
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

export async function getGuestPhotos(): Promise<GuestPhoto[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("guest_photos")
    .select("*")
    .order("created_at", { ascending: false });

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
