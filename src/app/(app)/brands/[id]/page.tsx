import { getBrandsForUser } from "@/lib/actions/deals";
import { getDealsForUser } from "@/lib/actions/deals";
import { getContactsForBrand, getInteractionsForBrand } from "@/lib/db/local";
import { ContactList } from "@/components/contact-list";
import { InteractionTimeline } from "@/components/interaction-timeline";
import { BrandDetailActions } from "@/components/brand-detail-actions";

export const dynamic = "force-dynamic";

export default async function BrandDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brands = await getBrandsForUser();
  const deals = await getDealsForUser();
  const brand = brands.find((b) => b.id === id);

  if (!brand) {
    return (
      <div className="max-w-[600px] space-y-6">
        <h1 className="text-[26px] font-semibold tracking-tight text-[var(--color-ink)]">Brand not found</h1>
        <p className="mt-1 text-[14px] text-[var(--color-ink-3)]">This brand doesn't exist or you don't have access to it.</p>
      </div>
    );
  }

  const brandDeals = deals.filter((d) => d.brandId === id);
  const [contacts, interactions] = await Promise.all([
    getContactsForBrand(id),
    getInteractionsForBrand(id),
  ]);

  return (
    <div className="max-w-[600px] space-y-6">
      <header>
        <h1 className="text-[26px] font-semibold tracking-tight text-[var(--color-ink)]">{brand.name}</h1>
        {brand.website && (
          <a
            href={brand.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-[14px] text-[var(--color-accent)] hover:underline"
          >
            {brand.website}
          </a>
        )}
        <div className="mt-3">
          <BrandDetailActions brand={brand} deals={brandDeals} />
        </div>
      </header>

      <section className="rounded-[12px] border border-[var(--color-line)] bg-white p-6">
        <h2 className="text-[14px] font-semibold text-[var(--color-ink)]">Details</h2>
        <p className="mt-3 text-[14px] text-[var(--color-ink)]">
          <strong>Primary contact:</strong> {brand.primaryContactName || "Not set"}
          {brand.primaryContactEmail && ` (${brand.primaryContactEmail})`}
        </p>
        {brand.notes && (
          <p className="mt-3 text-[14px] text-[var(--color-ink)]">
            <strong>Notes:</strong> {brand.notes}
          </p>
        )}
      </section>

      <section className="rounded-[12px] border border-[var(--color-line)] bg-white p-6">
        <ContactList brandId={id} contacts={contacts} />
      </section>

      <section className="rounded-[12px] border border-[var(--color-line)] bg-white p-6">
        <InteractionTimeline brandId={id} interactions={interactions} deals={brandDeals} contacts={contacts} />
      </section>

      <section className="rounded-[12px] border border-[var(--color-line)] bg-white p-6">
        <header className="flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-[var(--color-ink)]">Deals ({brandDeals.length})</h2>
          <a
            href="/deals/new"
            className="text-[12px] text-[var(--color-accent)] hover:underline"
          >
            Add deal →
          </a>
        </header>
        {brandDeals.length === 0 ? (
          <p className="mt-4 text-[13px] text-[var(--color-ink-3)]">No deals for this brand yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--color-line)]">
            {brandDeals.map((deal) => (
              <li key={deal.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-medium text-[var(--color-ink)]">{deal.title}</p>
                  <p className="mt-0.5 text-[12px] text-[var(--color-ink-3)]">
                    {deal.stage} · {deal.amountCents ? `$${(deal.amountCents / 100).toLocaleString()}` : "No amount"}
                  </p>
                </div>
                <a
                  href={`/deals/${deal.id}`}
                  className="text-[12px] text-[var(--color-accent)] hover:underline"
                >
                  Open →
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
