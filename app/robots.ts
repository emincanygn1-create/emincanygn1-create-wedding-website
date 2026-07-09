import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Yönetim paneli arama motorlarında görünmesin.
      disallow: ["/admin", "/admin/"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
