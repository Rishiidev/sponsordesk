// Lightweight onboarding helper — creates a deal tied to the demo user. If
// no brandId is passed, the API will auto-create an "Unknown brand" row so
// the deal step never blocks on missing brand wiring.
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/local";
import { createBrand, createDeal, getDeals } from "@/lib/db/local";
import { checkDealLimit } from "@/lib/billing/tier";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Not signed in" }, { status: 401 });
  }

  const form = await req.formData();
  const title = (form.get("title") as string | null)?.trim();
  if (!title) {
    return NextResponse.json({ success: false, error: "Deal title is required" }, { status: 400 });
  }
  const stage = (form.get("stage") as string | null) || "inbound";
  const amountCents = parseInt((form.get("amountCents") as string | null) || "0") || undefined;

  let brandId = (form.get("brandId") as string | null) || "";
  if (!brandId) {
    // Safety net — auto-create an "Unknown brand" entry the user can rename later.
    const existing = await getDeals(user.id);
    if (existing.length === 0) {
      const b = await createBrand({ userId: user.id, name: "My first brand" });
      brandId = b.id;
    } else {
      return NextResponse.json(
        { success: false, error: "Pick or create a brand first." },
        { status: 400 },
      );
    }
  }

  const limit = await checkDealLimit(user.id);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: `Free tier is limited to ${limit.limit} active deals. Upgrade to Pro for unlimited.`,
        code: "limit_hit",
      },
      { status: 402 },
    );
  }

  const deal = await createDeal({
    userId: user.id,
    brandId,
    title,
    stage: stage as "inbound" | "negotiating" | "live" | "paid" | "lost",
    amountCents,
    currency: "USD",
    paymentTermsDays: 30,
    paymentStatus: "pending",
  });

  return NextResponse.json({ success: true, deal });
}
