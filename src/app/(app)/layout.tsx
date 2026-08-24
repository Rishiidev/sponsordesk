import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/local";
import DemoBanner from "@/components/demo-banner";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return (
    <>
      <DemoBanner />
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-[240px] border-r border-[var(--color-line)] bg-white">
          <div className="flex h-16 items-center justify-center">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] bg-[var(--color-ink)] text-[13px] font-semibold text-[var(--color-accent)]">
              S
            </span>
            <span className="ml-3 text-[15px] font-semibold tracking-tight text-[var(--color-ink)]">SponsorDesk</span>
          </div>
          <nav className="mt-6 space-y-2">
            <a href="/dashboard" className="flex w-full items-center px-4 py-3 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]">Dashboard</a>
            <a href="/pipeline" className="flex w-full items-center px-4 py-3 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]">Pipeline</a>
            <a href="/brands" className="flex w-full items-center px-4 py-3 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]">Brands</a>
            <a href="/deals" className="flex w-full items-center px-4 py-3 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]">Deals</a>
            <a href="/reminders" className="flex w-full items-center px-4 py-3 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-paper-2)]">Reminders</a>
          </nav>
        </aside>
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </>
  );
}