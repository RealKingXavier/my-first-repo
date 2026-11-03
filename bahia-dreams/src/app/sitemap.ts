import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { activeProperties } from "@/content/properties";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: [string, number][] = [
    ["", 1],
    ["/stays", 0.9],
    ["/property-management", 0.9],
    ["/list-your-property", 0.8],
    ["/about", 0.6],
    ["/contact", 0.6],
    ["/privacy", 0.2],
    ["/terms", 0.2],
  ];
  return [
    ...pages.map(([p, priority]) => ({ url: `${site.url}${p}`, lastModified: now, priority })),
    ...activeProperties.map((p) => ({ url: `${site.url}/stays/${p.slug}`, lastModified: now, priority: 0.85 })),
  ];
}
