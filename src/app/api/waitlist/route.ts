import { NextResponse } from "next/server";
import { Resend } from "resend";

type Payload = {
  email?: string;
  followers?: string;
  dealVolume?: string;
  currentTool?: string;
  pain?: string;
  referrer?: string;
  utm_source?: string | null;
};

// Tag emails by segment so you can sort / segment the Resend audience later.
function segmentTag(payload: Payload): string {
  if (!payload.dealVolume) return "no-deal-info";
  if (payload.dealVolume.startsWith("10+")) return "high-volume";
  if (payload.dealVolume.startsWith("4")) return "mid-volume";
  if (payload.dealVolume.startsWith("1")) return "early-volume";
  return "pre-monetization";
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please use a valid email." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const notifyFrom = process.env.NOTIFY_FROM ?? "SponsorDesk <hello@sponsordesk.io>";
  const notifyTo = process.env.NOTIFY_TO ?? "founder@sponsordesk.io";

  // Dev fallback: if no API key, just log + succeed. Lets the form work locally.
  if (!apiKey) {
    console.warn("[waitlist] RESEND_API_KEY missing. Logging instead:", {
      email,
      ...body,
    });
    return NextResponse.json({ ok: true, dev: true });
  }

  const resend = new Resend(apiKey);
  const tag = segmentTag(body);

  try {
    // 1. Add to audience (so you can broadcast later)
    if (audienceId) {
      await resend.contacts.create({
        email,
        unsubscribed: false,
        audienceId,
        firstName: undefined,
      }).catch((e: unknown) => {
        // Duplicate contact is fine — swallow it.
        if (!(e instanceof Error && e.message.toLowerCase().includes("already exists"))) {
          console.error("[waitlist] audience.create failed:", e);
        }
      });
    }

    // 2. Auto-welcome email to the user
    await resend.emails.send({
      from: notifyFrom,
      to: email,
      subject: "You're on the SponsorDesk list",
      html: welcomeHtml(email),
    });

    // 3. Notification to the founder with the qualifiers
    await resend.emails.send({
      from: notifyFrom,
      to: notifyTo,
      subject: `[Waitlist · ${tag}] ${email}`,
      text: [
        `Email: ${email}`,
        `Followers: ${body.followers ?? "-"}`,
        `Deals/mo: ${body.dealVolume ?? "-"}`,
        `Current tool: ${body.currentTool ?? "-"}`,
        `Pain: ${body.pain ?? "-"}`,
        `Referrer: ${body.referrer ?? "-"}`,
        `UTM source: ${body.utm_source ?? "-"}`,
        `Tag: ${tag}`,
        `---`,
        new Date().toISOString(),
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[waitlist] send failed:", err);
    return NextResponse.json(
      { error: "Couldn't process your signup. Try again in a minute." },
      { status: 500 },
    );
  }
}

function welcomeHtml(email: string): string {
  return `
  <div style="font-family: ui-sans-serif, system-ui; max-width: 560px; margin: 0 auto; padding: 32px 0; color: #18181b;">
    <h1 style="font-size: 22px; font-weight: 600; margin: 0 0 16px;">You're on the list.</h1>
    <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
      Thanks for signing up for SponsorDesk, a CRM built for individual creators managing brand deals.
    </p>
    <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
      I'm building this solo in public — and it's live right now. Head to
      <a href="https://sponsordesk-app-v2.vercel.app/sign-up" style="color: #ea580c;">sponsordesk-app-v2.vercel.app</a>
      to create your account. Founder pricing is locked in for life.
    </p>
    <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
      In the meantime, if you want to shape what gets built first, reply to this email with the one thing that makes you lose the most sleep about brand deals.
    </p>
    <p style="font-size: 14px; color: #71717a; margin: 0;">
      - The SponsorDesk team
    </p>
  </div>`;
}