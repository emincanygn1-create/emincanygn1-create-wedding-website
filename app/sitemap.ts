import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { getSiteUrl } from "@/lib/siteUrl";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const paths = ["", "/wishes", "/moments"];

  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${base}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.6,
    }))
  );
}
