"use client";

import { motion, useReducedMotion } from "motion/react";

// Real product-shape preview built from actual components, not faked with divs.
// A "Kanban column" rendered as native HTML — this is what the user will see
// when they actually use the product, not a stylized screenshot.
const PIPELINE = [
  { stage: "Inbound", items: ["Athleta", "Magic Spoon"], accent: false },
  { stage: "Negotiating", items: ["Notion Q1 launch", "Beehiiv sponsorship"], accent: true },
  { stage: "Live", items: ["Squarespace"], accent: false },
  { stage: "Paid", items: ["ConvertKit · Mar"], accent: false },
];

export function ProductPreview() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden rounded-[var(--radius-soft)] border border-[var(--color-line)] bg-white shadow-[0_1px_0_rgba(0,0,0,0.02)]"
    >
      {/* App chrome */}
      <div className="flex items-center justify-between border-b border-[var(--color-line)] bg-[var(--color-paper-2)] px-4 py-2.5.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-[12px] text-[var(--color-ink-3)]">
            sponsordesk.app / pipeline
          </span>
        </div>
        <span className="font-mono text-[11px] text-[var(--color-ink-3)]">
          Updated 2m ago
        </span>
      </div>

      {/* Pipeline */}
      <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4">
        {PIPELINE.map((col) => (
          <div key={col.stage} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-ink-3)]">
                {col.stage}
              </span>
              <span className="font-mono text-[11px] text-[var(--color-ink-3)]">
                {col.items.length}
              </span>
            </div>
            {col.items.map((item) => (
              <div
                key={item}
                className="rounded-[var(--radius-tight)] border border-[var(--color-line)] bg-white p-3 text-[13px] text-[var(--color-ink)]"
                style={
                  col.accent
                    ? {
                        borderColor: "var(--color-accent)",
                        background: "var(--color-accent-soft)",
                      }
                    : undefined
                }
              >
                <div className="font-medium">{item}</div>
                <div className="mt-1.5 font-mono text-[11px] text-[var(--color-ink-3)]">
                  {col.stage === "Inbound"
                    ? "Received 3d ago"
                    : col.stage === "Negotiating"
                    ? "Reply due Thu"
                    : col.stage === "Live"
                    ? "Delivers Fri"
                    : "Paid Mar 4"}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}