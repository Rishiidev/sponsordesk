import { getCurrentUser } from "@/lib/auth/local";
import { getAllDeals } from "@/lib/db/local";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function formatCurrency(cents: number) {
  return `$${(cents / 100).toLocaleString("en-US")}`;
}

export default async function AdminHome() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const deals = await getAllDeals();
  const activeDeals = deals.filter((d) => d.stage !== "paid" && d.stage !== "lost");
  const paidDeals = deals.filter((d) => d.stage === "paid");
  const pipelineValue = activeDeals.reduce((sum, d) => sum + (d.amountCents ?? 0), 0);
  const realizedRevenue = paidDeals.reduce((sum, d) => sum + (d.amountCents ?? 0), 0);

  // Until we have multi-user auth, the user count is "the people in this
  // server's store". We pretend it's 1 demo + however many distinct
  // userIds show up in deals (always 1 today, but future-proof).
  const distinctUserIds = new Set(deals.map((d) => d.userId));
  const userCount = Math.max(1, distinctUserIds.size);

  const recentDeals = [...deals]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-[960px] space-y-8 py-8">
      <header>
        <p className="text-[12px] uppercase tracking-wide text-[var(--color-ink-3)]">
          Admin · SponsorDesk
        </p>
        <h1 className="text-[26px] font-semibold tracking-tight text-[var(--color-ink)]">
          SponsorDesk admin
        </h1>
        <p className="mt-1 text-[14px] text-[var(--color-ink-3)]">
          Founder-only view. Numbers are pulled from the local data store;
          they will swap to Supabase aggregations when real auth ships.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Total users" value={userCount.toString()} />
        <Stat label="Paying users" value="0" subtle="Pro checkout is offline" />
        <Stat label="MRR" value="$0" subtle="No paid conversions yet" />
        <Stat label="Pipeline value" value={formatCurrency(pipelineValue)} />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Active deals" value={activeDeals.length.toString()} />
        <Stat label="Paid deals" value={paidDeals.length.toString()} />
        <Stat label="Realized revenue" value={formatCurrency(realizedRevenue)} />
      </section>

      <section className="rounded-[12px] border border-[var(--color-line)] bg-white p-5">
        <h2 className="text-[14px] font-semibold text-[var(--color-ink)]">Recent activity</h2>
        <ul className="mt-4 space-y-3 text-[13px]">
          <li className="flex items-center justify-between gap-3">
            <span className="text-[var(--color-ink-2)]">
              Last login: {user.email}
            </span>
            <span className="text-[12px] text-[var(--color-ink-3)]">just now</span>
          </li>
          {recentDeals.map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-3">
              <span className="text-[var(--color-ink-2)]">
                Deal “{d.title}” — stage {d.stage}
              </span>
              <span className="text-[12px] text-[var(--color-ink-3)]">
                {new Date(d.updatedAt).toLocaleString()}
              </span>
            </li>
          ))}
          {recentDeals.length === 0 && (
            <li className="text-[12px] text-[var(--color-ink-3)]">
              No deals yet. Add one via /deals/new to see activity.
            </li>
          )}
        </ul>
      </section>

      <section className="rounded-[12px] border border-dashed border-[var(--color-line)] bg-[var(--color-paper-2)] p-5 text-[13px] text-[var(--color-ink-3)]">
        <p className="font-medium text-[var(--color-ink)]">Coming next</p>
        <p className="mt-1">
          Supabase-backed user counts, Razorpay-backed MRR, and an event
          timeline that tracks every brand + deal + interaction.
        </p>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  subtle,
}: {
  label: string;
  value: string;
  subtle?: string;
}) {
  return (
    <div className="rounded-[12px] border border-[var(--color-line)] bg-white p-4">
      <p className="text-[12px] uppercase tracking-wide text-[var(--color-ink-3)]">{label}</p>
      <p className="mt-2 text-[22px] font-semibold text-[var(--color-ink)]">{value}</p>
      {subtle && <p className="mt-1 text-[11px] text-[var(--color-ink-3)]">{subtle}</p>}
    </div>
  );
}
