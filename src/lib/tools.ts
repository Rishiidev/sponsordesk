/**
 * Single source of truth for everything under /tools/*. Add a tool by
 * adding a row here — the /tools index grid, the marketing footer's tool
 * list, and each tool's own header nav all read from this.
 */
export const TOOLS = [
  {
    slug: "invoice-generator",
    name: "Invoice Generator",
    description: "Create and print professional invoices in your browser. No sign-up, no backend.",
  },
  {
    slug: "rate-calculator",
    name: "Rate Calculator",
    description: "Estimate what to charge for a sponsored post based on platform, audience, and niche.",
  },
  {
    slug: "media-kit-generator",
    name: "Media Kit Generator",
    description: "Create a professional media kit with your reach, platforms, and past collabs. No sign-up.",
  },
] as const;
