// Lightweight onboarding helper — creates a brand tied to the demo user and
// returns its id so the deal step can link to it.
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/local";
import { createBrand } from "@/lib/db/local";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Not signed in" }, { status: 401 });
  }

  const form = await req.formData();
  const name = (form.get("name") as string | null)?.trim();
  if (!name) {
    return NextResponse.json({ success: false, error: "Brand name is required" }, { status: 400 });
  }

  const brand = await createBrand({
    userId: user.id,
    name,
    website: (form.get("website") as string | null) || undefined,
    primaryContactName: (form.get("primaryContactName") as string | null) || undefined,
    primaryContactEmail: (form.get("primaryContactEmail") as string | null) || undefined,
  });

  return NextResponse.json({ success: true, brand });
}
