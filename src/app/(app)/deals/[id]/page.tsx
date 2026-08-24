import Link from "next/link";
import { getDealsForUser, getBrandsForUser } from "@/lib/actions/deals";
import { getRemindersForUser } from "@/lib/reminders/detect";
import { getContactsForBrand, getInteractionsForDeal, getDeliverablesForDeal } from "@/lib/db/local";
import { DealInteractions } from "@/components/deal-interactions";
import { DealActions } from "@/components/deal-actions";
import { DeliverableChecklist } from "@/components/deliverable-checklist";

export const dynamic = "force-dynamic";

function formatCurrency(cents: number | undefined, currency: string | undefined) {
  if (!cents) return "Not specified";
  const amount = cents / 100;
  return currency === "INR"
    ? `₹${amount.toLocaleString("en-IN")}`
    : `$${amount.toLocaleString("en-US")}`;
}

function formatDate(d: string | undefined) {
  if (!d) return "Not set";
  return new Date(d).toLocaleDateString();
}

export default async function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deals = await getDealsForUser();
  const brands = await getBrandsForUser();
  const reminders = await getRemindersForUser("demo-user-id");
  const deal = deals.find((d) => d.id === id);

  if (!deal) {
    return (
      <div className="max-w-[600px] space-y-6">
        <h1 className="text-[26px] font-semibold tracking-tight text-[var(--color-ink)]">Deal not found</h1>
        <p className="mt-1 text-[14px] text-[var(--color-ink-3)]">This deal doesn't exist or you don't have access to it.</p>
      </div>
    );
  }

  const brand = brands.find((b) => b.id === deal.brandId);
  const [dealInteractions, dealContacts, dealDeliverables] = await Promise.all([
    getInteractionsForDeal(id),
    getContactsForBrand(deal.brandId),
    getDeliverablesForDeal(id),
  ]);
  const isOverdue =
    deal.nextFollowupAt && new Date(deal.nextFollowupAt) < new Date() && deal.stage !== "paid" && deal.stage !== "lost";

  return (
    <div className="max-w-[600px] space-y-6">
      <header>
        <h1 className="text-[26px] font-semibold tracking-tight text-[var(--color-ink)]">{deal.title}</h1>
        <p className="mt-1 text-[14px] text-[var(--color-ink-3)]">
          {brand?.name} · {deal.stage}
        </p>
      </header>

      <section className="rounded-[12px] border border-[var(--color-line)] bg-white p-6">
        <h2 className="text-[14px] font-semibold text-[var(--color-ink)]">Details</h2>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-[13px] font-medium text-[var(--color-ink-3)]">Brand</p>
            <p className="mt-1 text-[14px] text-[var(--color-ink)]">{brand?.name || "Unknown"}</p>
          </div>
          <div>
            <p className="text-[13px] font-medium text-[var(--color-ink-3)]">Stage</p>
            <p className="mt-1 text-[14px] text-[var(--color-ink)]">
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium ${
                  deal.stage === "inbound"
                    ? "bg-[var(--color-paper-2)] text-[var(--color-ink-2)]"
                    : deal.stage === "negotiating"
                    ? "bg-yellow-50 text-yellow-700"
                    : deal.stage === "live"
                    ? "bg-green-50 text-green-700"
                    : deal.stage === "paid"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {deal.stage}
              </span>
            </p>
          </div>
          <div>
            <p className="text-[13px] font-medium text-[var(--color-ink-3)]">Amount</p>
            <p className="mt-1 text-[14px] text-[var(--color-ink)]">
              {formatCurrency(deal.amountCents, deal.currency)} {deal.amountCents ? deal.currency : ""}
            </p>
          </div>
          <div>
            <p className="text-[13px] font-medium text-[var(--color-ink-3)]">Start date</p>
            <p className="mt-1 text-[14px] text-[var(--color-ink)]">{formatDate(deal.startDate)}</p>
          </div>
          <div>
            <p className="text-[13px] font-medium text-[var(--color-ink-3)]">End date</p>
            <p className="mt-1 text-[14px] text-[var(--color-ink)]">{formatDate(deal.endDate)}</p>
          </div>
          <div>
            <p className="text-[13px] font-medium text-[var(--color-ink-3)]">Payment terms</p>
            <p className="mt-1 text-[14px] text-[var(--color-ink)]">{deal.paymentTermsDays || 30} days</p>
          </div>
          <div>
            <p className="text-[13px] font-medium text-[var(--color-ink-3)]">Payment status</p>
            <p className="mt-1 text-[14px] text-[var(--color-ink)]">{deal.paymentStatus || "pending"}</p>
          </div>
          <div>
            <p className="text-[13px] font-medium text-[var(--color-ink-3)]">Next follow-up</p>
            <p className="mt-1 text-[14px]">
              {deal.nextFollowupAt ? (
                <span className={isOverdue ? "text-[var(--color-accent)] font-medium" : "text-[var(--color-ink)]"}>
                  {new Date(deal.nextFollowupAt).toLocaleDateString()} {isOverdue && "(OVERDUE)"}
                </span>
              ) : (
                <span className="text-[var(--color-ink-3)]">Not set</span>
              )}
            </p>
          </div>
          {deal.notes && (
            <div>
              <p className="text-[13px] font-medium text-[var(--color-ink-3)]">Notes</p>
              <p className="mt-1 text-[14px] text-[var(--color-ink)]">{deal.notes}</p>
            </div>
          )}
        </div>
      </section>

      <DealActions deal={deal} />

      <section className="rounded-[12px] border border-[var(--color-line)] bg-white p-6">
        <DeliverableChecklist dealId={id} deliverables={dealDeliverables} />
      </section>

      {reminders.overdueFollowUps.length > 0 && (
        <section className="rounded-[12px] border border-[var(--color-line)] bg-[var(--color-accent-soft)] p-4">
          <h2 className="text-[14px] font-semibold text-[var(--color-ink)]">⚠️ Needs attention</h2>
          <p className="mt-2 text-[13px] text-[var(--color-ink)]">
            You have {reminders.overdueFollowUps.length} overdue follow-up(s). Consider updating the
            next follow-up date or moving the deal to a different stage.
          </p>
        </section>
      )}

      <section className="rounded-[12px] border border-[var(--color-line)] bg-white p-6">
        <DealInteractions
          dealId={id}
          brandId={deal.brandId}
          interactions={dealInteractions}
          contacts={dealContacts}
        />
      </section>
    </div>
  );
}
