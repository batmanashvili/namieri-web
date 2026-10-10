import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Crawling is allowed; individual pages opt out with a noindex robots meta tag.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    host: siteUrl,
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
