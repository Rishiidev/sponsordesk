import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/local";
import { ADMIN_EMAILS } from "@/lib/admin/allowlist";

// Admin route group — kept minimal. No sidebar so the founder view feels
// like a separate control panel. We rely on the (app) layout's auth check
// indirectly: getCurrentUser() returns null when not signed in.
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  if (!user.email || !ADMIN_EMAILS.includes(user.email)) {
    redirect("/dashboard");
  }
  return <>{children}</>;
}
