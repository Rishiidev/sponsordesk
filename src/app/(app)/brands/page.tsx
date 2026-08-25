import { getBrandsForUser } from "@/lib/actions/deals";
import { createBrandAction } from "@/lib/actions/brands";
import { BrandForm } from "@/components/brand-form";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const brands = await getBrandsForUser();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight text-[var(--color-ink)]">Brands</h1>
          <p className="mt-1 text-[14px] text-[var(--color-ink-3)]">
            Companies you work with or are talking to
          </p>
        </div>
        <Link
          href="/brands/new"
          className="inline-flex min-h-[44px] h-11 touch-manipulation items-center gap-2 rounded-[6px] bg-[var(--color-accent)] px-4 text-[14px] font-medium text-white hover:opacity-90"
        >
          Add brand
          <span aria-hidden>+</span>
        </Link>
      </header>

      {brands.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-[var(--color-line)] bg-[var(--color-paper-2)] p-8 sm:p-12 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-paper)] border border-[var(--color-line)] sm:h-24 sm:w-24">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-ink-3)]">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 9h6M9 13h6M9 17h4" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="text-[20px] font-semibold text-[var(--color-ink)]">No brands yet</h2>
          <p className="mx-auto mt-2 max-w-md text-[14px] text-[var(--color-ink-3)]">
            Add your first brand to start tracking deals. You'll attach deals to brands so you can see the full history in one place.
          </p>
          <Link
            href="/brands/new"
            className="mt-6 inline-flex min-h-[44px] h-12 touch-manipulation items-center justify-center gap-2 rounded-[6px] bg-[var(--color-ink)] px-5 text-[14px] font-medium text-white hover:bg-[var(--color-accent)] transition-colors"
          >
            Add your first brand
            <span aria-hidden>→</span>
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-[var(--color-line)]">
          {brands.map((brand) => (
            <li key={brand.id} className="py-4">
              <Link
                href={`/brands/${brand.id}`}
                className="flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-[15px] font-medium text-[var(--color-ink)]">{brand.name}</p>
                  {brand.website && (
                    <p className="mt-0.5 text-[12px] text-[var(--color-ink-3)]">{brand.website}</p>
                  )}
                </div>
                <span aria-hidden="true" className="text-[12px] text-[var(--color-ink-3)]">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}