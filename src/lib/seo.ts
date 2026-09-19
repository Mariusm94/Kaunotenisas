import type { Metadata } from "next";
import { defaultSeo, type SeoSettings } from "@/data/seo";
import { getSeo } from "@/lib/contentStore";

function absoluteUrl(siteUrl: string, path: string) {
  const base = siteUrl.replace(/\/$/, "");
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function keywordsList(value?: string) {
  if (!value?.trim()) return undefined;
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export async function buildPageMetadata(
  path: string,
  fallback?: { title?: string; description?: string },
): Promise<Metadata> {
  const seo = await getSeo();
  return metadataFromSeo(seo, path, fallback);
}

export function metadataFromSeo(
  seo: SeoSettings,
  path: string,
  fallback?: { title?: string; description?: string },
): Metadata {
  const page = seo.pages[path] ?? {};
  const title = page.title || fallback?.title || seo.titleDefault;
  const description = page.description || fallback?.description || seo.description;
  const keywords = keywordsList(page.keywords || seo.keywords);
  const url = absoluteUrl(seo.siteUrl, path === "/" ? "" : path);
  const ogImage = absoluteUrl(seo.siteUrl, seo.ogImage || "/images/logo.png");
  const isHome = path === "/";

  return {
    metadataBase: new URL(seo.siteUrl || defaultSeo.siteUrl),
    title: isHome ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: url || seo.siteUrl },
    openGraph: {
      type: "website",
      locale: "lt_LT",
      url: url || seo.siteUrl,
      siteName: seo.titleDefault,
      title,
      description,
      images: [{ url: ogImage, alt: seo.titleDefault }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export async function rootMetadata(): Promise<Metadata> {
  const seo = await getSeo();
  return {
    metadataBase: new URL(seo.siteUrl || defaultSeo.siteUrl),
    title: {
      default: seo.titleDefault,
      template: seo.titleTemplate || defaultSeo.titleTemplate,
    },
    description: seo.description,
    keywords: keywordsList(seo.keywords),
    icons: { icon: "/images/logo.png" },
    openGraph: {
      type: "website",
      locale: "lt_LT",
      siteName: seo.titleDefault,
      title: seo.titleDefault,
      description: seo.description,
      images: [{ url: absoluteUrl(seo.siteUrl, seo.ogImage), alt: seo.titleDefault }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.titleDefault,
      description: seo.description,
      images: [absoluteUrl(seo.siteUrl, seo.ogImage)],
    },
  };
}
