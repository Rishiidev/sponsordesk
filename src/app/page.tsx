import { WaitlistForm } from "@/components/WaitlistForm";
import { FeatureGrid } from "@/components/FeatureGrid";
import { ComparisonTable } from "@/components/ComparisonTable";
import { ProductPreview } from "@/components/ProductPreview";
import { QuoteWall } from "@/components/QuoteWall";
import { TestimonialsWall } from "@/components/ui/testimonial-v2";
import { FAQ } from "@/components/FAQ";
import { Pricing } from "@/components/Pricing";
import { ShaderBackground } from "@/components/ShaderBackground";
import { ArrowRight, CircleCheck } from "lucide-react";
import Image from "next/image";

const SIGN_UP = "https://sponsordesk-app-v2.vercel.app/sign-up";
const SIGN_IN = "https://sponsordesk-app-v2.vercel.app/sign-in";

const display: React.CSSProperties = { fontFamily: "var(--font-display)" };
const sans: React.CSSProperties = { fontFamily: "var(--font-sans)" };
const mono: React.CSSProperties = { fontFamily: "var(--font-mono)" };

function Logo() {
  return (
    <a href="/" className="flex items-center gap-2.5">
      <Image src="/logo-mark.png" alt="" width={19} height={22} priority style={{ height: 22, width: "auto" }} />
      <span className="text-[16px]" style={{ ...display, fontWeight: "var(--weight-extrabold)", lineHeight: 1, color: "var(--text-primary)", letterSpacing: "var(--tracking-tighter)" }}>
        SponsorDesk
      </span>
    </a>
  );
}

function PrimaryButton({
  href,
  children,
  size = "md",
  fullWidth = false,
}: {
  href: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}) {
  const h = size === "lg" ? 48 : size === "sm" ? 34 : 40;
  const fontSize = size === "lg" ? 15 : size === "sm" ? 13 : 14;
  return (
    <a
      href={href}
      className="group inline-flex items-center justify-center gap-1.5 transition-all active:translate-y-px"
      style={{
        height: h,
        width: fullWidth ? "100%" : "auto",
        padding: "0 " + (size === "lg" ? 22 : 16) + "px",
        borderRadius: "var(--radius-sm)",
        background: "var(--cobalt-500)",
        color: "var(--white)",
        boxShadow: "var(--shadow-accent)",
        ...sans,
        fontSize,
        fontWeight: "var(--weight-semibold)",
        lineHeight: 1,
        letterSpacing: "var(--tracking-tight)",
      }}
    >
      {children}
      <ArrowRight size={size === "lg" ? 17 : 15} className="transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-[28px] md:text-[36px]"
      style={{ ...display, fontWeight: "var(--weight-bold)", lineHeight: "var(--leading-snug)", color: "var(--text-primary)" }}
    >
      {children}
    </h2>
  );
}

