import type { MetadataRoute } from "next";
import { getSeo } from "@/lib/contentStore";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getSeo();
  const base = seo.siteUrl.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/mano", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
