export type SiteContent = {
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
