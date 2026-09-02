import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Free Invoice Generator — SponsorDesk",
  description: "Create and print professional invoices in your browser — no sign-up, no backend.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Invoices",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2b4bff",
};

export default function InvoiceGeneratorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
