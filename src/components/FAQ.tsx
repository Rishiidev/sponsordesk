"use client";

import { useReducer } from "react";
import { ChevronDown } from "lucide-react";

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
    a: "It's live now. Create your account above and start tracking deals immediately — no wait, no invite needed.",
  },
  {
    q: "Will it integrate with YouTube / Instagram / TikTok analytics?",
    a: "Not on day one. Day one is the deal pipeline. Analytics integrations land after, based on what creators ask for. If you want a specific one, tell us in the updates form below.",
  },
  {
    q: "What about my existing spreadsheet?",
    a: "You can import it on day one. SponsorDesk accepts CSV and Notion-database exports. The whole point is to stop living in a spreadsheet.",
  },
  {
    q: "How much will it cost?",
    a: "The first 200 creators lock in $9/mo founder pricing for life. After that, expect $19 to $29/mo.",
  },
];

export function FAQ() {
  const [openIdx, toggle] = useReducer(
    (s: number | null, i: number | null) => (i === s ? null : i),
    0,
  );

  return (
    <div style={{ borderTop: "1px solid var(--border-subtle)" }}>
      {FAQS.map((f, i) => {
        const open = openIdx === i;
        return (
          <div key={i} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <button
              onClick={() => toggle(i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 py-5 text-left outline-none"
            >
              <span style={{ font: "var(--type-h3)", fontSize: 15.5, color: "var(--text-primary)" }}>{f.q}</span>
              <span
                className="shrink-0 transition-transform"
                style={{ color: "var(--text-muted)", transform: open ? "rotate(180deg)" : "none" }}
              >
                <ChevronDown size={18} strokeWidth={2} />
              </span>
            </button>
            <div
              className="grid transition-all duration-300 ease-out"
              style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
            >
              <div className="overflow-hidden">
                <p className="pb-5 pr-8" style={{ font: "var(--type-body-sm)", fontSize: 14.5, color: "var(--text-secondary)", lineHeight: "var(--leading-relaxed)" }}>
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
