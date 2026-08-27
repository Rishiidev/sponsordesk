"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";

type SubmitState = "idle" | "submitting" | "success" | "error";

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
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-2.5 text-[14px]"
        style={{ color: "var(--text-secondary)" }}
      >
        <span
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
          style={{ background: "var(--status-live-bg)", color: "var(--status-live-fg)" }}
        >
          <Check size={13} strokeWidth={2.5} />
        </span>
        You&apos;re subscribed. We&apos;ll email you about new features and the Pro tier.
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="flex-1">
        <input
          name="email"
          type="email"
          required
          placeholder="you@yourchannel.com"
          autoComplete="email"
          className="h-11 w-full rounded-[var(--radius-md)] px-4 text-[14px] outline-none transition-colors"
          style={{
            border: "1px solid var(--border-subtle)",
            background: "var(--surface-card)",
            color: "var(--text-primary)",
          }}
        />
        {state === "error" && error && (
          <p className="mt-1.5 text-[12.5px]" style={{ color: "var(--red-600)" }}>
            {error}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={state === "submitting"}
        className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-[var(--radius-md)] px-5 text-[14px] outline-none transition-all active:translate-y-px disabled:opacity-60"
        style={{
          background: "var(--ink-900)",
          color: "var(--white)",
          font: "var(--weight-semibold) var(--text-14)/1 var(--font-sans)",
          letterSpacing: "var(--tracking-tight)",
        }}
      >
        {state === "submitting" ? "Sending..." : "Notify me"}
        {state !== "submitting" && <ArrowRight size={15} />}
      </button>
    </form>
  );
}
