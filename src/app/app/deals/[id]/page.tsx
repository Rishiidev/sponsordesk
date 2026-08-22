"use client";

import { useState } from "react";
import { updateDealAction, deleteDealAction, moveDealStageAction } from "@/lib/actions/deals";
import { getDealsForUser, getBrandsForUser } from "@/lib/actions/deals";
import { getRemindersForUser } from "@/lib/reminders/detect";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deals = await getDealsForUser();
  const brands = await getBrandsForUser();
  const reminders = await getRemindersForUser("demo-user-id"); // demo user ID
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
        <div className="space-y-4">
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
              {deal.amountCents
                ? `$${(deal.amountCents / 100).toLocaleString()} ${deal.currency}`
                : "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-[13px] font-medium text-[var(--color-ink-3)]">Currency</p>
            <p className="mt-1 text-[14px] text-[var(--color-ink)]">
              {deal.currency || "USD"}
            </p>
          </div>
          <div>
            <p className="text-[13px] font-medium text-[var(--color-ink-3)]">Start date</p>
            <p className="mt-1 text-[14px] text-[var(--color-ink)]">
              {deal.startDate ? new Date(deal.startDate).toLocaleDateString() : "Not set"}
            </p>
          </div>
          <div>
            <p className="text-[13px] font-medium text-[var(--color-ink-3)]">End date</p>
            <p className="mt-1 text-[14px] text-[var(--color-ink)]">
              {deal.endDate ? new Date(deal.endDate).toLocaleDateString() : "Not set"}
            </p>
          </div>
          <div>
            <p className="text-[13px] font-medium text-[var(--color-ink-3)]">Payment terms</p>
            <p className="mt-1 text-[14px] text-[var(--color-ink)]">
              {deal.paymentTermsDays || 30} days
            </p>
          </div>
          <div>
            <p className="text-[13px] font-medium text-[var(--color-ink-3)]">Payment status</p>
            <p className="mt-1 text-[14px] text-[var(--color-ink)]">
              {deal.paymentStatus || "pending"}
            </p>
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

      <section className="rounded-[12px] border border-[var(--color-line)] bg-white p-6">
        <h2 className="text-[14px] font-semibold text-[var(--color-ink)]">Actions</h2>
        <div className="space-y-3">
          <div className="flex gap-3">
            {/* Edit form */}
            <form action={async (formData) => {
              await updateDealAction(id, formData);
              // Refresh the page after update
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
            }}>
              <input type="hidden" name="title" value={deal.title} />
              <input type="hidden" name="brandId" value={deal.brandId} />
              <input type="hidden" name="stage" value={deal.stage} />
              <input type="hidden" name="amountCents" value={deal.amountCents?.toString() || ""} />
              <input type="hidden" name="currency" value={deal.currency || "USD"} />
              <input type="hidden" name="startDate" value={deal.startDate || ""} />
              <input type="hidden" name="endDate" value={deal.endDate || ""} />
              <input type="hidden" name="paymentTermsDays" value={deal.paymentTermsDays?.toString() || "30"} />
              <input type="hidden" name="paymentStatus" value={deal.paymentStatus || "pending"} />
              <input type="hidden" name="notes" value={deal.notes || ""} />
              <button
                type="submit"
                className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-[var(--color-line)] bg-white px-3 text-[13px] font-medium text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]"
              >
                Edit
              </button>
            </form>
            
            {/* Delete form */}
            <form action={async () => {
              await deleteDealAction(id);
              if (typeof window !== 'undefined') {
                window.location.href = '/app/deals';
              }
            }}>
              <button
                type="submit"
                className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-[var(--color-line)] bg-white px-3 text-[13px] font-medium text-[var(--color-ink-2)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent)]"
              >
                Delete
              </button>
            </form>
          </div>
          
          <div className="flex gap-3">
            {/* Move stage form */}
            <form action={async (formData) => {
              await moveDealStageAction(id, formData.get("stage") as any);
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
            }}>
              <input type="hidden" name="id" value={deal.id} />
              <select name="stage" className="rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2 text-[13px]">
                <option value="inbound" selected={deal.stage === "inbound"}>
                  Inbound
                </option>
                <option value="negotiating" selected={deal.stage === "negotiating"}>
                  Negotiating
                </option>
                <option value="live" selected={deal.stage === "live"}>
                  Live
                </option>
                <option value="paid" selected={deal.stage === "paid"}>
                  Paid
                </option>
                <option value="lost" selected={deal.stage === "lost"}>
                  Lost
                </option>
              </select>
              <button type="submit" className="flex h-9 items-center gap-2 rounded-[6px] bg-[var(--color-accent)] px-3 text-[13px] font-medium text-white hover:opacity-90">
                Move to stage
              </button>
            </form>
          </div>
        </div>
      </section>

      {reminders.overdueFollowUps.length > 0 && (
        <section className="rounded-[12px] border border-[var(--color-line)] bg-[var(--color-accent-soft)] p-4 mb-6">
          <h2 className="text-[14px] font-semibold text-[var(--color-ink)]">⚠️ Needs attention</h2>
          <p className="mt-2 text-[13px] text-[var(--color-ink)]">
            You have {reminders.overdueFollowUps.length} overdue follow-up(s). Consider updating the
            next follow-up date or moving the deal to a different stage.
          </p>
        </section>
      )}
    </div>
  );
}