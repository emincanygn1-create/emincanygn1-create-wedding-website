/** Beğeniler tarayıcıda saklanır: aynı kişi aynı şeyi iki kez beğenmesin. */
export function readLiked(storageKey: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function saveLiked(storageKey: string, ids: string[]) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(ids));
  } catch {
    // depolama kapalıysa sorun değil
  }
}

export const WISH_LIKES_KEY = "wedding_liked_wishes";
export const PHOTO_LIKES_KEY = "wedding_liked_photos";
export const GALLERY_LIKES_KEY = "wedding_liked_gallery";
