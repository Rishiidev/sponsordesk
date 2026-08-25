"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SKIP_KEY = "sponsordesk:onboarding:skipped";

type BrandFormState = {
  name: string;
  website: string;
  primaryContactName: string;
  primaryContactEmail: string;
};

type DealFormState = {
  title: string;
  brandName: string;
  amount: string;
  stage: "inbound" | "negotiating" | "live" | "paid" | "lost";
};

const STEP_LABELS = ["Welcome", "Add a brand", "Add a deal", "Founder pricing"];

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [brand, setBrand] = useState<BrandFormState>({
    name: "",
    website: "",
    primaryContactName: "",
    primaryContactEmail: "",
  });
  const [deal, setDeal] = useState<DealFormState>({
    title: "",
    brandName: "",
    amount: "",
    stage: "inbound",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If the user already skipped in this browser, jump them past onboarding
  // the moment they land. We don't force-render; we just skip rendering the
  // flow once detected so the back/next buttons don't fight the redirect.
  const [skipped, setSkipped] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(SKIP_KEY) === "true") {
        setSkipped(true);
        router.replace("/dashboard");
      } else {
        setSkipped(false);
      }
    } catch {
      setSkipped(false);
    }
  }, [router]);

  function skip() {
    try {
      localStorage.setItem(SKIP_KEY, "true");
    } catch {
      // Ignore quota / privacy mode — best-effort persistence only.
    }
    router.push("/dashboard");
  }

  async function submitBrand(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (!brand.name.trim()) {
        setError("Brand name is required.");
        setSubmitting(false);
        return;
      }
      const fd = new FormData();
      fd.set("name", brand.name.trim());
      if (brand.website.trim()) fd.set("website", brand.website.trim());
      if (brand.primaryContactName.trim()) fd.set("primaryContactName", brand.primaryContactName.trim());
      if (brand.primaryContactEmail.trim()) fd.set("primaryContactEmail", brand.primaryContactEmail.trim());
      const r = await fetch("/api/onboarding/brand", { method: "POST", body: fd });
      const data = await r.json();
      if (!data.success) {
        setError(data.error || "Could not create brand.");
        setSubmitting(false);
        return;
      }
      // Carry the brand id forward into the deal step so the user doesn't have
      // to re-pick it from a dropdown.
      (deal as any).__brandId = data.brand?.id;
      setDeal((d) => ({ ...d, brandName: brand.name.trim() }));
      setStep(3);
    } catch (err) {
      setError("Network error — try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitDeal(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("title", deal.title.trim());
      fd.set("amountCents", deal.amount ? String(Math.round(parseFloat(deal.amount) * 100)) : "");
      fd.set("stage", deal.stage);
      if ((deal as any).__brandId) fd.set("brandId", (deal as any).__brandId);
      const r = await fetch("/api/onboarding/deal", { method: "POST", body: fd });
      const data = await r.json();
      if (!data.success) {
        setError(data.error || "Could not create deal.");
        setSubmitting(false);
        return;
      }
      setStep(4);
    } catch (err) {
      setError("Network error — try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (skipped === null || skipped) {
    return (
      <div className="flex items-center justify-center p-12 text-[13px] text-[var(--color-ink-3)]">
        Loading onboarding…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[12px] uppercase tracking-wide text-[var(--color-ink-3)]">
            Step {step} of {STEP_LABELS.length}
          </p>
          <h1 className="text-[26px] font-semibold tracking-tight text-[var(--color-ink)]">
            {STEP_LABELS[step - 1]}
          </h1>
        </div>
        <ProgressDots step={step} total={STEP_LABELS.length} />
      </header>

      {step === 1 && (
        <section className="rounded-[12px] border border-[var(--color-line)] bg-white p-6 space-y-4">
          <p className="text-[14px] text-[var(--color-ink-2)]">
            Welcome to SponsorDesk. The fastest way to start is to drop in one
            brand you already work with and the deal you are chasing right now.
            Three steps. About two minutes.
          </p>
          <ul className="space-y-2 text-[13px] text-[var(--color-ink-3)]">
            <li>· Add a brand so deals have somewhere to live.</li>
            <li>· Add a deal so the pipeline has a row.</li>
            <li>· See the founder pricing for when you outgrow the free tier.</li>
          </ul>
          <StepNav
            onBack={null}
            onNext={() => setStep(2)}
            onSkip={skip}
            nextLabel="Start"
            nextDisabled={false}
          />
        </section>
      )}

      {step === 2 && (
        <section className="rounded-[12px] border border-[var(--color-line)] bg-white p-6 space-y-5">
          <form onSubmit={submitBrand} className="space-y-4">
            <Field
              label="Brand name"
              required
              value={brand.name}
              onChange={(v) => setBrand((b) => ({ ...b, name: v }))}
              placeholder="Acme Co."
            />
            <Field
              label="Website"
              value={brand.website}
              onChange={(v) => setBrand((b) => ({ ...b, website: v }))}
              placeholder="https://example.com"
              type="url"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Primary contact name"
                value={brand.primaryContactName}
                onChange={(v) => setBrand((b) => ({ ...b, primaryContactName: v }))}
              />
              <Field
                label="Primary contact email"
                value={brand.primaryContactEmail}
                onChange={(v) => setBrand((b) => ({ ...b, primaryContactEmail: v }))}
                type="email"
              />
            </div>
            {error && <p className="text-[13px] text-[var(--color-accent)]">{error}</p>}
            <StepNav
              onBack={() => setStep(1)}
              onNext={undefined}
              onSkip={skip}
              submitting={submitting}
              submitLabel="Save brand & continue"
            />
          </form>
        </section>
      )}

      {step === 3 && (
        <section className="rounded-[12px] border border-[var(--color-line)] bg-white p-6 space-y-5">
          <form onSubmit={submitDeal} className="space-y-4">
            <Field
              label="Deal title"
              required
              value={deal.title}
              onChange={(v) => setDeal((d) => ({ ...d, title: v }))}
              placeholder="Q1 YouTube integration"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Amount (USD)"
                value={deal.amount}
                onChange={(v) => setDeal((d) => ({ ...d, amount: v }))}
                placeholder="4500"
                type="number"
              />
              <Select
                label="Stage"
                value={deal.stage}
                onChange={(v) => setDeal((d) => ({ ...d, stage: v as DealFormState["stage"] }))}
                options={[
                  { value: "inbound", label: "Inbound" },
                  { value: "negotiating", label: "Negotiating" },
                  { value: "live", label: "Live" },
                  { value: "paid", label: "Paid" },
                  { value: "lost", label: "Lost" },
                ]}
              />
            </div>
            <p className="text-[12px] text-[var(--color-ink-3)]">
              {(deal as any).__brandId
                ? `Linked to brand: ${deal.brandName}.`
                : "No brand linked — that's fine, you can add one later."}
            </p>
            {error && <p className="text-[13px] text-[var(--color-accent)]">{error}</p>}
            <StepNav
              onBack={() => setStep(2)}
              onNext={undefined}
              onSkip={skip}
              submitting={submitting}
              submitLabel="Save deal & continue"
            />
          </form>
        </section>
      )}

      {step === 4 && (
        <section className="rounded-[12px] border border-[var(--color-line)] bg-white p-6 space-y-5">
          <p className="text-[14px] text-[var(--color-ink-2)]">
            You are on the free tier. When you outgrow it, Pro is ₹749 in India
            or $9 elsewhere — unlimited deals, daily digest, deliverable
            checklists, CSV export.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/settings/billing"
              className="inline-flex min-h-[44px] h-11 touch-manipulation items-center gap-2 rounded-[6px] bg-[var(--color-accent)] px-4 text-[13px] font-medium text-white hover:opacity-90"
            >
              See pricing →
            </a>
            <a
              href="/dashboard"
              className="inline-flex min-h-[44px] h-11 touch-manipulation items-center gap-2 rounded-[6px] border border-[var(--color-line)] bg-white px-3 text-[13px] font-medium text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]"
            >
              Go to dashboard
            </a>
          </div>
          <StepNav
            onBack={() => setStep(3)}
            onNext={undefined}
            onSkip={skip}
            nextLabel="Finish"
            onNextClick={skip}
          />
        </section>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-medium text-[var(--color-ink)]">
        {label}
        {required && <span className="text-[var(--color-accent)]"> *</span>}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[6px] border border-[var(--color-line)] bg-white px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-medium text-[var(--color-ink)]">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[6px] border border-[var(--color-line)] bg-white px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function StepNav({
  onBack,
  onNext,
  onSkip,
  onNextClick,
  nextLabel = "Next",
  submitLabel,
  nextDisabled,
  submitting,
}: {
  onBack: (() => void) | null | undefined;
  onNext?: (() => void) | undefined;
  onSkip: () => void;
  onNextClick?: () => void;
  nextLabel?: string;
  submitLabel?: string;
  nextDisabled?: boolean;
  submitting?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="text-[13px] font-medium text-[var(--color-ink-3)] hover:text-[var(--color-ink)]"
        >
          ← Back
        </button>
      ) : (
        <span />
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onSkip}
          className="text-[13px] font-medium text-[var(--color-ink-3)] hover:text-[var(--color-ink)]"
        >
          Skip for now
        </button>
        {submitLabel ? (
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-[44px] h-11 touch-manipulation items-center rounded-[6px] bg-[var(--color-accent)] px-4 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Saving..." : submitLabel}
          </button>
        ) : (
          <button
            type="button"
            disabled={nextDisabled}
            onClick={() => (onNextClick ? onNextClick() : onNext?.())}
            className="inline-flex min-h-[44px] h-11 touch-manipulation items-center rounded-[6px] bg-[var(--color-accent)] px-4 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {nextLabel}
          </button>
        )}
      </div>
    </div>
  );
}

function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Step ${step} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={
            "h-1.5 w-6 rounded-full " +
            (i < step ? "bg-[var(--color-accent)]" : "bg-[var(--color-line)]")
          }
        />
      ))}
    </div>
  );
}
