import type { MetadataRoute } from "next";

import { getAllPosts } from "@/lib/blog";
import { TOOLS } from "@/lib/tools";

const BASE_URL = "https://sponsordesk.bruuhh.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/features`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/glossary`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/tools`, changeFrequency: "weekly", priority: 0.8 },
    ...TOOLS.map((tool) => ({
      url: `${BASE_URL}/tools/${tool.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    ...getAllPosts().map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      lastModified: post.date,
    })),
  ];
}
