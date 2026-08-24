"use server";

// Server actions for brands
import { createBrand, updateBrand, deleteBrand, getBrands } from "@/lib/db/local";

export async function createBrandAction(formData: FormData) {
  const name = formData.get("name") as string;
  const website = formData.get("website") as string | undefined;
  const primaryContactName = formData.get("primaryContactName") as string | undefined;
  const primaryContactEmail = formData.get("primaryContactEmail") as string | undefined;
  const notes = formData.get("notes") as string | undefined;

  if (!name || name.trim().length === 0) {
    return { success: false, error: "Brand name is required" };
  }

  // Get current user (demo user for now)
  const userId = "demo-user-id";

  const brand = await createBrand({
    userId,
    name: name.trim(),
    website: website?.trim() || undefined,
    primaryContactName: primaryContactName?.trim() || undefined,
    primaryContactEmail: primaryContactEmail?.trim() || undefined,
    notes: notes?.trim() || undefined,
  });

  return { success: true, brand };
}

export async function updateBrandAction(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const website = formData.get("website") as string | undefined;
  const primaryContactName = formData.get("primaryContactName") as string | undefined;
  const primaryContactEmail = formData.get("primaryContactEmail") as string | undefined;
  const notes = formData.get("notes") as string | undefined;

  if (!name || name.trim().length === 0) {
    return { success: false, error: "Brand name is required" };
  }

  const brand = await updateBrand(id, {
    name: name.trim(),
    website: website?.trim() || undefined,
    primaryContactName: primaryContactName?.trim() || undefined,
    primaryContactEmail: primaryContactEmail?.trim() || undefined,
    notes: notes?.trim() || undefined,
  });

  return { success: true, brand };
}

export async function deleteBrandAction(id: string) {
  await deleteBrand(id);
  return { success: true };
}