import { getDealsForUser, getBrandsForUser } from "@/lib/actions/deals";
import { DealForm } from "@/components/deal-form";

export default function NewDealPage() {
  return (
    <div className="max-w-[600px] space-y-6">
      <header>
        <h1 className="text-[26px] font-semibold tracking-tight text-[var(--color-ink)]">Add a new deal</h1>
        <p className="mt-1 text-[14px] text-[var(--color-ink-3)]">
          Attach a deal to a brand. Free tier: 3 active deals max.
        </p>
      </header>
      <div className="rounded-[12px] border border-[var(--color-line)] bg-white p-6">
        <DealForm />
      </div>
    </div>
  );
}