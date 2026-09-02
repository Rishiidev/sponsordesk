/**
 * Core domain types for the invoice generator. Everything about the invoice
 * form lives in a single `Invoice` object so it can be trivially
 * serialized to/from localStorage.
 */

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface PartyDetails {
  name: string;
  email: string;
  /** Multiline postal address, stored with newlines preserved. */
  address: string;
}

export interface Invoice {
  invoiceNumber: string;
  /** ISO date string (yyyy-mm-dd), matches <input type="date"> value format. */
  issueDate: string;
  /** ISO date string (yyyy-mm-dd). */
  dueDate: string;
  /** ISO 4217 currency code, e.g. "USD". */
  currency: string;
  from: PartyDetails;
  billTo: PartyDetails;
  lineItems: LineItem[];
  /**
   * Optional tax rate as a percentage, kept as the raw string the user typed
   * so the field can be blank (no tax) without coercing to "0".
   */
  taxRate: string;
  /**
   * Optional flat discount amount, kept as a raw string for the same reason
   * as `taxRate`.
   */
  discount: string;
  notes: string;
}

export interface InvoiceTotals {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
}
