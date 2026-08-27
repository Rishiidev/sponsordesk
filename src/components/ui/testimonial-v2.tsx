"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Youtube,
  Mail,
  Mic,
  Instagram,
  Video,
  Twitch,
  Rss,
  Linkedin,
  Camera,
  type LucideIcon,
} from "lucide-react";

interface Testimonial {
  text: string;
  icon: LucideIcon;
  name: string;
  role: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    text: "Rate card used to live in a Google Doc nobody could find. Now every sponsor sees the same numbers and stops trying to talk me down.",
    icon: Mail,
    name: "Newsletter creator",
    role: "32K subs · 4 deals/mo",
  },
  {
    text: "I stopped losing ad reads to my own inbox. Everything from first email to invoice sent lives in one board now.",
    icon: Mic,
    name: "Podcaster",
    role: "18K downloads/ep · 5 deals/mo",
  },
  {
    text: "Usage rights windows used to blow past me completely. Now I get a reminder three days before a license expires, every time.",
    icon: Youtube,
    name: "YouTuber",
    role: "95K subs · 3 deals/mo",
  },
  {
    text: "Every brand wants a different deliverable schedule. Having one pipeline instead of six DMs saved my sanity during Q4.",
    icon: Instagram,
    name: "Instagram creator",
    role: "64K followers · 7 deals/mo",
  },
  {
    text: "I used to find out a deal stalled when the brand followed up, not before. Now I see it stalling three days earlier.",
    icon: Video,
    name: "TikTok creator",
    role: "310K followers · 8 deals/mo",
  },
  {
    text: "Sponsors ask for the same three numbers every time. I stopped rebuilding that slide and just send a link now.",
    icon: Twitch,
    name: "Twitch streamer",
    role: "22K followers · 2 deals/mo",
  },
  {
    text: "My old system was four spreadsheets and a prayer. This is one board and it's actually stayed accurate for three months straight.",
    icon: Rss,
    name: "Blogger",
    role: "40K monthly readers · 3 deals/mo",
  },
  {
    text: "B2B sponsors move slow and then want everything yesterday. Having deadlines in one place instead of my memory changed that.",
    icon: Linkedin,
    name: "LinkedIn creator",
    role: "28K followers · 4 deals/mo",
  },
  {
    text: "I only run a couple deals a year, but I used to lose track of every single one between them. Not anymore.",
    icon: Camera,
    name: "Niche creator",
    role: "12K followers · 1-2 deals/mo",
  },
];

function TestimonialsColumn(props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) {
  return (
    <div className={props.className}>
      <motion.ul
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="m-0 flex list-none flex-col gap-6 p-0 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, icon: Icon, name, role }, i) => (
                <motion.li
                  key={`${index}-${i}`}
                  aria-hidden={index === 1 ? "true" : "false"}
                  tabIndex={index === 1 ? -1 : 0}
                  whileHover={{
                    scale: 1.03,
                    y: -8,
                    transition: { type: "spring", stiffness: 400, damping: 17 },
                  }}
                  whileFocus={{
                    scale: 1.03,
                    y: -8,
                    transition: { type: "spring", stiffness: 400, damping: 17 },
                  }}
                  className="w-full max-w-xs cursor-default select-none p-8 transition-shadow focus:outline-none"
                  style={{
                    borderRadius: "var(--radius-xl)",
                    border: "1px solid var(--border-subtle)",
                    background: "var(--surface-card)",
                    boxShadow: "var(--shadow-md)",
                  }}
                >
                  <blockquote className="m-0 p-0">
                    <p
                      style={{
                        font: "var(--type-body)",
                        color: "var(--text-secondary)",
                        lineHeight: "var(--leading-relaxed)",
                      }}
                    >
                      {text}
                    </p>
                    <footer className="mt-6 flex items-center gap-3">
                      <span
                        aria-hidden
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                        style={{ background: "var(--cobalt-100)", color: "var(--cobalt-600)" }}
                      >
                        <Icon size={18} strokeWidth={2} />
                      </span>
                      <div className="flex flex-col">
                        <cite
                          className="not-italic"
                          style={{ font: "var(--type-body-sm)", fontWeight: "var(--weight-semibold)", color: "var(--text-primary)" }}
                        >
                          {name}
                        </cite>
                        <span style={{ font: "var(--type-body-sm)", color: "var(--text-muted)" }}>{role}</span>
                      </div>
                    </footer>
                  </blockquote>
                </motion.li>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.ul>
    </div>
  );
}

export function TestimonialsWall({
  testimonials = defaultTestimonials,
}: {
  testimonials?: Testimonial[];
}) {
  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  return (
    <div
      className="mt-10 flex justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
      style={{ maxHeight: 740 }}
      role="region"
      aria-label="Scrolling testimonials"
    >
      <TestimonialsColumn testimonials={firstColumn} duration={15} />
      <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
      <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
    </div>
  );
}
