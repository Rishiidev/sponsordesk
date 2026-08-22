"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

type SubmitState = "idle" | "submitting" | "success" | "error";

const FOLLOWER_OPTIONS = [
  "Under 10K",
  "10K - 50K",
  "50K - 200K",
  "200K - 500K",
  "500K+",
];

const DEAL_VOLUME = [
  "0 (pre-monetization)",
  "1 - 3 / month",
  "4 - 10 / month",
  "10+ / month",
];

const CURRENT_TOOL = [
  "Spreadsheet",
  "Notion",
  "Trello / Asana",
  "Email + Calendar",
  "Other CRM (Pipedrive, etc.)",
  "I just remember",
];

export function WaitlistForm() {
  const reduce = useReducedMotion();
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setError(null);

    const fd = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        body: JSON.stringify({
          email: fd.get("email"),
          followers: fd.get("followers"),
          dealVolume: fd.get("dealVolume"),
          currentTool: fd.get("currentTool"),
          pain: fd.get("pain"),
          referrer: typeof document !== "undefined" ? document.referrer : "",
          utm_source: new URLSearchParams(window.location.search).get("utm_source"),
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Try again?");
      }

      setState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-[var(--radius-soft)] border border-[var(--color-line)] bg-white p-6 md:p-8"
      >
        <div className="flex items-start gap-3">
          <span
            className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent)]"
            aria-hidden
          />
          <div>
            <h3 className="text-lg font-medium text-[var(--color-ink)]">
              You&apos;re on the list.
            </h3>
            <p className="mt-1 text-[15px] leading-relaxed text-[var(--color-ink-2)]">
              I&apos;ll email you when seats open. You&apos;ll be among the first
              to try SponsorDesk and lock in founder pricing.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[var(--radius-soft)] border border-[var(--color-line)] bg-white p-5 md:p-7"
    >
      <div className="grid gap-4">
        <Field label="Email" required>
          <input
            name="email"
            type="email"
            required
            placeholder="you@yourchannel.com"
            autoComplete="email"
            className="w-full rounded-[var(--radius-tight)] border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-3)] outline-none transition-colors focus:border-[var(--color-ink)] focus:bg-white"
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Follower count">
            <Select name="followers" options={FOLLOWER_OPTIONS} placeholder="Select..." />
          </Field>

          <Field label="Brand deals / month">
            <Select name="dealVolume" options={DEAL_VOLUME} placeholder="Select..." />
          </Field>
        </div>

        <Field label="How do you track deals today?">
          <Select name="currentTool" options={CURRENT_TOOL} placeholder="Pick one" />
        </Field>

        <Field
          label="Biggest pain (one sentence)"
          helper="Optional. The most useful answers are brutally specific."
        >
          <textarea
            name="pain"
            rows={2}
            maxLength={200}
            placeholder="e.g. I forget to follow up after 2 weeks and lose the deal."
            className="w-full resize-none rounded-[var(--radius-tight)] border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-3)] outline-none transition-colors focus:border-[var(--color-ink)] focus:bg-white"
          />
        </Field>

        <button
          type="submit"
          disabled={state === "submitting"}
          className="group inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-tight)] bg-[var(--color-ink)] px-5 text-[15px] font-medium text-white outline-none hover:bg-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 disabled:opacity-60 transition-all active:translate-y-px"
        >
          {state === "submitting" ? (
            "Joining..."
          ) : (
            <>
              Get early access
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </>
          )}
        </button>

        {state === "error" && error && (
          <p className="text-[13px] text-[var(--color-accent)]">{error}</p>
        )}

        <p className="text-[12px] text-[var(--color-ink-3)]">
          No spam. Unsubscribe in one click.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  helper,
  required,
  children,
}: {
  label: string;
  helper?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[13px] font-medium text-[var(--color-ink-2)]">
        {label}
        {required && <span className="ml-0.5 text-[var(--color-accent)]">*</span>}
      </span>
      {children}
      {helper && (
        <span className="text-[12px] text-[var(--color-ink-3)]">{helper}</span>
      )}
    </label>
  );
}

function Select({
  name,
  options,
  placeholder,
}: {
  name: string;
  options: string[];
  placeholder: string;
}) {
  return (
    <select
      name={name}
      defaultValue=""
      required
      className="w-full appearance-none rounded-[var(--radius-tight)] border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-[15px] text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-ink)] focus:bg-white"
      style={{
        backgroundImage:
          'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2371717a%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>")',
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.875rem center",
        paddingRight: "2.25rem",
      }}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}