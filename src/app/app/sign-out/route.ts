import { signOut } from "@/lib/auth/local";
import { redirect } from "next/navigation";

export async function POST() {
  await signOut();
  // Redirect to marketing homepage
  redirect("/");
}