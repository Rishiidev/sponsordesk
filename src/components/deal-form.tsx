"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createDealAction, getBrandsForUser } from "@/lib/actions/deals";

export function DealForm({ initialData, isEditing, onCancel }: { initialData?: any; isEditing?: boolean; onCancel?: () => void }) {
  const [brands, setBrands] = useState<any[]>([]);
  const [brandId, setBrandId] = useState(initialData?.brandId || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [stage, setStage] = useState(initialData?.stage || "inbound");
  const [amountCents, setAmountCents] = useState(initialData?.amountCents?.toString() || "");
  const [currency, setCurrency] = useState(initialData?.currency || "USD");
  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [endDate, setEndDate] = useState(initialData?.endDate || "");
  const [paymentTermsDays, setPaymentTermsDays] = useState(initialData?.paymentTermsDays?.toString() || "30");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch brands on mount
  useEffect(() => {
    getBrandsForUser().then(setBrands);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set("brandId", brandId);
      formData.set("title", title);
      formData.set("stage", stage);
      if (amountCents) formData.set("amountCents", amountCents);
      formData.set("currency", currency);
      if (startDate) formData.set("startDate", startDate);
      if (endDate) formData.set("endDate", endDate);
      formData.set("paymentTermsDays", paymentTermsDays);
      if (notes) formData.set("notes", notes);

      if (isEditing && initialData?.id) {
        const result = await fetch(`/deals/${initialData.id}`, {
          method: "POST",
          body: formData,
        });
        const data = await result.json();
        if (data.success) {
          router.refresh();
        } else {
          setError(data.error || "Failed to update deal");
        }
      } else {
        const result = await createDealAction(formData);
        if (result.success && result.deal) {
          router.push(`/deals/${result.deal.id}`);
        } else {
          setError(result.error || "Failed to create deal");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="brandId" className="mb-2 block text-[13px] font-medium text-[var(--color-ink)]">
          Brand <span className="text-[var(--color-accent)]">*</span>
        </label>
        <select
          id="brandId"
          required
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
          className="w-full rounded-[6px] border border-[var(--color-line)] bg-white px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        >
          <option value="">Select a brand</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="title" className="mb-2 block text-[13px] font-medium text-[var(--color-ink)]">
          Deal title <span className="text-[var(--color-accent)]">*</span>
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-[6px] border border-[var(--color-line)] bg-white px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          placeholder="e.g., Q1 YouTube integration"
        />
      </div>
      <div>
        <label htmlFor="stage" className="mb-2 block text-[13px] font-medium text-[var(--color-ink)]">
          Stage <span className="text-[var(--color-accent)]">*</span>
        </label>
        <select
          id="stage"
          required
          value={stage}
          onChange={(e) => setStage(e.target.value as any)}
          className="w-full rounded-[6px] border border-[var(--color-line)] bg-white px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        >
          <option value="inbound">Inbound</option>
          <option value="negotiating">Negotiating</option>
          <option value="live">Live</option>
          <option value="paid">Paid</option>
          <option value="lost">Lost</option>
        </select>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="amountCents" className="mb-2 block text-[13px] font-medium text-[var(--color-ink)]">
            Amount (in cents)
          </label>
          <input
            id="amountCents"
            type="number"
            value={amountCents}
            onChange={(e) => setAmountCents(e.target.value)}
            className="w-full rounded-[6px] border border-[var(--color-line)] bg-white px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            placeholder="450000 for $4,500"
          />
        </div>
        <div>
          <label htmlFor="currency" className="mb-2 block text-[13px] font-medium text-[var(--color-ink)]">
            Currency
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-[6px] border border-[var(--color-line)] bg-white px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          >
            <option value="USD">USD ($)</option>
            <option value="INR">INR (₹)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="startDate" className="mb-2 block text-[13px] font-medium text-[var(--color-ink)]">
            Start date
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-[6px] border border-[var(--color-line)] bg-white px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="mb-2 block text-[13px] font-medium text-[var(--color-ink)]">
            End date
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-[6px] border border-[var(--color-line)] bg-white px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>
      </div>
      <div>
        <label htmlFor="paymentTermsDays" className="mb-2 block text-[13px] font-medium text-[var(--color-ink)]">
          Payment terms (days)
        </label>
        <input
          id="paymentTermsDays"
          type="number"
          value={paymentTermsDays}
          onChange={(e) => setPaymentTermsDays(e.target.value)}
          className="w-full rounded-[6px] border border-[var(--color-line)] bg-white px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />
      </div>
      <div>
        <label htmlFor="notes" className="mb-2 block text-[13px] font-medium text-[var(--color-ink)]">
          Notes
        </label>
        <textarea
          id="notes"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-[6px] border border-[var(--color-line)] bg-white px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />
      </div>
      {error && (
        <p className="text-[13px] text-[var(--color-ink-2)] bg-[var(--color-accent-soft)] rounded-[6px] px-3 py-2">
          {error}
        </p>
      )}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex h-9 items-center gap-2 rounded-[6px] bg-[var(--color-accent)] px-4 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Saving..." : isEditing ? "Save changes" : "Create deal"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-[var(--color-line)] bg-white px-3 text-[13px] font-medium text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}