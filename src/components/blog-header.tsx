import Image from "next/image";

/**
 * Slim nav strip shared by every page under /blog/*, matching the pattern
 * ToolsHeader establishes for /tools/*: a way back to the marketing site,
 * plus a link to the full post index once there's more than one post.
 */
export function BlogHeader({ showAllPostsLink = true }: { showAllPostsLink?: boolean }) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-border bg-card px-4 py-2.5 text-xs md:px-6 lg:px-8">
      <a href="/" className="flex items-center gap-1.5 font-medium text-foreground hover:text-primary">
        <span aria-hidden>←</span>
        <Image src="/logo-mark.png" alt="SponsorDesk" width={13} height={15} style={{ height: 15, width: "auto" }} />
        SponsorDesk
      </a>
      {showAllPostsLink && (
        <a href="/blog" className="font-medium text-muted-foreground hover:text-primary">
          All posts
        </a>
      )}
    </div>
  );
}
