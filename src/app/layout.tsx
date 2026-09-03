import type { Metadata } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--ds-font-display",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--ds-font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sponsordesk.bruuhh.com"),
  title: "SponsorDesk — Track brand deals without losing your mind",
  description:
    "A lightweight CRM for creators who actually close brand deals. Stop tracking sponsors in spreadsheets.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "SponsorDesk",
    description:
      "A lightweight CRM for creators who actually close brand deals.",
    type: "website",
    url: "https://sponsordesk.bruuhh.com",
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
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body className="grain">{children}</body>
    </html>
  );
}
