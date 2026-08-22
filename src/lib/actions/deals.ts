// Server actions for deals
import { createDeal, updateDeal, deleteDeal, moveDealStage, getDeals, getBrands } from "@/lib/db/local";

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

  // Free tier check: count active deals
  const userId = "demo-user-id";
  const deals = await getDeals(userId);
  const activeDeals = deals.filter((d) => d.stage !== "paid" && d.stage !== "lost");
  const isPro = false; // In demo mode, always free tier

  if (activeDeals.length >= 3 && !isPro) {
    return {
      success: false,
      error: "Free tier is limited to 3 active deals. Upgrade to Pro for unlimited.",
    };
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