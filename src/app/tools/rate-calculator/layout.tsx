import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sponsorship Rate Calculator — SponsorDesk",
  description:
    "Estimate what to charge for a sponsored post based on your platform, audience size, engagement, and niche. Free, no sign-up.",
};

export default function RateCalculatorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
