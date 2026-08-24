// Daily digest cron handler. In production, Vercel Cron calls this route once
// a day. In demo mode, we just log the rendered email HTML to the server logs.
import { NextResponse } from "next/server";
import { getRemindersForUser } from "@/lib/reminders/detect";
import { renderDigestHtml, renderDigestText } from "@/lib/reminders/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// In-memory dedupe log, keyed by userId + date.
declare global {
  // eslint-disable-next-line no-var
  var __digestSendLog: Set<string> | undefined;
}
function getSendLog(): Set<string> {
  if (!globalThis.__digestSendLog) {
    globalThis.__digestSendLog = new Set();
  }
  return globalThis.__digestSendLog;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

const DEMO_USER_ID = "demo-user-id";

export async function GET(request: Request) {
  // Optional shared-secret check so this can't be hit by a random client.
  // Set CRON_SECRET in Vercel env to enable; otherwise we allow (demo mode).
  const required = process.env.CRON_SECRET;
  if (required) {
    const provided = new URL(request.url).searchParams.get("secret");
    if (provided !== required) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  const log = getSendLog();
  const key = `${DEMO_USER_ID}:${todayKey()}`;
  const alreadySent = log.has(key);

  // Build the digest for the demo user.
  const reminders = await getRemindersForUser(DEMO_USER_ID);
  const html = renderDigestHtml(reminders, { appUrl: process.env.APP_URL ?? "https://sponsordesk.io" });
  const text = renderDigestText(reminders);

  // In demo mode (no RESEND_API_KEY) we console.log the email instead of
  // sending it. The /reminders page renders the same content for preview.
  if (!process.env.RESEND_API_KEY) {
    console.log("[cron:daily-digest] (demo mode — would send email)");
    console.log("[cron:daily-digest] subject:", digestSubject(reminders));
    console.log("[cron:daily-digest] text:", text);
    if (!alreadySent) {
      // Mark as sent for this UTC day so the next call in the same day is a no-op.
      log.add(key);
    }
    return NextResponse.json({
      ok: true,
      mode: "demo",
      userId: DEMO_USER_ID,
      date: todayKey(),
      alreadySent,
      totalCount: reminders.totalCount,
      htmlLength: html.length,
    });
  }

  // Real send via Resend. Idempotency: skip if already sent today.
  if (alreadySent) {
    return NextResponse.json({ ok: true, skipped: true, reason: "already-sent-today" });
  }
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.DIGEST_FROM ?? "SponsorDesk <digest@sponsordesk.io>",
      to: "demo@sponsordesk.io", // in real auth, use the user's email
      subject: digestSubject(reminders),
      html,
      text,
    });
    log.add(key);
    return NextResponse.json({ ok: true, sent: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "send failed" },
      { status: 500 },
    );
  }
}

function digestSubject(r: { overdueFollowUps: any[]; dueSoonDeliverables: any[]; staleDeals: any[] }) {
  const total = r.overdueFollowUps.length + r.dueSoonDeliverables.length + r.staleDeals.length;
  if (total === 0) return "SponsorDesk digest — all clear today";
  return `SponsorDesk digest — ${total} thing${total === 1 ? "" : "s"} need your attention`;
}
