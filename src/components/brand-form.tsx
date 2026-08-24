"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrandAction } from "@/lib/actions/brands";

export function BrandForm({ initialData, isEditing, onCancel }: { initialData?: any; isEditing?: boolean; onCancel?: () => void }) {
  const [name, setName] = useState(initialData?.name || "");
  const [website, setWebsite] = useState(initialData?.website || "");
  const [primaryContactName, setPrimaryContactName] = useState(initialData?.primaryContactName || "");
  const [primaryContactEmail, setPrimaryContactEmail] = useState(initialData?.primaryContactEmail || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set("name", name);
      if (website) formData.set("website", website);
      if (primaryContactName) formData.set("primaryContactName", primaryContactName);
      if (primaryContactEmail) formData.set("primaryContactEmail", primaryContactEmail);
      if (notes) formData.set("notes", notes);

      if (isEditing && initialData?.id) {
        const result = await fetch(`/brands/${initialData.id}`, {
          method: "POST",
          body: formData,
        });
        const data = await result.json();
        if (data.success) {
          router.refresh();
        } else {
          setError(data.error || "Failed to update brand");
        }
      } else {
        const result = await createBrandAction(formData);
        if (result.success && result.brand) {
          router.push(`/brands/${result.brand.id}`);
        } else {
          setError(result.error || "Failed to create brand");
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
        <label htmlFor="name" className="mb-2 block text-[13px] font-medium text-[var(--color-ink)]">
          Brand name <span className="text-[var(--color-accent)]">*</span>
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-[6px] border border-[var(--color-line)] bg-white px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />
      </div>
      <div>
        <label htmlFor="website" className="mb-2 block text-[13px] font-medium text-[var(--color-ink)]">
          Website
        </label>
        <input
          id="website"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="w-full rounded-[6px] border border-[var(--color-line)] bg-white px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          placeholder="https://example.com"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="primaryContactName" className="mb-2 block text-[13px] font-medium text-[var(--color-ink)]">
            Primary contact name
          </label>
          <input
            id="primaryContactName"
            type="text"
            value={primaryContactName}
            onChange={(e) => setPrimaryContactName(e.target.value)}
            className="w-full rounded-[6px] border border-[var(--color-line)] bg-white px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>
        <div>
          <label htmlFor="primaryContactEmail" className="mb-2 block text-[13px] font-medium text-[var(--color-ink)]">
            Primary contact email
          </label>
          <input
            id="primaryContactEmail"
            type="email"
            value={primaryContactEmail}
            onChange={(e) => setPrimaryContactEmail(e.target.value)}
            className="w-full rounded-[6px] border border-[var(--color-line)] bg-white px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>
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
          {loading ? "Saving..." : isEditing ? "Save changes" : "Create brand"}
        </button>
      </div>
    </form>
  );
}