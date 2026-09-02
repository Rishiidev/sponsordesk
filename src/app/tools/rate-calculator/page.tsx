import { headers } from "next/headers";

import { RateCalculatorForm } from "@/components/rate-calculator-form";
import { SponsorDeskBrand } from "@/components/sponsordesk-brand";
import { ToolsHeader } from "@/components/tools-header";
import { resolveCurrencyFromCountry } from "@/lib/geo-currency";

export default async function RateCalculatorPage() {
  // Vercel sets this header at the edge for every request that reaches it;
  // absent in local dev, where resolveCurrencyFromCountry falls back to USD.
  const country = (await headers()).get("x-vercel-ip-country");
  const defaultCurrency = resolveCurrencyFromCountry(country);

  return (
    <div className="min-h-screen bg-background">
      <ToolsHeader />

      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Sponsorship rate calculator</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            What to charge for a sponsored post — a starting point, not a quote.
          </p>
        </div>

        <RateCalculatorForm defaultCurrency={defaultCurrency} />
      </main>

      <SponsorDeskBrand variant="footer" toolSlug="rate-calculator" />
    </div>
  );
}
