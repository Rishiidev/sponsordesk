"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Check, Star } from "lucide-react";
import confetti from "canvas-confetti";
import { useMediaQuery } from "@/hooks/use-media-query";

const SIGN_UP = "https://sponsordesk-app-v2.vercel.app/sign-up";

type Plan = {
  name: string;
  tag: string;
  monthly: number;
  yearly: number;
  blurb: string;
  features: string[];
  buttonText: string;
  href: string;
  isPopular: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Free",
    tag: "Get started",
    monthly: 0,
    yearly: 0,
    blurb: "Try the pipeline before you commit to anything.",
    features: ["Up to 3 active deals", "Pipeline board", "Manual reminders"],
    buttonText: "Start for free",
    href: SIGN_UP,
    isPopular: false,
  },
  {
    name: "Founder",
    tag: "First 200 only",
    monthly: 9,
    yearly: 7,
    blurb: "For creators with up to 25 active deals at a time. Locked in for life.",
    features: [
      "Up to 25 active deals",
      "Unlimited pipeline tracking",
      "Deliverable + follow-up reminders",
      "Locked in for life",
    ],
    buttonText: "Create your account",
    href: SIGN_UP,
    isPopular: true,
  },
  {
    name: "Pro",
    tag: "After launch",
    monthly: 29,
    yearly: 23,
    blurb: "Unlimited deals, Stripe payouts, AI follow-up drafts, and priority support.",
    features: [
      "Everything in Founder",
      "Unlimited active deals",
      "Stripe payouts",
      "AI follow-up drafts",
      "Priority support",
    ],
    buttonText: "Notify me when Pro ships",
    href: "#updates",
    isPopular: false,
  },
];

const display: React.CSSProperties = { fontFamily: "var(--font-display)" };
const sans: React.CSSProperties = { fontFamily: "var(--font-sans)" };
const mono: React.CSSProperties = { fontFamily: "var(--font-mono)" };

function AnimatedPrice({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const spring = useSpring(value, { duration: 0.5, bounce: 0 });
  const rounded = useTransform(spring, (v) => "$" + Math.round(v));

  if (reduce) {
    return <>${value}</>;
  }
  spring.set(value);
  return <motion.span>{rounded}</motion.span>;
}

function Toggle({ yearly, onChange }: { yearly: boolean; onChange: (v: boolean) => void }) {
  const ref = useRef<HTMLButtonElement>(null);

  function handleClick() {
    const next = !yearly;
    onChange(next);
    if (next && ref.current) {
      const r = ref.current.getBoundingClientRect();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight },
        colors: ["#2b4bff", "#6c81ff", "#a7b4ff"],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <span className="text-[14px]" style={{ ...sans, color: yearly ? "var(--text-muted)" : "var(--text-primary)", fontWeight: "var(--weight-semibold)" }}>
        Monthly
      </span>
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={yearly}
        onClick={handleClick}
        className="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors"
        style={{ background: yearly ? "var(--cobalt-500)" : "var(--border-strong)" }}
      >
        <motion.span
          className="inline-block h-5 w-5 rounded-full bg-white"
          animate={{ x: yearly ? 26 : 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
        />
      </button>
      <span className="text-[14px]" style={{ ...sans, color: yearly ? "var(--text-primary)" : "var(--text-muted)", fontWeight: "var(--weight-semibold)" }}>
        Yearly <span style={{ color: "var(--cobalt-600)" }}>(save ~20%)</span>
      </span>
    </div>
  );
}

export function Pricing() {
  const [yearly, setYearly] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reduce = useReducedMotion();

  return (
    <div>
      <div className="mb-8 flex justify-center">
        <Toggle yearly={yearly} onChange={setYearly} />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
            whileInView={{
              opacity: 1,
              y: 0,
              scale: isDesktop && plan.isPopular ? 1.04 : 1,
            }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col p-7"
            style={{
              borderRadius: "var(--radius-lg)",
              border: plan.isPopular ? "1.5px solid var(--cobalt-500)" : "1px solid var(--border-subtle)",
              background: "var(--surface-card)",
              boxShadow: plan.isPopular ? "var(--shadow-md)" : "var(--shadow-xs)",
            }}
          >
            {plan.isPopular && (
              <div
                className="absolute right-0 top-0 flex items-center gap-1 px-3 py-1"
                style={{ background: "var(--cobalt-500)", borderRadius: "0 var(--radius-lg) 0 var(--radius-md)" }}
              >
                <Star size={12} fill="currentColor" style={{ color: "var(--white)" }} />
                <span className="text-[11px]" style={{ ...mono, color: "var(--white)", fontWeight: "var(--weight-semibold)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase" }}>
                  Popular
                </span>
              </div>
            )}

            <div className="flex items-baseline justify-between">
              <h3 className="text-[18px]" style={{ ...sans, fontWeight: "var(--weight-semibold)", color: "var(--text-primary)" }}>
                {plan.name}
              </h3>
              <span className="text-[11px]" style={{ ...mono, fontWeight: "var(--weight-semibold)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: plan.isPopular ? "var(--cobalt-600)" : "var(--text-muted)" }}>
                {plan.tag}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-[44px]" style={{ ...display, fontWeight: "var(--weight-extrabold)", lineHeight: 1, color: "var(--text-primary)" }}>
                <AnimatedPrice value={yearly ? plan.yearly : plan.monthly} />
              </span>
              <span className="text-[13px]" style={{ ...sans, color: "var(--text-muted)" }}>
                {plan.monthly === 0 ? "forever" : "/ month" + (yearly ? ", billed yearly" : "")}
              </span>
            </div>

            <p className="mt-3 text-[13px]" style={{ ...sans, color: "var(--text-secondary)" }}>
              {plan.blurb}
            </p>

            <ul className="mt-5 flex flex-1 flex-col gap-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check size={15} style={{ color: "var(--cobalt-500)", marginTop: 2, flexShrink: 0 }} />
                  <span className="text-left text-[13.5px]" style={{ ...sans, color: "var(--text-secondary)" }}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href={plan.href}
              className="mt-6 inline-flex h-10 w-full items-center justify-center text-[14px] transition-colors"
              style={
                plan.isPopular
                  ? { borderRadius: "var(--radius-sm)", background: "var(--cobalt-500)", color: "var(--white)", ...sans, fontWeight: "var(--weight-semibold)", boxShadow: "var(--shadow-accent)" }
                  : { borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", ...sans, fontWeight: "var(--weight-semibold)" }
              }
            >
              {plan.buttonText}
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
