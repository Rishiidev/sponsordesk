import Link from "next/link";
import type { Metadata } from "next";

import { BlogHeader } from "@/components/blog-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — SponsorDesk",
  description: "Brand deals, rates, contracts, and getting paid — written for solo creators, not agencies.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader showAllPostsLink={false} />

      <main className="mx-auto max-w-3xl px-4 py-12 md:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Blog</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Brand deals, rates, contracts, and getting paid — written for solo creators, not agencies.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="transition-shadow hover:shadow-[var(--shadow-md)]">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
          {posts.length === 0 && <p className="text-sm text-muted-foreground">Nothing published yet.</p>}
        </div>
      </main>
    </div>
  );
}
