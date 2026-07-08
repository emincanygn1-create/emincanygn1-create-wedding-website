/** Türkçe yazılan, dil başına çevirisi olabilen alanlar. */
export const TRANSLATABLE_FIELDS = [
  "bride_parents",
  "groom_parents",
  "wedding_city",
  "ceremony_venue",
  "ceremony_date_text",
  "ceremony_time_text",
  "ceremony_address",
  "reception_venue",
  "reception_date_text",
  "reception_time_text",
  "reception_address",
  "quote_text",
] as const;

export type TranslatableField = (typeof TRANSLATABLE_FIELDS)[number];

type Translations = {
  [K in `${TranslatableField}_en` | `${TranslatableField}_it`]: string | null;
};

export type SiteContent = Translations & {
  id: number;
  bride_name: string;
  groom_name: string;
  bride_parents: string;
  groom_parents: string;
  wedding_date: string;
  wedding_city: string;
  ceremony_venue: string;
  ceremony_date_text: string;
  ceremony_time_text: string;
  ceremony_address: string;
  ceremony_map_url: string;
  reception_venue: string;
  reception_date_text: string;
  reception_time_text: string;
  reception_address: string;
  reception_map_url: string;
  quote_text: string;
  gift_account_name: string;
  gift_iban: string;
  bride_photo_url: string | null;
  groom_photo_url: string | null;
  video_url: string | null;
};

export type GalleryPhoto = {
  id: string;
  url: string;
  sort_order: number;
};

export type Rsvp = {
  id: string;
  name: string;
  email: string;
  phone: string;
  attending: boolean;
  guest_count: number;
  side: string;
  message: string;
  locale: string;
  created_at: string;
};

export type Wish = {
  id: string;
  name: string;
  message: string;
  locale: string;
  is_visible: boolean;
  created_at: string;
};

export type GuestPhoto = {
  id: string;
  url: string;
  storage_path: string;
  caption: string;
  uploader_name: string;
  likes: number;
  is_visible: boolean;
  created_at: string;
};
