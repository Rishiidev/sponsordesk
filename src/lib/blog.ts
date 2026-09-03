import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

/**
 * Blog posts are .mdx files in content/blog/, read from disk at build time
 * (this module only runs in Server Components — App Router pages under
 * src/app/blog/* — never in the browser). No CMS: adding a post is adding
 * a file and redeploying, matching the rest of this repo's git-based,
 * solo-builder workflow.
 */
export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  excerpt: string;
}

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

function readPostFile(slug: string): matter.GrayMatterFile<string> {
  const raw = fs.readFileSync(path.join(POSTS_DIR, `${slug}.mdx`), "utf8");
  return matter(raw);
}

export function getPostMeta(slug: string): BlogPostMeta {
  const { data } = readPostFile(slug);
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    excerpt: String(data.excerpt ?? data.description ?? ""),
  };
}

export function getPostSource(slug: string): string {
  return readPostFile(slug).content;
}

export function getAllPosts(): BlogPostMeta[] {
  return getAllPostSlugs()
    .map(getPostMeta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
