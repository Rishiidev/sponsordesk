import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sponsordesk.io"),
  title: "SponsorDesk - Track brand deals without losing your mind",
  description:
    "A lightweight CRM for creators who actually close brand deals. Stop tracking sponsors in spreadsheets.",
  openGraph: {
    title: "SponsorDesk",
    description:
      "A lightweight CRM for creators who actually close brand deals.",
    type: "website",
    url: "https://sponsordesk.io",
  },
  twitter: {
    card: "summary_large_image",
    title: "SponsorDesk",
    description:
      "A lightweight CRM for creators who actually close brand deals.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="grain">{children}</body>
    </html>
  );
}