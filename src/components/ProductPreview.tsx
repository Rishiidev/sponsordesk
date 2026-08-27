"use client";

import { motion, useReducedMotion } from "motion/react";

type Stage = "Inbound" | "Negotiating" | "Live" | "Paid";

const STAGE_TONE: Record<Stage, { fg: string; bg: string; bd: string }> = {
  Inbound: { fg: "var(--status-idle-fg)", bg: "var(--status-idle-bg)", bd: "var(--status-idle-bd)" },
  Negotiating: { fg: "var(--status-due-fg)", bg: "var(--status-due-bg)", bd: "var(--status-due-bd)" },
  Live: { fg: "var(--status-live-fg)", bg: "var(--status-live-bg)", bd: "var(--status-live-bd)" },
  Paid: { fg: "var(--cobalt-600)", bg: "var(--cobalt-100)", bd: "var(--cobalt-200)" },
};

const PIPELINE: { stage: Stage; items: { name: string; meta: string }[] }[] = [
  {
    stage: "Inbound",
    items: [
      { name: "Athleta", meta: "Received 3d ago" },
      { name: "Magic Spoon", meta: "Received 3d ago" },
    ],
  },
  {
    stage: "Negotiating",
    items: [
      { name: "Notion Q1 launch", meta: "Reply due Thu" },
      { name: "Beehiiv sponsorship", meta: "Reply due Thu" },
    ],
  },
  { stage: "Live", items: [{ name: "Squarespace", meta: "Delivers Fri" }] },
  { stage: "Paid", items: [{ name: "ConvertKit · Mar", meta: "Paid Mar 4" }] },
];

function StagePill({ stage }: { stage: Stage }) {
  const t = STAGE_TONE[stage];
  return (
    <span
      className="inline-flex items-center gap-1.5"
      style={{
        height: 22,
        padding: "0 9px",
        borderRadius: "var(--radius-pill)",
        background: t.bg,
        color: t.fg,
        border: "1px solid " + t.bd,
        font: "var(--weight-semibold) var(--text-11)/1 var(--font-sans)",
        letterSpacing: "var(--tracking-caps)",
        textTransform: "uppercase",
      }}
    >
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor" }} />
      {stage}
    </span>
  );
}

export function ProductPreview() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden"
      style={{
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border-subtle)",
        background: "var(--surface-card)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      {/* App chrome */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: "1px solid var(--border-subtle)", background: "var(--surface-sunken)" }}
      >
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#ff5f57" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#febc2e" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#28c840" }} />
          <span className="ml-3" style={{ font: "var(--type-data)", color: "var(--text-muted)" }}>
            sponsordesk.app / pipeline
          </span>
        </div>
        <span
          className="hidden items-center gap-1.5 sm:inline-flex"
          style={{ font: "var(--type-data)", color: "var(--status-live-fg)" }}
        >
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--status-live-fg)" }} />
          Live · updated 2m ago
        </span>
      </div>

      {/* Pipeline */}
      <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4 md:gap-4 md:p-5">
        {PIPELINE.map((col) => (
          <div key={col.stage} className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <StagePill stage={col.stage} />
              <span style={{ font: "var(--type-data)", color: "var(--text-muted)" }}>{col.items.length}</span>
            </div>
            {col.items.map((item) => (
              <div
                key={item.name}
                className="p-3"
                style={{
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)",
                  background: col.stage === "Negotiating" ? "var(--status-due-bg)" : "var(--surface-card)",
                  boxShadow: "var(--shadow-xs)",
                }}
              >
                <div style={{ font: "var(--weight-semibold) var(--text-13)/1.3 var(--font-sans)", color: "var(--text-primary)" }}>
                  {item.name}
                </div>
                <div className="mt-1.5" style={{ font: "var(--type-data)", color: "var(--text-muted)" }}>
                  {item.meta}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
