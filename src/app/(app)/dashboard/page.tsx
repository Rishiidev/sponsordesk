import { getCurrentUser } from "@/lib/auth/local";
import { getDeals, getBrands } from "@/lib/db/local";
import { getRemindersForUser } from "@/lib/reminders/detect";

export const dynamic = "force-dynamic";

function formatCurrency(cents: number, currency: string) {
  const amount = cents / 100;
  return currency === "INR"
    ? `₹${amount.toLocaleString("en-IN")}`
    : `$${amount.toLocaleString("en-US")}`;
}

export default async function AppHome() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [deals, brands, reminders] = await Promise.all([
    getDeals(user.id),
    getBrands(user.id),
    getRemindersForUser(user.id),
  ]);

  const activeDeals = deals.filter((d) => d.stage !== "paid" && d.stage !== "lost");
  const paidThisMonth = deals.filter((d) => {
    if (d.stage !== "paid") return false;
    return true;
  });
  const pipelineValue = activeDeals.reduce((sum, d) => sum + (d.amountCents ?? 0), 0);
  const overdueCount = reminders.overdueFollowUps.length + reminders.dueSoonDeliverables.length;

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight text-[var(--color-ink)]">
            Welcome back{user.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}.
          </h1>
          <p className="mt-1 text-[14px] text-[var(--color-ink-3)]">
            Here's where your deals stand today.
          </p>
        </div>
        <a
          href="/pipeline"
          className="inline-flex h-9 items-center gap-2 rounded-[6px] bg-[var(--color-accent)] px-3 text-[13px] font-medium text-white hover:opacity-90"
        >
          Open pipeline
          <span aria-hidden>→</span>
        </a>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active deals" value={activeDeals.length.toString()} />
        <StatCard label="Brands" value={brands.length.toString()} />
        <StatCard label="Pipeline value" value={formatCurrency(pipelineValue, "USD")} />
        <StatCard
          label="Needs attention"
          value={overdueCount.toString()}
          tone={overdueCount > 0 ? "warn" : "neutral"}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-[12px] border border-[var(--color-line)] bg-white p-5">
            <h2 className="text-[14px] font-semibold text-[var(--color-ink)]">
              Needs your attention
            </h2>
            {reminders.overdueFollowUps.length === 0 && reminders.dueSoonDeliverables.length === 0 ? (
              <p className="mt-3 text-[13px] text-[var(--color-ink-3)]">
                Nothing is overdue. Quiet day, ship more.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {reminders.overdueFollowUps.map((r) => (
                  <li key={`follow-${r.dealId}`} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[14px] text-[var(--color-ink)]">{r.dealTitle}</p>
                      <p className="text-[12px] text-[var(--color-ink-3)]">
                        Follow-up {r.daysOverdue} day{r.daysOverdue === 1 ? "" : "s"} overdue
                      </p>
                    </div>
                    <a
                      href={`/deals/${r.dealId}`}
                      className="text-[12px] text-[var(--color-accent)] hover:underline"
                    >
                      Open deal →
                    </a>
                  </li>
                ))}
                {reminders.dueSoonDeliverables.map((r) => (
                  <li key={`delp-${r.deliverableId}`} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[14px] text-[var(--color-ink)]">{r.title}</p>
                      <p className="text-[12px] text-[var(--color-ink-3)]">
                        Deliverable due in {r.daysUntilDue} day{r.daysUntilDue === 1 ? "" : "s"}
                      </p>
                    </div>
                    <a
                      href={`/deals/${r.dealId}`}
                      className="text-[12px] text-[var(--color-accent)] hover:underline"
                    >
                      Open deal →
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <div className="rounded-[12px] border border-[var(--color-line)] bg-white p-5">
            <h2 className="text-[14px] font-semibold text-[var(--color-ink)]">Quick actions</h2>
            <ul className="mt-4 space-y-2 text-[13px]">
              <li>
                <a className="text-[var(--color-accent)] hover:underline" href="/brands/new">
                  Add a new brand →
                </a>
              </li>
              <li>
                <a className="text-[var(--color-accent)] hover:underline" href="/deals/new">
                  Add a new deal →
                </a>
              </li>
              <li>
                <a className="text-[var(--color-accent)] hover:underline" href="/reminders">
                  Preview today's digest →
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {activeDeals.length === 0 && brands.length === 0 && (
        <section className="rounded-[12px] border border-dashed border-[var(--color-line)] bg-[var(--color-paper-2)] p-8 text-center">
          <h2 className="text-[18px] font-semibold text-[var(--color-ink)]">Add your first brand</h2>
          <p className="mx-auto mt-2 max-w-md text-[13px] text-[var(--color-ink-3)]">
            SponsorDesk runs on brands and deals. Start with one brand you've worked with or are
            talking to, then add the deal attached to it.
          </p>
          <a
            href="/brands/new"
            className="mt-5 inline-flex h-9 items-center rounded-[6px] bg-[var(--color-ink)] px-4 text-[13px] font-medium text-white hover:opacity-90"
          >
            Create your first brand
          </a>
        </section>
      )}

      {paidThisMonth.length > 0 && (
        <section>
          <h2 className="mb-3 text-[14px] font-semibold text-[var(--color-ink)]">
            Paid deals ({paidThisMonth.length})
          </h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {paidThisMonth.map((d) => (
              <li
                key={d.id}
                className="rounded-[12px] border border-[var(--color-line)] bg-white p-4"
              >
                <p className="text-[14px] font-medium text-[var(--color-ink)]">{d.title}</p>
                <p className="mt-1 text-[12px] text-[var(--color-ink-3)]">
                  {formatCurrency(d.amountCents ?? 0, d.currency ?? "USD")}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "warn";
}) {
  return (
    <div className="rounded-[12px] border border-[var(--color-line)] bg-white p-4">
      <p className="text-[12px] uppercase tracking-wide text-[var(--color-ink-3)]">{label}</p>
      <p
        className={
          tone === "warn"
            ? "mt-2 text-[24px] font-semibold text-[var(--color-accent)]"
            : "mt-2 text-[24px] font-semibold text-[var(--color-ink)]"
        }
      >
        {value}
      </p>
    </div>
  );
}