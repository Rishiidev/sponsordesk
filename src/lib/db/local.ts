// Stub for local database (in-memory / JSON file) to be replaced with Supabase
import { v4 as uuidv4 } from "uuid";

// Types
export type Brand = {
  id: string;
  userId: string;
  name: string;
  website?: string;
  primaryContactName?: string;
  primaryContactEmail?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Deal = {
  id: string;
  userId: string;
  brandId: string;
  title: string;
  stage: "inbound" | "negotiating" | "live" | "paid" | "lost";
  amountCents?: number;
  currency?: string;
  startDate?: string;
  endDate?: string;
  paymentTermsDays?: number;
  paymentStatus?: string;
  contractUrl?: string;
  notes?: string;
  lastContactAt?: string;
  nextFollowupAt?: string;
  createdAt: string;
  updatedAt: string;
};

// In-memory stores (reset on server restart)
// In production, we would persist to a JSON file in .data/
let brands: Brand[] = [];
let deals: Deal[] = [];

// Helper to get or create user-specific data
function getUserBrands(userId: string) {
  return brands.filter((b) => b.userId === userId);
}
function getUserDeals(userId: string) {
  return deals.filter((d) => d.userId === userId);
}

export async function getBrands(userId: string): Promise<Brand[]> {
  return getUserBrands(userId);
}
export async function getDeals(userId: string): Promise<Deal[]> {
  return getUserDeals(userId);
}
export async function createBrand(data: Omit<Brand, "id" | "createdAt" | "updatedAt">): Promise<Brand> {
  const brand: Brand = {
    id: uuidv4(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  brands.push(brand);
  return brand;
}
export async function updateBrand(id: string, data: Partial<Brand>): Promise<Brand> {
  const idx = brands.findIndex((b) => b.id === id);
  if (idx === -1) throw new Error("Brand not found");
  const updated = { ...brands[idx], ...data, updatedAt: new Date().toISOString() };
  brands[idx] = updated;
  return updated;
}
export async function deleteBrand(id: string): Promise<void> {
  brands = brands.filter((b) => b.id !== id);
  // Also delete associated deals? For now, leave them (they'll be orphaned)
}
export async function createDeal(data: Omit<Deal, "id" | "createdAt" | "updatedAt">): Promise<Deal> {
  const deal: Deal = {
    id: uuidv4(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  deals.push(deal);
  return deal;
}
export async function updateDeal(id: string, data: Partial<Deal>): Promise<Deal> {
  const idx = deals.findIndex((d) => d.id === id);
  if (idx === -1) throw new Error("Deal not found");
  const updated = { ...deals[idx], ...data, updatedAt: new Date().toISOString() };
  deals[idx] = updated;
  return updated;
}
export async function deleteDeal(id: string): Promise<void> {
  deals = deals.filter((d) => d.id !== id);
}
export async function moveDealStage(id: string, stage: Deal["stage"]): Promise<Deal> {
  const idx = deals.findIndex((d) => d.id === id);
  if (idx === -1) throw new Error("Deal not found");
  const updated = { ...deals[idx], stage, updatedAt: new Date().toISOString() };
  deals[idx] = updated;
  return updated;
}