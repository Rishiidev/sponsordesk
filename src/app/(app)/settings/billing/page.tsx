import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth/local";
import {
  checkDealLimit,
  PRICING,
  resolveRegionFromHeaders,
  type Region,
  FREE_TIER_DEAL_LIMIT,
} from "@/lib/billing/tier";
import { RegionToggle } from "@/components/billing-region-toggle";

export const dynamic = "force-dynamic";

const PRO_FEATURES = [
  "Unlimited active deals",
  "Auto-scheduled follow-up reminders",
  "Deliverable checklists with due dates",
  "Export your data as CSV anytime",
  "Daily digest email",
  "Priority support from the founder",
];

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const user = await getCurrentUser();
  const reqHeaders = await headers();
  const sp = await searchParams;

  const detected = resolveRegionFromHeaders(reqHeaders);
  // Manual override via ?region=IN|ROW. Anything else falls back to detected.
  const region: Region = sp?.region === "IN" || sp?.region === "ROW" ? sp.region : detected;

  const limit = user ? await checkDealLimit(user.id) : null;
  const price = PRICING[region];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight text-[var(--color-ink)]">
            Billing & plans
          </h1>
          <p className="mt-1 text-[14px] text-[var(--color-ink-3)]">
            Right now you are on the free tier. Upgrade to Pro for unlimited deals and more.
          </p>
        </div>
        <RegionToggle current={region} />
      </header>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-[12px] border border-[var(--color-line)] bg-white p-5">
          <p className="text-[12px] uppercase tracking-wide text-[var(--color-ink-3)]">
            Current plan
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="inline-flex h-7 items-center rounded-full border border-[var(--color-line)] bg-[var(--color-paper-2)] px-3 text-[13px] font-medium text-[var(--color-ink)]">
              Free
            </span>
          </div>
          <div className="mt-5">
            <p className="text-[12px] text-[var(--color-ink-3)]">Active deals</p>
            <p className="mt-1 text-[20px] font-semibold text-[var(--color-ink)]">
              {limit ? `${limit.currentCount} / ${FREE_TIER_DEAL_LIMIT}` : "—"}
            </p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--color-paper-2)]">
              <div
                className="h-full rounded-full bg-[var(--color-accent)]"
                style={{
                  width: `${limit
                    ? Math.min(100, (limit.currentCount / FREE_TIER_DEAL_LIMIT) * 100)
                    : 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-[12px] border border-[var(--color-line)] bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[18px] font-semibold text-[var(--color-ink)]">SponsorDesk Pro</h2>
                {region === "IN" && (
                  <span className="inline-flex h-5 items-center rounded-full bg-[var(--color-accent-soft)] px-2 text-[11px] font-medium text-[var(--color-accent)]">
                    Recommended for India
                  </span>
                )}
              </div>
              <p className="mt-1 text-[13px] text-[var(--color-ink-3)]">{price.blurb}</p>
            </div>
            <div className="text-right">
              <p className="text-[28px] font-semibold text-[var(--color-ink)]">
                {price.amountLabel}
                <span className="ml-1 text-[14px] font-normal text-[var(--color-ink-3)]">
                  / month
                </span>
              </p>
              <p className="mt-1 text-[12px] text-[var(--color-ink-3)]">
                {region === "IN" ? "Billed in INR · GST included" : "Billed in USD"}
              </p>
            </div>
          </div>

          <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-[13px] text-[var(--color-ink-2)]">
                <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[12px] text-[var(--color-ink-3)]">
              Checkout is wired up in the next release.
            </p>
            <button
              type="button"
              disabled
              title="Razorpay integration pending"
              className="inline-flex min-h-[44px] h-11 touch-manipulation items-center gap-2 rounded-[6px] bg-[var(--color-ink)] px-4 text-[13px] font-medium text-white opacity-50 cursor-not-allowed"
            >
              Coming soon, Razorpay integration pending
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-[12px] border border-dashed border-[var(--color-line)] bg-[var(--color-paper-2)] p-5 text-[13px] text-[var(--color-ink-3)]">
        <p>
          Detected region: <span className="font-medium text-[var(--color-ink)]">{detected === "IN" ? "India" : "Rest of world"}</span>
          {detected === "IN"
            ? " (based on your network location or browser language)."
            : " (defaulted — toggle above to switch to India and see INR pricing)."}
        </p>
      </section>
    </div>
  );
}
