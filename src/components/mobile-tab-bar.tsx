"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  GridFour,
  Buildings,
  Briefcase,
  Bell,
} from "@phosphor-icons/react/dist/ssr";

type Tab = {
  href: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: any;
  match: (pathname: string) => boolean;
};

const tabs: Tab[] = [
  {
    href: "/dashboard",
    label: "Home",
    Icon: House,
    match: (p) => p === "/dashboard",
  },
  {
    href: "/pipeline",
    label: "Pipeline",
    Icon: GridFour,
    match: (p) => p === "/pipeline",
  },
  {
    href: "/brands",
    label: "Brands",
    Icon: Buildings,
    match: (p) => p === "/brands" || p.startsWith("/brands/"),
  },
  {
    href: "/deals",
    label: "Deals",
    Icon: Briefcase,
    match: (p) => p === "/deals" || p.startsWith("/deals/"),
  },
  {
    href: "/reminders",
    label: "Reminders",
    Icon: Bell,
    match: (p) => p === "/reminders",
  },
];

// Routes where the bottom tab bar should NOT show (full-screen pages)
const HIDDEN_ROUTES = [
  "/onboarding",
  "/admin",
  "/settings/billing",
  "/sign-in",
  "/sign-out",
];

export function MobileTabBar() {
  const pathname = usePathname() || "/";

  // Hide on full-screen routes
  const hidden = HIDDEN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  if (hidden) return null;

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-line)] bg-white/95 backdrop-blur-md shadow-[0_-4px_12px_rgba(0,0,0,0.04)] md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex h-16 items-stretch justify-around">
        {tabs.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.Icon;
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex h-full flex-col items-center justify-center gap-0.5 touch-manipulation ${
                  active
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-ink-3)]"
                }`}
              >
                {active && (
                  <span
                    aria-hidden
                    className="absolute top-1 h-1 w-1 rounded-full bg-[var(--color-accent)]"
                  />
                )}
                <Icon
                  size={24}
                  weight={active ? "fill" : "regular"}
                  aria-hidden
                />
                <span className="text-[10px] font-medium leading-none">
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}