export interface Currency {
  code: string;
  label: string;
  /**
   * Approximate units of this currency per 1 USD, for display conversion
   * only (e.g. the rate calculator). Static snapshot, not live — good
   * enough for a rough estimate, not for anything that needs to be exact.
   */
  usdRate: number;
}

/** A handful of common currencies — enough for most freelancers, not exhaustive. */
export const CURRENCIES: Currency[] = [
  { code: "USD", label: "USD — US Dollar", usdRate: 1 },
  { code: "EUR", label: "EUR — Euro", usdRate: 0.92 },
  { code: "GBP", label: "GBP — British Pound", usdRate: 0.79 },
  { code: "CAD", label: "CAD — Canadian Dollar", usdRate: 1.36 },
  { code: "AUD", label: "AUD — Australian Dollar", usdRate: 1.52 },
  { code: "INR", label: "INR — Indian Rupee", usdRate: 83 },
  { code: "JPY", label: "JPY — Japanese Yen", usdRate: 149 },
];

export const DEFAULT_CURRENCY = "USD";

/** Formats an amount using the given ISO currency code, falling back gracefully for unknown codes. */
export function formatCurrency(amount: number, currencyCode: string): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "symbol",
    }).format(safeAmount);
  } catch {
    return `${safeAmount.toFixed(2)} ${currencyCode}`;
  }
}
