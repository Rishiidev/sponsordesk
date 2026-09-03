import type { Metadata } from "next";
import { Kanban, FileText, Bell, Banknote, TriangleAlert, ArrowRight } from "lucide-react";

import { MarketingPageHeader } from "@/components/marketing-page-header";

export const metadata: Metadata = {
  title: "Features — SponsorDesk",
  description:
    "What SponsorDesk actually does: a deal pipeline, a rate calculator that pays for the subscription, automated reminders, real payment terms, and a documented escalation path when a brand doesn't pay.",
  alternates: { canonical: "/features" },
};

const display: React.CSSProperties = { fontFamily: "var(--font-display)" };
const sans: React.CSSProperties = { fontFamily: "var(--font-sans)" };

const SIGN_UP = "https://app.sponsordesk.bruuhh.com/sign-up?utm_source=features-page&utm_medium=cta&utm_campaign=cross-promo";

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] font-semibold uppercase tracking-wide" style={{ ...sans, color: "var(--cobalt-600)" }}>
      {children}
    </p>
  );
}

function Section({
  icon: Icon,
  eyebrow,
  title,
  children,
}: {
  icon: React.ElementType;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t py-12" style={{ borderColor: "var(--border-subtle)" }}>
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <div>
          <span
            className="inline-flex h-10 w-10 items-center justify-center"
            style={{ borderRadius: "var(--radius-md)", background: "var(--cobalt-100)", color: "var(--cobalt-600)" }}
          >
            <Icon size={19} strokeWidth={2} />
          </span>
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <h2
            className="mt-1 text-[22px]"
            style={{ ...display, fontWeight: "var(--weight-extrabold)", letterSpacing: "var(--tracking-tighter)", color: "var(--text-primary)" }}
          >
            {title}
          </h2>
        </div>
        <div className="max-w-2xl" style={{ ...sans, color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)" }}>
          {children}
        </div>
      </div>
    </section>
  );
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingPageHeader crossLinkHref="/glossary" crossLinkLabel="Glossary" />

      <main className="mx-auto max-w-4xl px-5 pb-24 pt-14 md:px-8">
        <div className="max-w-2xl">
          <p className="text-[13px] font-semibold uppercase tracking-wide" style={{ ...sans, color: "var(--text-muted)" }}>
            Features
          </p>
          <h1
            className="mt-2 text-[36px] leading-[1.1] md:text-[44px]"
            style={{ ...display, fontWeight: "var(--weight-extrabold)", letterSpacing: "var(--tracking-tighter)", color: "var(--text-primary)" }}
          >
            What SponsorDesk actually does.
          </h1>
          <p className="mt-4 text-[16px]" style={{ ...sans, color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)" }}>
            No feature on this page is aspirational — every one of them is live today. If something's still being
            built, we'll say so.
          </p>
        </div>

        <Section icon={Kanban} eyebrow="Pipeline" title="One board, every deal, always current">
          <p>
            Drag deals from inbound to negotiating to live to paid. Every brand's status is one glance away — no more
            hunting through email threads to remember where a conversation left off.
          </p>
        </Section>

        <Section icon={Banknote} eyebrow="Rate calculator" title="Pays for the subscription on its own">
          <p>
            Not sure what to charge? The{" "}
            <a href="/tools/rate-calculator" className="font-medium" style={{ color: "var(--cobalt-600)" }}>
              free rate calculator
            </a>{" "}
            benchmarks a sponsored post against platform, audience size, and niche. One deal priced even $20 higher
            because you had a real number to quote covers more than a year of the $9/mo founder plan. The math isn't
            close.
          </p>
        </Section>

        <Section icon={Bell} eyebrow="Automated reminders" title="Follow-ups that fire on their own">
          <p>
            A daily job checks every unpaid invoice and sends a reminder at exactly 3, 7, and 14 days overdue — no
            one has to remember to chase anything. This is the single biggest source of recovered revenue on a solo
            pipeline: brands don't usually refuse to pay, they just go quiet, and quiet is what reminders fix.
          </p>
        </Section>

        <Section icon={FileText} eyebrow="Payment terms" title="Terms agreed upfront, in writing">
          <p className="mb-3">
            Set net payment days, a late fee (flat or percent), and a grace period per deal — before an invoice even
            exists. Write your own terms note or generate one from the numbers you set.
          </p>
          <p>
            Once terms are set, they're not just internal bookkeeping: the brand sees them on every reminder email,
            so "that wasn't the deal" stops being a valid objection when a payment's late.
          </p>
        </Section>

        <Section icon={TriangleAlert} eyebrow="Demand letters" title="A real escalation, not just a nudge">
          <p className="mb-3">
            After 14 days overdue, a formal demand letter becomes available — one click sends it, referencing the
            original invoice, days overdue, and any late fee. It's a different email than a reminder on purpose:
            firmer tone, for when a nudge hasn't worked.
          </p>
          <p>
            Not a SponsorDesk user yet, or want a printable version for a deal you're tracking elsewhere? The{" "}
            <a href="/tools/demand-letter-generator" className="font-medium" style={{ color: "var(--cobalt-600)" }}>
              free demand letter generator
            </a>{" "}
            makes the same kind of letter without an account.
          </p>
        </Section>

        <section className="border-t py-12" style={{ borderColor: "var(--border-subtle)" }}>
          <SectionEyebrow>The escalation path</SectionEyebrow>
          <h2
            className="mt-1 text-[22px]"
            style={{ ...display, fontWeight: "var(--weight-extrabold)", letterSpacing: "var(--tracking-tighter)", color: "var(--text-primary)" }}
          >
            What happens when a brand goes quiet, start to finish
          </h2>
          <p className="mt-3 max-w-2xl" style={{ ...sans, color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)" }}>
            Every step below is a real, working part of the product — not a plan.
          </p>

          <ol className="mt-8 flex flex-col gap-0">
            {[
              { step: "Terms agreed", body: "Net days, late fee, and a terms note are set on the deal before work starts." },
              { step: "Day 3, 7, 14 overdue", body: "Automated reminder emails, referencing the terms the brand already agreed to." },
              { step: "Grace period ends", body: "The configured late fee is suggested on the invoice — reviewed and applied with one click, never silently." },
              { step: "14 days overdue", body: "The demand letter unlocks — a formal, firmer notice, one click to send." },
            ].map((item, i, arr) => (
              <li key={item.step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center text-[13px] font-semibold"
                    style={{ borderRadius: "999px", background: "var(--cobalt-100)", color: "var(--cobalt-600)" }}
                  >
                    {i + 1}
                  </span>
                  {i < arr.length - 1 && <span className="w-px flex-1" style={{ background: "var(--border-subtle)", minHeight: 24 }} />}
                </div>
                <div className="pb-8">
                  <p className="font-semibold" style={{ ...sans, color: "var(--text-primary)" }}>
                    {item.step}
                  </p>
                  <p className="mt-1 text-[14.5px]" style={{ ...sans, color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)" }}>
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-4 flex flex-col items-start gap-4 border-t pt-12" style={{ borderColor: "var(--border-subtle)" }}>
          <a
            href={SIGN_UP}
            className="inline-flex items-center gap-2 px-6 py-3 text-[15px] font-semibold text-white"
            style={{ background: "var(--cobalt-500)", borderRadius: "var(--radius-md)" }}
          >
            Create your account <ArrowRight size={16} />
          </a>
          <p className="text-[13px]" style={{ ...sans, color: "var(--text-muted)" }}>
            Free up to 3 active deals. No credit card.
          </p>
        </div>
      </main>
    </div>
  );
}
