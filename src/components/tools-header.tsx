import Image from "next/image";

/**
 * Slim nav strip shared by every page under /tools/*: a way back to the
 * marketing site, plus a link to the tools index once there's more than
 * one tool to browse. Each tool page renders this itself rather than a
 * shared /tools/layout.tsx, since each tool also needs its own manifest/
 * metadata in its own nested layout.
 */
export function ToolsHeader({ showAllToolsLink = true }: { showAllToolsLink?: boolean }) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-border bg-card px-4 py-2.5 text-xs md:px-6 lg:px-8 print:hidden">
      <a href="/" className="flex items-center gap-1.5 font-medium text-foreground hover:text-primary">
        <span aria-hidden>←</span>
        <Image src="/logo-mark.png" alt="" width={13} height={15} style={{ height: 15, width: "auto" }} />
        SponsorDesk
      </a>
      {showAllToolsLink && (
        <a href="/tools" className="font-medium text-muted-foreground hover:text-primary">
          All free tools
        </a>
      )}
    </div>
  );
}
