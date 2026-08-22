"use client";

import { useReducer } from "react";
import { Plus, Minus } from "@phosphor-icons/react";

const FAQS = [
  {
    q: "Is this just a Notion template with extra steps?",
    a: "It's the opposite of one. Notion templates fail when you stop opening them. SponsorDesk runs in the background with follow-up reminders, deliverable windows, and payment chasing, without you logging in. Templates don't do that.",
  },
  {
    q: "How is this different from GRIN or July?",
    a: "GRIN ($478+/mo) and CreatorIQ serve brands running influencer campaigns. July ($50+/mo) serves agencies managing rosters of creators. Neither is built for a solo creator with 200K subs and 6 inbound deals a month. That's the gap.",
  },
  {
    q: "When will it launch?",
    a: "Waitlist members get founder pricing and access in roughly 6 to 10 weeks. I'm building this solo, so I'd rather ship something good than ship something fast.",
  },
  {
    q: "Will it integrate with YouTube / Instagram / TikTok analytics?",
    a: "Not on day one. Day one is the deal pipeline. Analytics integrations land after, based on what waitlist members ask for. If you want a specific one, tell me in the form.",
  },
  {
    q: "What about my existing spreadsheet?",
    a: "You can import it on day one. SponsorDesk accepts CSV and Notion-database exports. The whole point is to stop living in a spreadsheet.",
  },
  {
    q: "How much will it cost?",
    a: "Waitlist members lock in $9/mo founder pricing for life. After public launch, expect $19 to $29/mo.",
  },
];

export function FAQ() {
  const [openIdx, toggle] = useReducer(
    (s: number | null, i: number | null) => (i === s ? null : i),
    0,
  );

  return (
    <div className="border-t border-[var(--color-line)]">
      {FAQS.map((f, i) => {
        const open = openIdx === i;
        return (
          <div key={i} className="border-b border-[var(--color-line)]">
            <button
              onClick={() => toggle(i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 py-5 text-left outline-none focus-visible:text-[var(--color-accent)]"
            >
              <span className="text-[15.5px] font-medium text-[var(--color-ink)]">
                {f.q}
              </span>
              <span
                className="shrink-0 text-[var(--color-ink-3)] transition-transform"
                aria-hidden
                style={{ transform: open ? "rotate(0deg)" : "rotate(0deg)" }}
              >
                {open ? <Minus size={18} weight="bold" /> : <Plus size={18} weight="bold" />}
              </span>
            </button>
            <div
              className="grid transition-all duration-300 ease-out"
              style={{
                gridTemplateRows: open ? "1fr" : "0fr",
                opacity: open ? 1 : 0,
              }}
            >
              <div className="overflow-hidden">
                <p className="pb-5 pr-8 text-[14.5px] leading-relaxed text-[var(--color-ink-2)]">
                  {f.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}