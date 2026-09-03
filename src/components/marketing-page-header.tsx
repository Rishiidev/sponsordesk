import Image from "next/image";

/**
 * Slim nav strip shared by standalone marketing pages that aren't part of
 * /tools/* or /blog/* (currently /features and /glossary) — matches the
 * pattern ToolsHeader and BlogHeader establish for their own sections, with
 * a caller-supplied cross-link instead of a hardcoded "back to index" one.
 */
export function MarketingPageHeader({
  crossLinkHref,
  crossLinkLabel,
}: {
  crossLinkHref: string;
  crossLinkLabel: string;
}) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-border bg-card px-4 py-2.5 text-xs md:px-6 lg:px-8">
      <a href="/" className="flex items-center gap-1.5 font-medium text-foreground hover:text-primary">
        <span aria-hidden>←</span>
        <Image src="/logo-mark.png" alt="SponsorDesk" width={13} height={15} style={{ height: 15, width: "auto" }} />
        SponsorDesk
      </a>
      <a href={crossLinkHref} className="font-medium text-muted-foreground hover:text-primary">
        {crossLinkLabel}
      </a>
    </div>
  );
}
