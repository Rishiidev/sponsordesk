import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Media Kit Generator — SponsorDesk",
  description:
    "Create a professional creator media kit in your browser — reach, platforms, past collabs, rates. No sign-up, no backend.",
};

export default function MediaKitGeneratorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
