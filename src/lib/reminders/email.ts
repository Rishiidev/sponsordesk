// HTML + plain-text rendering for the daily reminder digest.
import type { RemindersForUser, FollowUpReminder, DueSoonDeliverable, StaleDeal } from "@/lib/reminders/detect";

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function fmtDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString();
}

function section(title: string, inner: string, accent = false) {
  const border = accent ? "border-left: 4px solid #ea580c;" : "";
  return `
    <section style="margin: 24px 0; padding: 16px 20px; background: #ffffff; border: 1px solid #e7e5e4; border-radius: 12px; ${border}">
      <h2 style="margin: 0 0 12px; font-size: 14px; font-weight: 600; color: #18181b; letter-spacing: -0.01em;">${escapeHtml(title)}</h2>
      ${inner || `<p style="margin: 0; color: #71717a; font-size: 13px;">Nothing here. Quiet day.</p>`}
    </section>
  `;
}

function overdueRow(r: FollowUpReminder) {
  return `
    <li style="padding: 10px 0; border-bottom: 1px solid #e7e5e4;">
      <p style="margin: 0; font-size: 14px; color: #18181b; font-weight: 500;">${escapeHtml(r.dealTitle)}</p>
      <p style="margin: 4px 0 0; font-size: 12px; color: #ea580c;">${escapeHtml(r.brandName)} · follow-up ${r.daysOverdue} day${r.daysOverdue === 1 ? "" : "s"} overdue</p>
    </li>
  `;
}

function dueSoonRow(r: DueSoonDeliverable) {
  return `
    <li style="padding: 10px 0; border-bottom: 1px solid #e7e5e4;">
      <p style="margin: 0; font-size: 14px; color: #18181b; font-weight: 500;">${escapeHtml(r.title)}</p>
      <p style="margin: 4px 0 0; font-size: 12px; color: #71717a;">${escapeHtml(r.brandName)} · due ${r.daysUntilDue === 0 ? "today" : `in ${r.daysUntilDue} day${r.daysUntilDue === 1 ? "" : "s"}`} (${fmtDate(r.dueDate)})</p>
    </li>
  `;
}

function staleRow(r: StaleDeal) {
  return `
    <li style="padding: 10px 0; border-bottom: 1px solid #e7e5e4;">
      <p style="margin: 0; font-size: 14px; color: #18181b; font-weight: 500;">${escapeHtml(r.dealTitle)}</p>
      <p style="margin: 4px 0 0; font-size: 12px; color: #71717a;">${escapeHtml(r.brandName)} · ${r.daysSinceLastContact} day${r.daysSinceLastContact === 1 ? "" : "s"} since last contact</p>
    </li>
  `;
}

export function renderDigestHtml(reminders: RemindersForUser, opts?: { appUrl?: string }): string {
  const appUrl = opts?.appUrl ?? "https://sponsordesk.io";
  const date = new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });

  const overdueHtml = reminders.overdueFollowUps.length
    ? `<ul style="list-style: none; padding: 0; margin: 0;">${reminders.overdueFollowUps.map(overdueRow).join("")}</ul>`
    : "";
  const dueSoonHtml = reminders.dueSoonDeliverables.length
    ? `<ul style="list-style: none; padding: 0; margin: 0;">${reminders.dueSoonDeliverables.map(dueSoonRow).join("")}</ul>`
    : "";
  const staleHtml = reminders.staleDeals.length
    ? `<ul style="list-style: none; padding: 0; margin: 0;">${reminders.staleDeals.map(staleRow).join("")}</ul>`
    : "";

  const hasAny = reminders.totalCount > 0;

  return `<!doctype html>
<html>
  <head><meta charset="utf-8"><title>SponsorDesk daily digest</title></head>
  <body style="margin: 0; padding: 0; background: #fafaf7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #18181b;">
    <div style="max-width: 600px; margin: 0 auto; padding: 32px 20px;">
      <header style="margin-bottom: 16px;">
        <p style="margin: 0; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.06em;">SponsorDesk · ${escapeHtml(date)}</p>
        <h1 style="margin: 6px 0 0; font-size: 24px; font-weight: 600; color: #18181b; letter-spacing: -0.02em;">
          ${hasAny ? `${reminders.totalCount} thing${reminders.totalCount === 1 ? "" : "s"} need your attention` : "All clear today"}
        </h1>
        <p style="margin: 6px 0 0; font-size: 14px; color: #71717a;">
          ${hasAny ? "Here is what would be lost if you forgot." : "Nothing overdue, nothing stale. Ship more."}
        </p>
      </header>
      ${section("Overdue follow-ups", overdueHtml, true)}
      ${section("Due soon (next 3 days)", dueSoonHtml)}
      ${section("Stale deals (14+ days silent)", staleHtml)}
      <footer style="margin-top: 24px; text-align: center;">
        <a href="${appUrl}/reminders" style="display: inline-block; padding: 10px 20px; background: #ea580c; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 500;">Open SponsorDesk</a>
        <p style="margin: 16px 0 0; font-size: 11px; color: #a1a1aa;">Sent because you opted into the daily digest. Manage in settings.</p>
      </footer>
    </div>
  </body>
</html>`;
}

export function renderDigestText(reminders: RemindersForUser): string {
  const lines: string[] = [];
  lines.push(`SponsorDesk daily digest — ${new Date().toLocaleDateString()}`);
  lines.push("");
  if (reminders.totalCount === 0) {
    lines.push("All clear today. Nothing overdue, nothing stale.");
    return lines.join("\n");
  }
  if (reminders.overdueFollowUps.length) {
    lines.push(`OVERDUE FOLLOW-UPS (${reminders.overdueFollowUps.length})`);
    for (const r of reminders.overdueFollowUps) {
      lines.push(`  · ${r.dealTitle} — ${r.brandName} (${r.daysOverdue}d overdue)`);
    }
    lines.push("");
  }
  if (reminders.dueSoonDeliverables.length) {
    lines.push(`DUE SOON (${reminders.dueSoonDeliverables.length})`);
    for (const r of reminders.dueSoonDeliverables) {
      lines.push(`  · ${r.title} — ${r.brandName} (in ${r.daysUntilDue}d)`);
    }
    lines.push("");
  }
  if (reminders.staleDeals.length) {
    lines.push(`STALE DEALS (${reminders.staleDeals.length})`);
    for (const r of reminders.staleDeals) {
      lines.push(`  · ${r.dealTitle} — ${r.brandName} (${r.daysSinceLastContact}d silent)`);
    }
    lines.push("");
  }
  return lines.join("\n");
}
