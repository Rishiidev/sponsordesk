import { getDealsForUser, getBrandsForUser } from "@/lib/actions/deals";
import { DealForm } from "@/components/deal-form";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DealsPage() {
  const deals = await getDealsForUser();
  const brands = await getBrandsForUser();

  // Sort by updatedAt descending
  deals.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight text-[var(--color-ink)]">Deals</h1>
          <p className="mt-1 text-[14px] text-[var(--color-ink-3)]">
            All your sponsorship agreements
          </p>
        </div>
        <Link
          href="/deals/new"
          className="inline-flex h-9 items-center gap-2 rounded-[6px] bg-[var(--color-accent)] px-3 text-[13px] font-medium text-white hover:opacity-90"
        >
          Add deal
        </Link>
      </header>

      {deals.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-[var(--color-line)] bg-[var(--color-paper-2)] p-8 text-center">
          <h2 className="text-[18px] font-semibold text-[var(--color-ink)]">No deals yet</h2>
          <p className="mx-auto mt-2 max-w-md text-[13px] text-[var(--color-ink-3)]">
            Add your first deal to start tracking. You'll need to create a brand first if you haven't
            already.
          </p>
          <Link
            href="/deals/new"
            className="mt-5 inline-flex h-9 items-center rounded-[6px] bg-[var(--color-ink)] px-4 text-[13px] font-medium text-white hover:opacity-90"
          >
            Create your first deal
          </Link>
        </div>
      ) : (
        <div className="rounded-[12px] border border-[var(--color-line)] bg-white overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--color-paper-2)]">
                <th className="text-left p-4 text-[12px] uppercase tracking-wide text-[var(--color-ink-3)]">Deal</th>
                <th className="text-left p-4 text-[12px] uppercase tracking-wide text-[var(--color-ink-3)]">Brand</th>
                <th className="text-left p-4 text-[12px] uppercase tracking-wide text-[var(--color-ink-3)]">Stage</th>
                <th className="text-left p-4 text-[12px] uppercase tracking-wide text-[var(--color-ink-3)]">Amount</th>
                <th className="text-left p-4 text-[12px] uppercase tracking-wide text-[var(--color-ink-3)]">Follow-up</th>
                <th className="text-right p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-line)]">
              {deals.map((deal) => {
                const brand = brands.find((b) => b.id === deal.brandId);
                const isOverdue = deal.nextFollowupAt && new Date(deal.nextFollowupAt) < new Date();
                return (
                  <tr key={deal.id} className="hover:bg-[var(--color-paper-2)]">
                    <td className="p-4">
                      <Link
                        href={`/deals/${deal.id}`}
                        className="font-medium text-[var(--color-ink)] hover:text-[var(--color-accent)]"
                      >
                        {deal.title}
                      </Link>
                    </td>
                    <td className="p-4 text-[14px] text-[var(--color-ink)]">{brand?.name || "Unknown"}</td>
                    <td className="p-4">
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
                    </td>
                    <td className="p-4 text-[14px] text-[var(--color-ink)]">
                      {deal.amountCents
                        ? `$${(deal.amountCents / 100).toLocaleString()} ${deal.currency}`
                        : "—"}
                    </td>
                    <td className="p-4">
                      {deal.nextFollowupAt ? (
                        <span className={isOverdue ? "text-[var(--color-accent)] font-medium" : "text-[var(--color-ink)]"}>
                          {new Date(deal.nextFollowupAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-[var(--color-ink-3)]">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/deals/${deal.id}`}
                        className="text-[12px] text-[var(--color-accent)] hover:underline"
                      >
                        Open →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}