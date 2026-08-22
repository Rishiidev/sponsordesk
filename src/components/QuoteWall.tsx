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
          className="border-l-2 border-[var(--color-accent)] pl-5 py-2"
        >
          <blockquote className="text-[16px] leading-relaxed text-[var(--color-ink)]">
            “{q.quote}”
          </blockquote>
          <figcaption className="mt-3 text-[13px] text-[var(--color-ink-3)]">
            <span className="font-medium text-[var(--color-ink-2)]">{q.name}</span>
            <span className="mx-2">·</span>
            <span className="font-mono text-[12px]">{q.handle}</span>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}