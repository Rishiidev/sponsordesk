import type { Metadata, Viewport } from "next";
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

const APP_NAME = "SponsorDesk";
const APP_DEFAULT_TITLE = "SponsorDesk — Track brand deals without losing your mind";
const APP_DESCRIPTION =
  "A lightweight CRM for creators who actually close brand deals. Stop tracking sponsors in spreadsheets.";

export const metadata: Metadata = {
  metadataBase: new URL("https://sponsordesk.io"),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: "%s — SponsorDesk",
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    type: "website",
    url: "https://sponsordesk.io",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#ea580c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="grain">{children}</body>
    </html>
  );
}
