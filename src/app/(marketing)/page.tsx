import { WaitlistForm } from "@/components/WaitlistForm";
import { FeatureGrid } from "@/components/FeatureGrid";
import { ComparisonTable } from "@/components/ComparisonTable";
import { ProductPreview } from "@/components/ProductPreview";
import { QuoteWall } from "@/components/QuoteWall";
import { FAQ } from "@/components/FAQ";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-[1120px] px-5 pb-24 md:px-8">
      {/* NAV */}
      <nav className="flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] bg-[var(--color-ink)] text-[13px] font-semibold text-[var(--color-accent)]"
          >
            S
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-[var(--color-ink)]">
            SponsorDesk
          </span>
        </a>
        <div className="flex items-center gap-5">
          <a
            href="#how"
            className="hidden text-[14px] text-[var(--color-ink-2)] hover:text-[var(--color-ink)] md:inline"
          >
            How it works
          </a>
          <a
            href="#pricing"
            className="hidden text-[14px] text-[var(--color-ink-2)] hover:text-[var(--color-ink)] md:inline"
          >
            Pricing
          </a>
          <a
            href="#waitlist"
            className="inline-flex h-9 items-center rounded-[6px] bg-[var(--color-ink)] px-3.5 text-[13px] font-medium text-white hover:bg-[var(--color-accent)] transition-colors"
          >
            Get early access
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-12 md:pt-20">
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-7">
            <h1 className="text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-[var(--color-ink)] md:text-[56px]">
              The brand deal CRM that doesn&apos;t make you feel like you&apos;re running an agency.
            </h1>
            <p className="mt-5 max-w-[58ch] text-[17px] leading-relaxed text-[var(--color-ink-2)] md:text-[18px]">
              Built for solo creators with 10K to 500K followers who actually close
              deals. Stop tracking sponsors in spreadsheets and Notion databases
              that quietly fail.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-[var(--color-ink-3)]">
              <span>Solo-built in public</span>
              <span aria-hidden className="text-[var(--color-line)]">/</span>
              <span>From $9/mo for waitlist members</span>
              <span aria-hidden className="text-[var(--color-line)]">/</span>
              <span>Launching to first 200 creators</span>
            </div>
          </div>
          <div className="md:col-span-5" id="waitlist">
            <WaitlistForm />
          </div>
        </div>

        {/* HERO PRODUCT PREVIEW — sits under both columns */}
        <div className="mt-14 md:mt-20">
          <ProductPreview />
        </div>
      </section>

      {/* SOCIAL PROOF — pulled straight from creator subreddit language */}
      <section className="mt-24 md:mt-32">
        <QuoteWall />
      </section>

      {/* HOW IT WORKS — feature grid */}
      <section id="how" className="mt-24 md:mt-32">
        <div className="mb-10 max-w-[60ch]">
          <h2 className="text-[28px] font-semibold tracking-tight text-[var(--color-ink)] md:text-[36px]">
            What you actually need to run deals without losing them.
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed text-[var(--color-ink-2)]">
            No agency dashboards. No 14-step onboarding. No AI features you
            didn&apos;t ask for.
          </p>
        </div>
        <FeatureGrid />
      </section>

      {/* COMPARISON — vs the real alternatives */}
      <section className="mt-24 md:mt-32">
        <div className="mb-10 max-w-[60ch]">
          <h2 className="text-[28px] font-semibold tracking-tight text-[var(--color-ink)] md:text-[36px]">
            How it stacks up.
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed text-[var(--color-ink-2)]">
            The honest comparison. No asterisks.
          </p>
        </div>
        <ComparisonTable />
      </section>

      {/* PRICING — simple, transparent */}
      <section id="pricing" className="mt-24 md:mt-32">
        <div className="mb-10 max-w-[60ch]">
          <h2 className="text-[28px] font-semibold tracking-tight text-[var(--color-ink)] md:text-[36px]">
            Two plans. One is honest about what it costs to build this.
          </h2>
          <p className="mt-3 text-[16px] leading-relaxed text-[var(--color-ink-2)]">
            Waitlist members lock in founder pricing for life.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Founder */}
          <div className="rounded-[var(--radius-soft)] border border-[var(--color-ink)] bg-white p-7">
            <div className="flex items-baseline justify-between">
              <h3 className="text-[18px] font-semibold text-[var(--color-ink)]">Founder</h3>
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-accent)]">
                Waitlist only
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-[44px] font-semibold tracking-tight text-[var(--color-ink)]">$9</span>
              <span className="text-[14px] text-[var(--color-ink-3)]">/ month, forever</span>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-2)]">
              For creators with up to 25 active deals at a time. Everything you
              see above, plus all future updates.
            </p>
            <a
              href="#waitlist"
              className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-[var(--radius-tight)] bg-[var(--color-ink)] text-[14px] font-medium text-white hover:bg-[var(--color-accent)] transition-colors"
            >
              Join the waitlist
            </a>
          </div>
          {/* Pro */}
          <div className="rounded-[var(--radius-soft)] border border-[var(--color-line)] bg-white p-7">
            <div className="flex items-baseline justify-between">
              <h3 className="text-[18px] font-semibold text-[var(--color-ink)]">Pro</h3>
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-3)]">
                After launch
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-[44px] font-semibold tracking-tight text-[var(--color-ink)]">$29</span>
              <span className="text-[14px] text-[var(--color-ink-3)]">/ month</span>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-2)]">
              Unlimited deals, Stripe payouts, AI follow-up drafts, and
              priority support. Everything else is the same.
            </p>
            <a
              href="#waitlist"
              className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-[var(--radius-tight)] border border-[var(--color-line)] bg-white text-[14px] font-medium text-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors"
            >
              Notify me at launch
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-24 md:mt-32">
        <div className="mb-10 max-w-[60ch]">
          <h2 className="text-[28px] font-semibold tracking-tight text-[var(--color-ink)] md:text-[36px]">
            The questions I expect you to ask.
          </h2>
        </div>
        <FAQ />
      </section>

      {/* FINAL CTA */}
      <section className="mt-24 md:mt-32">
        <div className="rounded-[var(--radius-soft)] bg-[var(--color-ink)] px-7 py-12 text-center md:px-12 md:py-16">
          <h2 className="mx-auto max-w-[20ch] text-[28px] font-semibold tracking-tight text-white md:text-[36px]">
            Stop losing deals to a spreadsheet you forgot to open.
          </h2>
          <p className="mx-auto mt-4 max-w-[55ch] text-[15.5px] leading-relaxed text-white/70">
            Join the waitlist. Lock in $9/mo founder pricing. Get the first
            look when seats open in 6 to 10 weeks.
          </p>
          <a
            href="#waitlist"
            className="mt-7 inline-flex h-11 items-center justify-center rounded-[var(--radius-tight)] bg-[var(--color-accent)] px-6 text-[15px] font-medium text-white hover:bg-[var(--color-accent)]/90 transition-colors"
          >
            Get early access →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-20 flex flex-col gap-3 border-t border-[var(--color-line)] pt-8 text-[13px] text-[var(--color-ink-3)] md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-flex h-5 w-5 items-center justify-center rounded-[4px] bg-[var(--color-ink)] text-[10px] font-semibold text-[var(--color-accent)]"
          >
            S
          </span>
          <span>SponsorDesk</span>
          <span aria-hidden>·</span>
          <span>Built solo in public</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="mailto:hello@sponsordesk.io" className="hover:text-[var(--color-ink)]">
            hello@sponsordesk.io
          </a>
          <span aria-hidden>·</span>
          <span className="font-mono">© 2026</span>
        </div>
      </footer>
    </main>
  );
}