import { getBrandsForUser } from "@/lib/actions/deals";
import { BrandForm } from "@/components/brand-form";

export default function NewBrandPage() {
  return (
    <div className="max-w-[600px] space-y-6">
      <header>
        <h1 className="text-[26px] font-semibold tracking-tight text-[var(--color-ink)]">Add a new brand</h1>
        <p className="mt-1 text-[14px] text-[var(--color-ink-3)]">
          Brands are the companies you work with. Add them first, then attach deals.
        </p>
      </header>
      <div className="rounded-[12px] border border-[var(--color-line)] bg-white p-6">
        <BrandForm />
      </div>
    </div>
  );
}
