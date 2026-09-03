import type { MetadataRoute } from "next";

import { TOOLS } from "@/lib/tools";

const BASE_URL = "https://sponsordesk.bruuhh.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/tools`, changeFrequency: "weekly", priority: 0.8 },
    ...TOOLS.map((tool) => ({
      url: `${BASE_URL}/tools/${tool.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
