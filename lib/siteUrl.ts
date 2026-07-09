/**
 * Mutlak adres. Sitemap, canonical ve link önizlemesi için gerekli.
 * Vercel'de otomatik doldurulur; kendi alan adını bağladıysan
 * NEXT_PUBLIC_SITE_URL değişkenini eklemen daha doğru olur.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}
