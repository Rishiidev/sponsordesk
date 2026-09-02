import Image from "next/image";

/**
 * Light, honest brand reveal: this tool is made by SponsorDesk, with a soft
 * CTA into its real sign-up. Never rendered in the printed invoice — a
 * client receiving the PDF shouldn't see an ad on their own invoice.
 */
export function SponsorDeskBrand({ variant, toolSlug }: { variant: "footer" | "inline"; toolSlug: string }) {
  const SPONSORDESK_URL = `https://sponsordesk-app-v2.vercel.app/sign-up?utm_source=${toolSlug}&utm_medium=tool&utm_campaign=cross-promo`;

  if (variant === "inline") {
    return (
      <a
        href={SPONSORDESK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 pt-1.5 text-[11px] text-muted-foreground print:hidden"
      >
        <Image src="/sponsordesk-logo-mark.png" alt="" width={10} height={11} className="opacity-70" />
        <span>
          by SponsorDesk — track deals &amp; get paid faster <span aria-hidden>→</span>
        </span>
      </a>
    );
  }

  return (
    <footer className="border-t border-border bg-card print:hidden">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6 lg:px-8">
        <a href={SPONSORDESK_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
          <Image src="/sponsordesk-logo-mark.png" alt="SponsorDesk" width={14} height={16} className="opacity-80" />
          <span className="text-xs text-muted-foreground">
            Built by <span className="font-medium text-foreground">SponsorDesk</span>
          </span>
        </a>
        <a
          href={SPONSORDESK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-primary hover:underline"
        >
          Track deals, invoices &amp; payments in one place — try it free <span aria-hidden>→</span>
        </a>
      </div>
    </footer>
  );
}