export default function HomePage() {
  return (
    <main className="mx-auto max-w-[1180px] px-5 pb-28 md:px-8">
      {/* NAV + HERO, shader-backed — breaks out to full viewport width so the
          gradient reaches both edges, independent of main's max-w column */}
      <div style={{ position: "relative", left: "50%", right: "50%", marginLeft: "-50vw", marginRight: "-50vw", width: "100vw", overflow: "hidden" }}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{
            zIndex: 0,
            opacity: 0.4,
            maskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
          }}
        >
          <ShaderBackground className="h-full w-full" />
        </div>
        <div className="mx-auto max-w-[1180px] px-5 md:px-8" style={{ position: "relative", zIndex: 1 }}>
      <nav className="flex h-20 items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <a
            href={SIGN_IN}
            className="hidden text-[14px] md:inline"
            style={{ ...sans, fontWeight: "var(--weight-medium)", color: "var(--text-secondary)" }}
          >
            Sign in
          </a>
          <PrimaryButton href={SIGN_UP} size="sm">
            Create account
          </PrimaryButton>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-10 md:pt-16">
        <div className="grid gap-10 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <span
              className="inline-flex items-center gap-1.5 text-[11px]"
              style={{
                height: 26,
                padding: "0 10px",
                borderRadius: "var(--radius-pill)",
                background: "var(--status-live-bg)",
                color: "var(--status-live-fg)",
                border: "1px solid var(--status-live-bd)",
                ...mono,
                fontWeight: "var(--weight-semibold)",
                letterSpacing: "var(--tracking-caps)",
                textTransform: "uppercase",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />
              Live now
            </span>

            <h1
              className="mt-5 text-[38px] md:text-[56px]"
              style={{ ...display, fontWeight: "var(--weight-extrabold)", lineHeight: "var(--leading-tight)", letterSpacing: "var(--tracking-tighter)", color: "var(--text-primary)" }}
            >
              The brand deal CRM that doesn&apos;t make you feel like you&apos;re running an agency.
            </h1>

            <p className="mt-5 max-w-[52ch] text-[17px]" style={{ ...sans, fontWeight: "var(--weight-regular)", lineHeight: "var(--leading-normal)", color: "var(--text-secondary)" }}>
              Built for solo creators with 10K to 500K followers who actually close
              deals. Stop tracking sponsors in spreadsheets and Notion databases
              that quietly fail.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]" style={{ ...mono, fontWeight: "var(--weight-medium)", color: "var(--text-muted)" }}>
              <span>Solo-built in public</span>
              <span aria-hidden style={{ color: "var(--border-strong)" }}>/</span>
              <span>$9/mo founder pricing</span>
              <span aria-hidden style={{ color: "var(--border-strong)" }}>/</span>
              <span>First 200 creators</span>
            </div>
          </div>

          {/* CONVERSION CARD */}
          <div className="md:col-span-5">
            <div
              className="p-6 md:p-7"
              style={{ borderRadius: "var(--radius-xl)", border: "1px solid var(--border-subtle)", background: "var(--surface-card)", boxShadow: "var(--shadow-md)" }}
            >
              <span
                className="text-[11px]"
                style={{ ...mono, fontWeight: "var(--weight-semibold)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--cobalt-600)" }}
              >
                Get started
              </span>
              <div className="mt-2.5 flex items-baseline gap-1.5">
                <span className="text-[44px]" style={{ ...display, fontWeight: "var(--weight-extrabold)", lineHeight: 1, color: "var(--text-primary)", letterSpacing: "var(--tracking-tighter)" }}>
                  $0
                </span>
                <span className="text-[13px]" style={{ ...sans, color: "var(--text-muted)" }}>forever, free tier</span>
              </div>

              <div className="mt-5 flex flex-col gap-2.5">
                {["Up to 3 active deals", "Pipeline board", "Manual reminders"].map((t) => (
                  <div key={t} className="flex items-center gap-2.5">
                    <CircleCheck size={16} style={{ color: "var(--cobalt-500)", flexShrink: 0 }} />
                    <span className="text-[13px]" style={{ ...sans, color: "var(--text-secondary)" }}>{t}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <PrimaryButton href={SIGN_UP} size="lg" fullWidth>
                  Start for free
                </PrimaryButton>
              </div>
              <p className="mt-3 text-center text-[12.5px]" style={{ ...sans, color: "var(--text-muted)" }}>
                <a href="#pricing" style={{ color: "var(--cobalt-600)" }}>More deals? See founder pricing</a>
                {" "}·{" "}
                <a href={SIGN_IN} style={{ color: "var(--cobalt-600)" }}>
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 md:mt-20">
          <ProductPreview />
        </div>
      </section>
        </div>
      </div>

      {/* SOCIAL PROOF */}
      <section className="mt-24 md:mt-32">
        <QuoteWall />
      </section>

      {/* TESTIMONIALS */}
      <section className="mt-24 md:mt-32">
        <div className="mb-2 max-w-[60ch]">
          <SectionHeading>What creators are saying.</SectionHeading>
          <p className="mt-3 text-[16px]" style={{ ...sans, color: "var(--text-secondary)" }}>
            Early creators running their sponsorships through SponsorDesk today.
          </p>
        </div>
        <TestimonialsWall />
      </section>

      {/* FEATURES */}
      <section id="how" className="mt-24 md:mt-32">
        <div className="mb-10 max-w-[60ch]">
          <SectionHeading>What you actually need to run deals without losing them.</SectionHeading>
          <p className="mt-3 text-[16px]" style={{ ...sans, color: "var(--text-secondary)" }}>
            No agency dashboards. No 14-step onboarding. No AI features you didn&apos;t ask for.
          </p>
        </div>
        <FeatureGrid />
      </section>

      {/* COMPARISON */}
      <section className="mt-24 md:mt-32">
        <div className="mb-10 max-w-[60ch]">
          <SectionHeading>How it stacks up.</SectionHeading>
          <p className="mt-3 text-[16px]" style={{ ...sans, color: "var(--text-secondary)" }}>
            The honest comparison. No asterisks.
          </p>
        </div>
        <ComparisonTable />
      </section>

      {/* PRICING */}
      <section id="pricing" className="mt-24 md:mt-32">
        <div className="mb-10 max-w-[60ch]">
          <SectionHeading>Three plans. Start free, upgrade when it's worth it.</SectionHeading>
          <p className="mt-3 text-[16px]" style={{ ...sans, color: "var(--text-secondary)" }}>
            The first 200 creators lock in founder pricing for life.
          </p>
        </div>
        <Pricing />
      </section>

      {/* FAQ */}
      <section className="mt-24 md:mt-32">
        <div className="mb-10 max-w-[60ch]">
          <SectionHeading>The questions I expect you to ask.</SectionHeading>
        </div>
        <FAQ />
      </section>

      {/* UPDATES — secondary, low-friction */}
      <section id="updates" className="mt-24 md:mt-32">
        <div
          className="mx-auto max-w-[560px] p-7 text-center md:p-9"
          style={{ borderRadius: "var(--radius-xl)", border: "1px dashed var(--border-strong)" }}
        >
          <h3 className="text-[17px]" style={{ ...sans, fontWeight: "var(--weight-semibold)", color: "var(--text-primary)" }}>
            Not ready to sign up yet?
          </h3>
          <p className="mt-1.5 text-[13px]" style={{ ...sans, color: "var(--text-secondary)" }}>
            Leave your email and we&apos;ll keep you posted on new features and the Pro tier.
          </p>
          <div className="mt-5">
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mt-24 md:mt-32">
        <div
          className="px-7 py-12 text-center md:px-12 md:py-16"
          style={{ borderRadius: "var(--radius-xl)", background: "var(--ink-900)" }}
        >
          <h2
            className="mx-auto max-w-[20ch] text-[28px] md:text-[36px]"
            style={{ ...display, fontWeight: "var(--weight-bold)", lineHeight: "var(--leading-snug)", color: "var(--white)" }}
          >
            Stop losing deals to a spreadsheet you forgot to open.
          </h2>
          <p className="mx-auto mt-4 max-w-[55ch] text-[15.5px]" style={{ ...sans, color: "rgba(255,255,255,.65)" }}>
            SponsorDesk is live today. Create your account and lock in $9/mo founder pricing before the first 200 seats are gone.
          </p>
          <div className="mt-7 flex justify-center">
            <PrimaryButton href={SIGN_UP} size="lg">
              Create your account
            </PrimaryButton>
          </div>
        </div>
      </section>

      {/* FOOTER, shader-backed */}
      <footer
        className="relative mt-24 pt-16 pb-10 md:mt-32 md:pt-20"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        {/* Full-bleed to viewport width, tall enough for the gradient to actually read as a gradient
            (not a squished sliver), faded top+bottom so it blends instead of hard-cutting at the edges */}
        <div
          aria-hidden
          className="pointer-events-none absolute overflow-hidden"
          style={{
            zIndex: 0,
            opacity: 0.16,
            top: 0,
            height: 280,
            left: "50%",
            right: "50%",
            marginLeft: "-50vw",
            marginRight: "-50vw",
            width: "100vw",
            maskImage: "linear-gradient(to bottom, transparent, black 35%, black 65%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 35%, black 65%, transparent)",
          }}
        >
          <ShaderBackground className="h-full w-full" />
        </div>
        <div className="relative flex flex-col gap-10 md:flex-row md:items-start md:justify-between" style={{ zIndex: 1 }}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Image src="/logo-mark.png" alt="" width={16} height={18} style={{ height: 18, width: "auto" }} />
              <span className="text-[15px]" style={{ ...display, fontWeight: "var(--weight-bold)", color: "var(--text-primary)", letterSpacing: "var(--tracking-tight)" }}>
                SponsorDesk
              </span>
            </div>
            <p className="text-[13px]" style={{ ...sans, color: "var(--text-muted)" }}>
              Built solo in public.
            </p>
          </div>

          <a
            href="/tools/invoice-generator"
            className="text-[13px]"
            style={{ ...sans, fontWeight: "var(--weight-medium)", color: "var(--cobalt-600)" }}
          >
            Free invoice generator <span aria-hidden>→</span>
          </a>

          <div className="flex flex-col gap-2 md:items-end">
            <a href="mailto:hello@sponsordesk.io" className="text-[13px]" style={{ ...sans, fontWeight: "var(--weight-medium)", color: "var(--text-secondary)" }}>
              hello@sponsordesk.io
            </a>
            <span className="text-[12px]" style={{ ...mono, color: "var(--text-muted)" }}>© 2026 SponsorDesk</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
