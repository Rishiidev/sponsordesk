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
          href="/app/brands/new"
          className="inline-flex h-9 items-center gap-2 rounded-[6px] bg-[var(--color-accent)] px-3 text-[13px] font-medium text-white hover:opacity-90"
        >
          Add brand
        </Link>
      </header>

      {brands.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-[var(--color-line)] bg-[var(--color-paper-2)] p-8 text-center">
          <h2 className="text-[18px] font-semibold text-[var(--color-ink)]">No brands yet</h2>
          <p className="mx-auto mt-2 max-w-md text-[13px] text-[var(--color-ink-3)]">
            Add your first brand to start tracking deals. You'll attach deals to brands so you can see
            the full history in one place.
          </p>
          <Link
            href="/app/brands/new"
            className="mt-5 inline-flex h-9 items-center rounded-[6px] bg-[var(--color-ink)] px-4 text-[13px] font-medium text-white hover:opacity-90"
          >
            Create your first brand
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-[var(--color-line)]">
          {brands.map((brand) => (
            <li key={brand.id} className="py-4">
              <Link
                href={`/app/brands/${brand.id}`}
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