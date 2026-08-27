"use client";

import { useReducedMotion, motion } from "motion/react";

const QUOTES = [
  {
    quote:
      "I have 14 active sponsors right now. Last week I forgot to follow up with one for 11 days and lost the contract. There has to be a better way.",
    name: "Mid-tier YouTuber",
    handle: "210K subs · 6 brand deals/mo",
  },
  {
    quote:
      "I track my deals in a Notion database and it's fine until it isn't. I shipped an integration without tracking the usage-rights window and got burned.",
    name: "Newsletter creator",
    handle: "47K subs · 3 deals/mo",
  },
];

export function QuoteWall() {
  const reduce = useReducedMotion();
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {QUOTES.map((q, i) => (
        <motion.figure
          key={i}
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="py-2 pl-5"
          style={{ borderLeft: "2px solid var(--cobalt-400)" }}
        >
          <blockquote style={{ font: "var(--type-body)", fontSize: 16, color: "var(--text-primary)", lineHeight: "var(--leading-relaxed)" }}>
            &ldquo;{q.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-3" style={{ font: "var(--type-body-sm)", color: "var(--text-muted)" }}>
            <span style={{ fontWeight: "var(--weight-medium)", color: "var(--text-secondary)" }}>{q.name}</span>
            <span className="mx-2">·</span>
            <span style={{ font: "var(--type-data)" }}>{q.handle}</span>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}
