"use client";

import { useState } from "react";
import { updateDealAction, deleteDealAction, moveDealStageAction } from "@/lib/actions/deals";
import type { Deal } from "@/lib/db/local";

export function DealActions({ deal }: { deal: Deal }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleMove(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newStage = formData.get("stage") as Deal["stage"];
    await moveDealStageAction(deal.id, newStage);
    window.location.reload();
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await updateDealAction(deal.id, formData);
    setSaving(false);
    if (res && "error" in res && res.error) {
      setError(String(res.error));
    } else {
      setEditing(false);
      window.location.reload();
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this deal? This cannot be undone.")) return;
    await deleteDealAction(deal.id);
    window.location.href = "/deals";
  }

  return (
    <section className="rounded-[12px] border border-[var(--color-line)] bg-white p-6">
      <h2 className="text-[14px] font-semibold text-[var(--color-ink)]">Actions</h2>

      {!editing && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setEditing(true)}
              className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-[var(--color-line)] bg-white px-3 text-[13px] font-medium text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-[var(--color-line)] bg-white px-3 text-[13px] font-medium text-[var(--color-ink-2)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent)]"
            >
              Delete
            </button>
          </div>
          <form onSubmit={handleMove} className="flex flex-wrap items-center gap-2">
            <select
              name="stage"
              defaultValue={deal.stage}
              className="rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2 text-[13px]"
            >
              <option value="inbound">Inbound</option>
              <option value="negotiating">Negotiating</option>
              <option value="live">Live</option>
              <option value="paid">Paid</option>
              <option value="lost">Lost</option>
            </select>
            <button
              type="submit"
              className="inline-flex h-9 items-center gap-2 rounded-[6px] bg-[var(--color-accent)] px-3 text-[13px] font-medium text-white hover:opacity-90"
            >
              Move to stage
            </button>
          </form>
        </div>
      )}

      {editing && (
        <form onSubmit={handleUpdate} className="mt-4 space-y-3">
          <div>
            <label className="block text-[12px] font-medium text-[var(--color-ink-2)]">Title</label>
            <input
              name="title"
              required
              defaultValue={deal.title}
              className="mt-1 block w-full rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2 text-[13px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-[var(--color-ink-2)]">Amount (cents)</label>
              <input
                name="amountCents"
                type="number"
                defaultValue={deal.amountCents?.toString() || ""}
                className="mt-1 block w-full rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2 text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[var(--color-ink-2)]">Currency</label>
              <input
                name="currency"
                defaultValue={deal.currency || "USD"}
                className="mt-1 block w-full rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2 text-[13px]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-[var(--color-ink-2)]">Start date</label>
              <input
                name="startDate"
                type="date"
                defaultValue={deal.startDate || ""}
                className="mt-1 block w-full rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2 text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[var(--color-ink-2)]">End date</label>
              <input
                name="endDate"
                type="date"
                defaultValue={deal.endDate || ""}
                className="mt-1 block w-full rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2 text-[13px]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-[var(--color-ink-2)]">Payment terms (days)</label>
              <input
                name="paymentTermsDays"
                type="number"
                defaultValue={deal.paymentTermsDays?.toString() || "30"}
                className="mt-1 block w-full rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2 text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[var(--color-ink-2)]">Payment status</label>
              <input
                name="paymentStatus"
                defaultValue={deal.paymentStatus || "pending"}
                className="mt-1 block w-full rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2 text-[13px]"
              />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[var(--color-ink-2)]">Next follow-up</label>
            <input
              name="nextFollowupAt"
              type="date"
              defaultValue={deal.nextFollowupAt ? deal.nextFollowupAt.slice(0, 10) : ""}
              className="mt-1 block w-full rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2 text-[13px]"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[var(--color-ink-2)]">Notes</label>
            <textarea
              name="notes"
              rows={3}
              defaultValue={deal.notes || ""}
              className="mt-1 block w-full rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2 text-[13px]"
            />
          </div>
          {error && (
            <p className="text-[12px] text-[var(--color-accent)]">{error}</p>
          )}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-9 items-center gap-2 rounded-[6px] bg-[var(--color-accent)] px-3 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-[var(--color-line)] bg-white px-3 text-[13px] font-medium text-[var(--color-ink-2)] hover:bg-[var(--color-paper-2)]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
