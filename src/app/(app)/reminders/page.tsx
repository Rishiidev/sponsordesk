import { getRemindersForUser } from "@/lib/reminders/detect";
import { getCurrentUser } from "@/lib/auth/local";

export const dynamic = "force-dynamic";

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString();
}

export default async function RemindersPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const reminders = await getRemindersForUser(user.id);

  const isEmpty = reminders.totalCount === 0;
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });

  return (
    <div className="max-w-[700px] space-y-6">
      <header>
        <p className="text-[12px] uppercase tracking-wide text-[var(--color-ink-3)]">Daily digest preview · {today}</p>
        <h1 className="mt-1 text-[26px] font-semibold tracking-tight text-[var(--color-ink)]">
          {isEmpty
            ? "All clear today"
            : `${reminders.totalCount} thing${reminders.totalCount === 1 ? "" : "s"} need your attention`}
        </h1>
        <p className="mt-1 text-[14px] text-[var(--color-ink-3)]">
          This is what would email you at 9:00 AM. The cron route is at{" "}
          <code className="rounded-[4px] bg-[var(--color-paper-2)] px-1 py-0.5 text-[12px]">/api/cron/daily-digest</code>.
        </p>
        <div className="mt-3">
          <a
            href="/api/cron/daily-digest"
            className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-[var(--color-line)] bg-white px-3 text-[13px] font-medium text-[var(--color-ink-2)] hover:bg-[var(--color-paper-2)]"
          >
            Trigger cron now
          </a>
        </div>
      </header>

      <section className="rounded-[12px] border border-[var(--color-line)] bg-white p-5">
        <header className="flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-[var(--color-ink)]">Overdue follow-ups</h2>
          <span className="text-[11px] font-medium text-[var(--color-accent)]">{reminders.overdueFollowUps.length}</span>
        </header>
        {reminders.overdueFollowUps.length === 0 ? (
          <p className="mt-3 text-[13px] text-[var(--color-ink-3)]">Nothing overdue. Quiet day, ship more.</p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--color-line)]">
            {reminders.overdueFollowUps.map((r) => (
              <li key={r.dealId} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-[14px] font-medium text-[var(--color-ink)]">{r.dealTitle}</p>
                  <p className="mt-0.5 text-[12px] text-[var(--color-accent)]">
                    {r.brandName} · follow-up {r.daysOverdue} day{r.daysOverdue === 1 ? "" : "s"} overdue
                  </p>
                  <p className="mt-0.5 text-[11px] text-[var(--color-ink-3)]">Due {formatDate(r.nextFollowupAt)}</p>
                </div>
                <a href={`/deals/${r.dealId}`} className="text-[12px] text-[var(--color-accent)] hover:underline">
                  Open deal →
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-[12px] border border-[var(--color-line)] bg-white p-5">
        <header className="flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-[var(--color-ink)]">Due soon (next 3 days)</h2>
          <span className="text-[11px] font-medium text-[var(--color-ink-3)]">{reminders.dueSoonDeliverables.length}</span>
        </header>
        {reminders.dueSoonDeliverables.length === 0 ? (
          <p className="mt-3 text-[13px] text-[var(--color-ink-3)]">No deliverables landing in the next 3 days.</p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--color-line)]">
            {reminders.dueSoonDeliverables.map((r) => (
              <li key={r.deliverableId} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-[14px] font-medium text-[var(--color-ink)]">{r.title}</p>
                  <p className="mt-0.5 text-[12px] text-[var(--color-ink-3)]">
                    {r.brandName} · {r.dealTitle}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[var(--color-ink-3)]">
                    Due {formatDate(r.dueDate)} ({r.daysUntilDue === 0 ? "today" : `in ${r.daysUntilDue}d`})
                  </p>
                </div>
                <a href={`/deals/${r.dealId}`} className="text-[12px] text-[var(--color-accent)] hover:underline">
                  Open deal →
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-[12px] border border-[var(--color-line)] bg-white p-5">
        <header className="flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-[var(--color-ink)]">Stale deals (14+ days silent)</h2>
          <span className="text-[11px] font-medium text-[var(--color-ink-3)]">{reminders.staleDeals.length}</span>
        </header>
        {reminders.staleDeals.length === 0 ? (
          <p className="mt-3 text-[13px] text-[var(--color-ink-3)]">No negotiating deal is cold. Stay on top of it.</p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--color-line)]">
            {reminders.staleDeals.map((r) => (
              <li key={r.dealId} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-[14px] font-medium text-[var(--color-ink)]">{r.dealTitle}</p>
                  <p className="mt-0.5 text-[12px] text-[var(--color-ink-3)]">
                    {r.brandName} · {r.stage}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[var(--color-ink-3)]">
                    {r.daysSinceLastContact} days since last contact
                    {r.lastContactAt && ` (last touch ${formatDate(r.lastContactAt)})`}
                  </p>
                </div>
                <a href={`/deals/${r.dealId}`} className="text-[12px] text-[var(--color-accent)] hover:underline">
                  Open deal →
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
