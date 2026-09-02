import { CURRENCIES } from "@/lib/currencies";

/**
 * ISO country code -> currency code, for defaulting the rate calculator's
 * currency picker from the visitor's Vercel-detected country. Only covers
 * countries that map to a currency in CURRENCIES — everything else falls
 * back to USD. Not exhaustive; a manual override is always shown next to
 * it since geo-detection (VPNs, travel, shared devices) is never reliable
 * enough to trust on its own.
 */
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: "USD",
  GB: "GBP",
  CA: "CAD",
  AU: "AUD",
  IN: "INR",
  JP: "JPY",
  // Eurozone
  DE: "EUR",
  FR: "EUR",
  ES: "EUR",
  IT: "EUR",
  NL: "EUR",
  BE: "EUR",
  AT: "EUR",
  IE: "EUR",
  PT: "EUR",
  FI: "EUR",
  GR: "EUR",
  LU: "EUR",
  SK: "EUR",
  SI: "EUR",
  EE: "EUR",
  LV: "EUR",
  LT: "EUR",
  CY: "EUR",
  MT: "EUR",
};

const DEFAULT_CURRENCY = "USD";

export function resolveCurrencyFromCountry(countryCode: string | null | undefined): string {
  if (!countryCode) return DEFAULT_CURRENCY;
  return COUNTRY_TO_CURRENCY[countryCode.toUpperCase()] ?? DEFAULT_CURRENCY;
}

/** Converts a USD amount to the given currency using the static rate snapshot in CURRENCIES. */
export function convertFromUSD(amountUSD: number, currencyCode: string): number {
  const rate = CURRENCIES.find((c) => c.code === currencyCode)?.usdRate ?? 1;
  return amountUSD * rate;
}

export function formatCurrencyAmount(amount: number, currencyCode: string): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: currencyCode, maximumFractionDigits: 0 });
}
