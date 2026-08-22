"use client";

import { motion, useReducedMotion } from "motion/react";
import { Receipt, FileText, Bell, CheckSquare, ChatCircle, Kanban } from "@phosphor-icons/react/dist/ssr";

const FEATURES = [
  {
    icon: Kanban,
    title: "Pipeline at a glance",
    body: "Drag deals from inbound to negotiating to live to paid. Stop hunting through email threads to figure out where each brand stands.",
  },
  {
    icon: FileText,
    title: "Contract storage without the chaos",
    body: "Attach contracts, usage-rights docs, and rate cards per deal. Find them in two clicks when an agency asks for proof.",
  },
  {
    icon: Bell,
    title: "Follow-up reminders that don't slip",
    body: "Auto-reminders 3, 7, and 14 days after a brand goes quiet. The single biggest source of lost revenue on the list.",
  },
  {
    icon: CheckSquare,
    title: "Deliverable checklists",
    body: "Track every deliverable you owe per deal: drafts, posts, usage-rights windows, payment milestones. Check them off as you ship.",
  },
  {
    icon: Receipt,
    title: "Invoice + get paid",
    body: "Generate an invoice from a closed deal. Stripe payouts. Net-15 reminders. No more chasing payment for work you already shipped.",
  },
  {
    icon: ChatCircle,
    title: "Thread history per brand",
    body: "Every email, DM, and call note logged against the deal. Walk into a 6-month-later negotiation with full context.",
  },
];

export function FeatureGrid() {
  const reduce = useReducedMotion();
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-soft)] border border-[var(--color-line)] bg-[var(--color-line)] md:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map((f, i) => (
        <motion.div
          key={f.title}
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white p-6 md:p-8"
        >
          <f.icon size={26} weight="duotone" className="text-[var(--color-accent)]" />
          <h3 className="mt-4 text-[16px] font-medium text-[var(--color-ink)]">
            {f.title}
          </h3>
          <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--color-ink-2)]">
            {f.body}
          </p>
        </motion.div>
      ))}
    </div>
  );
}