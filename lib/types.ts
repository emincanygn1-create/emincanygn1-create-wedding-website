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
  "closing_text",
  "rsvp_closed_message",
  "site_title",
  "site_description",
  "cover_eyebrow",
  "closing_eyebrow",
  "closing_title",
  "closing_seeyou",
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
  closing_text: string;
  closing_eyebrow: string;
  closing_title: string;
  closing_seeyou: string;
  site_title: string;
  site_description: string;
  cover_eyebrow: string;
  gate_enabled: boolean;
  single_event: boolean;
  section_config: unknown;
  rsvp_enabled: boolean;
  rsvp_deadline: string | null;
  rsvp_closed_message: string;
  gift_account_name: string;
  gift_iban: string;
  bride_photo_url: string | null;
  groom_photo_url: string | null;
  video_url: string | null;
  cover_photo_url: string | null;
  ceremony_photo_url: string | null;
  reception_photo_url: string | null;
  countdown_bg_url: string | null;
  cover_video_url: string | null;
  quote_bg_url: string | null;
  closing_bg_url: string | null;
  music_url: string | null;
  bride_instagram: string;
  groom_instagram: string;
};

export type GalleryPhoto = {
  id: string;
  url: string;
  sort_order: number;
  likes: number;
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
  likes: number;
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

export type StoryPost = {
  id: string;
  sort_order: number;
  photo_url: string | null;
  date_text: string;
  date_text_en: string | null;
  date_text_it: string | null;
  title: string;
  title_en: string | null;
  title_it: string | null;
  body: string;
  body_en: string | null;
  body_it: string | null;
  is_visible: boolean;
  created_at: string;
};

export type Faq = {
  id: string;
  sort_order: number;
  question: string;
  question_en: string | null;
  question_it: string | null;
  answer: string;
  answer_en: string | null;
  answer_it: string | null;
  is_visible: boolean;
  created_at: string;
};
