import { NextResponse } from "next/server";
import { Resend } from "resend";

type Payload = {
  email?: string;
  utm_source?: string | null;
};

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
    console.warn("[waitlist] RESEND_API_KEY missing. Logging instead:", { email, ...body });
    return NextResponse.json({ ok: true, dev: true });
  }

  const resend = new Resend(apiKey);

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

    // 2. Auto-confirmation email to the subscriber
    await resend.emails.send({
      from: notifyFrom,
      to: email,
      subject: "You're subscribed to SponsorDesk updates",
      html: welcomeHtml(),
    });

    // 3. Notification to the founder
    await resend.emails.send({
      from: notifyFrom,
      to: notifyTo,
      subject: `[Updates list] ${email}`,
      text: [
        `Email: ${email}`,
        `Referrer: ${req.headers.get("referer") ?? "-"}`,
        `UTM source: ${body.utm_source ?? "-"}`,
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

function welcomeHtml(): string {
  return `
  <div style="font-family: ui-sans-serif, system-ui; max-width: 560px; margin: 0 auto; padding: 32px 0; color: #111113;">
    <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 16px;">You're on the updates list.</h1>
    <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
      SponsorDesk is live right now — you don't have to wait for anything. Head to
      <a href="https://sponsordesk-app-v2.vercel.app/sign-up" style="color: #2b4bff;">sponsordesk-app-v2.vercel.app</a>
      to create your account and lock in $9/mo founder pricing for life.
    </p>
    <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
      I'll email this list when new features and the Pro tier ship. If you want to shape what gets built next, just reply to this email.
    </p>
    <p style="font-size: 14px; color: #6b6e79; margin: 0;">
      - The SponsorDesk team
    </p>
  </div>`;
}
