import { useState } from "react";
import { updateBrandAction, deleteBrandAction } from "@/lib/actions/brands";
import { BrandForm } from "@/components/brand-form";

export function BrandDetailActions({ brand, deals }: { brand: any; deals: any[] }) {
  const [isEditing, setIsEditing] = useState(false);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await updateBrandAction(brand.id, formData);
    window.location.reload();
  }

  async function handleDelete() {
    if (confirm("Delete this brand? This cannot be undone.")) {
      await deleteBrandAction(brand.id);
      window.location.href = "/app/brands";
    }
  }

  return (
    <>
      {!isEditing && (
        <div className="flex gap-3">
          <button
            onClick={() => setIsEditing(true)}
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
      )}
      {isEditing && (
        <BrandForm initialData={brand} isEditing onCancel={() => setIsEditing(false)} />
      )}
    </>
  );
}