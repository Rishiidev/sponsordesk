"use server";

// Server actions for deals
import { createDeal, updateDeal, deleteDeal, moveDealStage, getDeals, getBrands } from "@/lib/db/local";
import { checkDealLimit } from "@/lib/billing/tier";

export async function createDealAction(formData: FormData) {
  const brandId = formData.get("brandId") as string;
  const title = formData.get("title") as string;
  const stage = formData.get("stage") as "inbound" | "negotiating" | "live" | "paid" | "lost";
  const amount = formData.get("amountCents") as string | undefined;
  const currency = formData.get("currency") as string | undefined;
  const startDate = formData.get("startDate") as string | undefined;
  const endDate = formData.get("endDate") as string | undefined;
  const paymentTermsDays = formData.get("paymentTermsDays") as string | undefined;
  const notes = formData.get("notes") as string | undefined;

  if (!brandId || !title || !stage) {
    return { success: false, error: "Brand, title, and stage are required" };
  }

  // Tier-based cap. Free users get 3 active deals; Pro is unlimited.
  const userId = "demo-user-id";
  const limit = await checkDealLimit(userId);
  if (!limit.allowed) {
    return {
      success: false,
      error: `Free tier is limited to ${limit.limit} active deals. Upgrade to Pro for unlimited.`,
      code: "limit_hit",
      currentCount: limit.currentCount,
      limit: limit.limit,
    } as const;
  }

  const deal = await createDeal({
    userId,
    brandId,
    title: title.trim(),
    stage,
    amountCents: amount ? parseInt(amount) : undefined,
    currency: currency || "USD",
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    paymentTermsDays: paymentTermsDays ? parseInt(paymentTermsDays) : 30,
    paymentStatus: "pending",
    notes: notes?.trim() || undefined,
  });

  return { success: true, deal };
}

export async function updateDealAction(id: string, formData: FormData) {
  const brandId = formData.get("brandId") as string | undefined;
  const title = formData.get("title") as string | undefined;
  const stage = formData.get("stage") as "inbound" | "negotiating" | "live" | "paid" | "lost" | undefined;
  const amount = formData.get("amountCents") as string | undefined;
  const currency = formData.get("currency") as string | undefined;
  const startDate = formData.get("startDate") as string | undefined;
  const endDate = formData.get("endDate") as string | undefined;
  const paymentTermsDays = formData.get("paymentTermsDays") as string | undefined;
  const paymentStatus = formData.get("paymentStatus") as string | undefined;
  const notes = formData.get("notes") as string | undefined;
  const nextFollowupAt = formData.get("nextFollowupAt") as string | undefined;

  const data: any = {};
  if (brandId) data.brandId = brandId;
  if (title) data.title = title.trim();
  if (stage) data.stage = stage;
  if (amount) data.amountCents = parseInt(amount);
  if (currency) data.currency = currency;
  if (startDate) data.startDate = startDate;
  if (endDate) data.endDate = endDate;
  if (paymentTermsDays) data.paymentTermsDays = parseInt(paymentTermsDays);
  if (paymentStatus) data.paymentStatus = paymentStatus;
  // Always set nextFollowupAt (allow clearing by passing empty string)
  if (nextFollowupAt !== null && nextFollowupAt !== undefined) {
    data.nextFollowupAt = nextFollowupAt || undefined;
  }
  if (notes) data.notes = notes.trim();

  const deal = await updateDeal(id, data);
  return { success: true, deal };
}

export async function deleteDealAction(id: string) {
  await deleteDeal(id);
  return { success: true };
}

export async function moveDealStageAction(id: string, stage: "inbound" | "negotiating" | "live" | "paid" | "lost") {
  const deal = await moveDealStage(id, stage);
  return { success: true, deal };
}

export async function getDealsForUser() {
  const userId = "demo-user-id";
  return getDeals(userId);
}

export async function getBrandsForUser() {
  const userId = "demo-user-id";
  return getBrands(userId);
}