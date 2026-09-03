import type { Metadata } from "next";

import { MarketingPageHeader } from "@/components/marketing-page-header";

export const metadata: Metadata = {
  title: "Glossary — SponsorDesk",
  description: "Plain-language definitions for the brand-deal terms creators actually run into — Net-15, usage rights, whitelisting, late fees, demand letters, and more.",
  alternates: { canonical: "/glossary" },
};

const sans: React.CSSProperties = { fontFamily: "var(--font-sans)" };

interface Term {
  term: string;
  body: React.ReactNode;
}

const TERMS: Term[] = [
  {
    term: "Net-15 / Net terms",
    body: (
      <>
        Payment is due within a set number of days of the invoice date — "Net 15" means 15 days. Freelance-standard,
        borrowed by the creator economy. See{" "}
        <a href="/blog/invoice-a-brand-for-a-sponsored-post">how to invoice a brand for a sponsored post</a>.
      </>
    ),
  },
  {
    term: "Payment terms",
    body: (
      <>
        The net days, late fee, and grace period agreed for a deal, written down before work starts rather than
        assumed. See <a href="/features">how SponsorDesk tracks this per deal</a>.
      </>
    ),
  },
  {
    term: "Grace period",
    body: "The number of days past the due date before a late fee applies. A 3-day grace period means the fee doesn't kick in until day 4 overdue.",
  },
  {
    term: "Late fee",
    body: "A flat amount or percentage added to an invoice once it's overdue past any agreed grace period — only meaningful when it was agreed to in writing before the deal, not invented after the fact.",
  },
  {
    term: "Usage rights",
    body: (
      <>
        The brand's right to reuse your content beyond your own organic post — on their channels, or as a paid ad.
        Separate from, and priced separately from, the base rate for posting. See{" "}
        <a href="/blog/usage-rights-in-influencer-marketing">what are usage rights in influencer marketing</a>.
      </>
    ),
  },
  {
    term: "Whitelisting",
    body: "A brand running your content as a paid ad through their own ad account — the highest-value form of usage rights, since it's directly tied to ad performance they're measuring.",
  },
  {
    term: "Demand letter",
    body: (
      <>
        A formal, firmer notice sent once an invoice is significantly overdue (14+ days) — a step up from a routine
        reminder. Try the <a href="/tools/demand-letter-generator">free demand letter generator</a>.
      </>
    ),
  },
  {
    term: "Escalation path",
    body: (
      <>
        The sequence a creator follows when a brand stops paying: reminders, then a late fee, then a demand letter.
        See <a href="/features">the full path</a>.
      </>
    ),
  },
  {
    term: "Media kit",
    body: (
      <>
        A one-page summary of your reach, platforms, engagement, and past collabs — what a brand skims before
        replying to a pitch. See{" "}
        <a href="/blog/what-to-put-in-a-creator-media-kit">what to put in a creator media kit</a>.
      </>
    ),
  },
  {
    term: "Rate card",
    body: (
      <>
        Your own reference sheet of what you charge per platform and deliverable type. Estimate one with the{" "}
        <a href="/tools/rate-calculator">free rate calculator</a>.
      </>
    ),
  },
  {
    term: "Engagement rate",
    body: "Likes, comments, and shares as a percentage of followers — a better signal of a real, active audience than follower count alone.",
  },
  {
    term: "Deliverable",
    body: "A specific thing owed per deal — one feed post, two stories, a dedicated video segment. Contracts and invoices should describe deliverables exactly, not generically.",
  },
  {
    term: "Founder pricing",
    body: "SponsorDesk-specific: the first 200 creators to sign up lock in $9/mo for life, before the plan moves to its regular $19–29/mo range.",
  },
];

export default function GlossaryPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingPageHeader crossLinkHref="/features" crossLinkLabel="Features" />

      <main className="mx-auto max-w-2xl px-5 pb-24 pt-14 md:px-8">
        <h1
          className="text-[32px] leading-[1.1] md:text-[36px]"
          style={{ fontFamily: "var(--font-display)", fontWeight: "var(--weight-extrabold)", letterSpacing: "var(--tracking-tighter)", color: "var(--text-primary)" }}
        >
          Glossary
        </h1>
        <p className="mt-3 text-[15px]" style={{ ...sans, color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)" }}>
          Plain-language definitions for the brand-deal terms that actually come up.
        </p>

        <dl className="mt-10 flex flex-col [&_a]:font-medium [&_a]:text-[var(--cobalt-600)] [&_a]:underline [&_a]:underline-offset-2">
          {TERMS.map((item) => (
            <div key={item.term} className="border-t py-5" style={{ borderColor: "var(--border-subtle)" }}>
              <dt className="font-semibold" style={{ ...sans, color: "var(--text-primary)" }}>
                {item.term}
              </dt>
              <dd className="mt-1.5 text-[14.5px]" style={{ ...sans, color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)" }}>
                {item.body}
              </dd>
            </div>
          ))}
        </dl>
      </main>
    </div>
  );
}
