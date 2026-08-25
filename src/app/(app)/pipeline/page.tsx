import Link from "next/link";
import { getDealsForUser, getBrandsForUser } from "@/lib/actions/deals";
import KanbanBoard from "@/components/kanban-board";
import { moveDealStageAction } from "@/lib/actions/deals";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const [deals, brands] = await Promise.all([
    getDealsForUser(),
    getBrandsForUser(),
  ]);
  const brandMap = new Map(brands.map((b) => [b.id, b.name]));

  // Reshape to what KanbanBoard expects (denormalize brand name)
  const boardDeals = deals.map((d) => ({
    id: d.id,
    title: d.title,
    brandId: d.brandId,
    brandName: brandMap.get(d.brandId) ?? "Unknown brand",
    amountCents: d.amountCents ?? undefined,
    currency: d.currency ?? "USD",
    stage: d.stage as
      | "inbound"
      | "negotiating"
      | "live"
      | "paid"
      | "lost",
    nextFollowupAt: d.nextFollowupAt ?? undefined,
  }));

  async function handleMove(
    dealId: string,
    newStage: "inbound" | "negotiating" | "live" | "paid" | "lost"
  ) {
    "use server";
    await moveDealStageAction(dealId, newStage);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight text-[var(--color-ink)]">
            Deal pipeline
          </h1>
          <p className="mt-1 text-[14px] text-[var(--color-ink-3)]">
            Drag deals between stages. The stage change saves instantly.
          </p>
        </div>
        <Link
          href="/deals/new"
          className="inline-flex min-h-[44px] h-11 touch-manipulation items-center justify-center gap-2 rounded-[var(--radius-tight)] bg-[var(--color-ink)] px-4 text-[13px] font-medium text-white hover:bg-[var(--color-accent)] transition-colors"
        >
          New deal
          <span aria-hidden>+</span>
        </Link>
      </div>

      {deals.length === 0 ? (
        <div className="rounded-[var(--radius-soft)] border border-dashed border-[var(--color-line)] bg-white p-12 text-center">
          <h3 className="text-[16px] font-medium text-[var(--color-ink)]">
            No deals yet
          </h3>
          <p className="mx-auto mt-2 max-w-[40ch] text-[14px] text-[var(--color-ink-2)]">
            Add a brand first, then create your first deal. You will see it
            here as a draggable card.
          </p>
          <Link
            href="/deals/new"
            className="mt-5 inline-flex min-h-[44px] h-11 touch-manipulation items-center rounded-[var(--radius-tight)] bg-[var(--color-ink)] px-4 text-[13px] font-medium text-white hover:bg-[var(--color-accent)] transition-colors"
          >
            Add your first deal
          </Link>
        </div>
      ) : (
        <KanbanBoard deals={boardDeals} onMoveDeal={handleMove} />
      )}
    </div>
  );
}