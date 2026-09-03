import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";

import { BlogHeader } from "@/components/blog-header";
import { SponsorDeskBrand } from "@/components/sponsordesk-brand";
import { getAllPostSlugs, getPostMeta, getPostSource } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const slugs = getAllPostSlugs();
  if (!slugs.includes(slug)) return {};

  const meta = getPostMeta(slug);
  return {
    title: `${meta.title} — SponsorDesk`,
    description: meta.description,
    alternates: { canonical: `/blog/${meta.slug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "article",
      url: `https://sponsordesk.bruuhh.com/blog/${meta.slug}`,
      publishedTime: meta.date,
    },
  };
}

function formatDisplayDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const slugs = getAllPostSlugs();
  if (!slugs.includes(slug)) notFound();

  const meta = getPostMeta(slug);
  const source = getPostSource(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    author: { "@type": "Organization", name: "SponsorDesk" },
    publisher: { "@type": "Organization", name: "SponsorDesk" },
    mainEntityOfPage: `https://sponsordesk.bruuhh.com/blog/${meta.slug}`,
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogHeader />

      <main className="mx-auto max-w-3xl px-4 py-12 md:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-medium text-muted-foreground">{formatDisplayDate(meta.date)}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">{meta.title}</h1>
        </div>

        <div className="blog-prose prose prose-slate max-w-none">
          <MDXRemote source={source} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
        </div>
      </main>

      <SponsorDeskBrand variant="footer" toolSlug={`blog-${meta.slug}`} />
    </div>
  );
}
