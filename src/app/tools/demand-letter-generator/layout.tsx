import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free Demand Letter Generator — SponsorDesk",
  description:
    "Create a formal demand letter for an overdue brand payment in your browser — no sign-up, no backend. Not legal advice.",
}

export default function DemandLetterGeneratorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
