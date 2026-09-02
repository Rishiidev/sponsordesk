import { RateCalculatorForm } from "@/components/rate-calculator-form";
import { SponsorDeskBrand } from "@/components/sponsordesk-brand";
import { ToolsHeader } from "@/components/tools-header";

export default function RateCalculatorPage() {
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

        <RateCalculatorForm />
      </main>

      <SponsorDeskBrand variant="footer" toolSlug="rate-calculator" />
    </div>
  );
}
