// Tier + limit helpers for the local-first billing flow.
// Until real auth + payments ship, every user starts on the free tier.
import { getDeals } from "@/lib/db/local";

export type Tier = "free" | "pro";

export const FREE_TIER_DEAL_LIMIT = 3;

// In demo mode we have no real user records, so tier resolution is trivial.
export async function getUserTier(_userId: string): Promise<Tier> {
  return "free";
}

export type DealLimitResult = {
  allowed: boolean;
  currentCount: number;
  limit: number; // Infinity for Pro tier
  isPro: boolean;
};

// Active = anything that is not paid or lost. Free tier caps at 3.
export async function checkDealLimit(userId: string): Promise<DealLimitResult> {
  const tier = await getUserTier(userId);
  const deals = await getDeals(userId);
  const activeCount = deals.filter((d) => d.stage !== "paid" && d.stage !== "lost").length;
  const limit = tier === "pro" ? Number.POSITIVE_INFINITY : FREE_TIER_DEAL_LIMIT;
  return {
    allowed: tier === "pro" || activeCount < limit,
    currentCount: activeCount,
    limit,
    isPro: tier === "pro",
  };
}

export type Region = "IN" | "ROW";

export type Price = {
  region: Region;
  currency: "INR" | "USD";
  amountCents: number;
  amountLabel: string;
  cadence: "month";
  blurb: string;
};

export const PRICING: Record<Region, Price> = {
  IN: {
    region: "IN",
    currency: "INR",
    amountCents: 74900,
    amountLabel: "₹749",
    cadence: "month",
    blurb: "Recommended for Indian creators. GST-compliant Razorpay checkout (coming soon).",
  },
  ROW: {
    region: "ROW",
    currency: "USD",
    amountCents: 900,
    amountLabel: "$9",
    cadence: "month",
    blurb: "USD billed monthly. Stripe checkout is on the roadmap.",
  },
};

// Resolve a visitor's region. The headers() map may carry cf-ipcountry (Cloudflare / Vercel
// edge) and the standard Accept-Language header. We default to ROW when unsure.
export function resolveRegionFromHeaders(headers: Headers): Region {
  const cfCountry = headers.get("cf-ipcountry") || headers.get("x-vercel-ip-country") || "";
  if (cfCountry) {
    return cfCountry.toUpperCase() === "IN" ? "IN" : "ROW";
  }
  const accept = (headers.get("accept-language") || "").toLowerCase();
  const inPrefixes = ["hi", "pa", "bn", "ta", "te", "mr", "gu", "kn", "ml", "or"];
  for (const tag of accept.split(",")) {
    const lang = tag.trim().split(";")[0];
    const root = lang.split("-")[0];
    if (inPrefixes.includes(root)) return "IN";
  }
  return "ROW";
}
