"use client";

import { motion, useReducedMotion } from "motion/react";
import { Kanban, FileText, Bell, CircleCheck, Banknote, History, type LucideIcon } from "lucide-react";

const FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Kanban,
    title: "Pipeline at a glance",
    body: "Drag deals from inbound to negotiating to live to paid. Stop hunting through email threads to figure out where each brand stands.",
  },
  {
    icon: FileText,
    title: "Payment terms, in writing",
    body: "Set net days, a late fee, and a plain-language terms note per deal. The brand sees it on every reminder — no more \"that wasn't the deal\" after the fact.",
  },
  {
    icon: Bell,
    title: "Follow-up reminders that don't slip",
    body: "Auto-reminders 3, 7, and 14 days after a brand goes quiet. The single biggest source of lost revenue on the list.",
  },
  {
    icon: CircleCheck,
    title: "Deliverable checklists",
    body: "Track every deliverable you owe per deal: drafts, posts, usage-rights windows, payment milestones. Check them off as you ship.",
  },
  {
    icon: Banknote,
    title: "Invoice + get paid",
    body: "Generate an invoice from a closed deal. Stripe payouts. Net-15 reminders. No more chasing payment for work you already shipped.",
  },
  {
    icon: History,
    title: "Thread history per brand",
    body: "Every email, DM, and call note logged against the deal. Walk into a 6-month-later negotiation with full context.",
  },
];

export function FeatureGrid() {
  const reduce = useReducedMotion();
  return (
    <div
      className="grid grid-cols-1 gap-px overflow-hidden md:grid-cols-2 lg:grid-cols-3"
      style={{
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-subtle)",
        background: "var(--border-subtle)",
      }}
    >
      {FEATURES.map((f, i) => (
        <motion.div
          key={f.title}
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 md:p-7"
          style={{ background: "var(--surface-card)" }}
        >
          <span
            className="inline-flex h-10 w-10 items-center justify-center"
            style={{
              borderRadius: "var(--radius-md)",
              background: "var(--cobalt-100)",
              color: "var(--cobalt-600)",
            }}
          >
            <f.icon size={19} strokeWidth={2} />
          </span>
          <h3
            className="mt-4"
            style={{ font: "var(--type-h3)", color: "var(--text-primary)", letterSpacing: "var(--tracking-tight)" }}
          >
            {f.title}
          </h3>
          <p className="mt-2" style={{ font: "var(--type-body-sm)", color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)" }}>
            {f.body}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
