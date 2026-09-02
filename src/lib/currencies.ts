export interface Currency {
  code: string;
  label: string;
}

/** A handful of common currencies — enough for most freelancers, not exhaustive. */
export const CURRENCIES: Currency[] = [
  { code: "USD", label: "USD — US Dollar" },
  { code: "EUR", label: "EUR — Euro" },
  { code: "GBP", label: "GBP — British Pound" },
  { code: "CAD", label: "CAD — Canadian Dollar" },
  { code: "AUD", label: "AUD — Australian Dollar" },
  { code: "INR", label: "INR — Indian Rupee" },
  { code: "JPY", label: "JPY — Japanese Yen" },
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
