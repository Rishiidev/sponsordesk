import type { Invoice, InvoiceTotals, LineItem } from "./invoice-types";
import { DEFAULT_CURRENCY } from "./currencies";

/** Generates a reasonably-unique id for a line item's React key / removal target. */
export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `line-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * A fixed, deterministic id for the single line item the form starts with.
 * The default invoice must render identically on the server and on the
 * client during hydration, so this can't be a random id (crypto.randomUUID
 * would produce a different value each time it's called, on each side).
 * Rows added later via "Add line item" use `generateId()` instead, since
 * those only ever happen client-side in response to a click.
 */
const INITIAL_LINE_ITEM_ID = "line-item-initial";

export function createEmptyLineItem(id: string = generateId()): LineItem {
  return { id, description: "", quantity: 1, unitPrice: 0 };
}

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * The blank starting state for a brand-new invoice. Dates are intentionally
 * left empty here (rather than defaulting to "today") because this factory
 * also backs the server-rendered HTML for this statically-prerendered page —
 * calling `new Date()` here would bake in the build's date on the server
 * while the client computes the real "today", guaranteeing a hydration
 * mismatch (and a stale date) on every visit. `getDefaultDates()` below is
 * used instead, from a client-only effect, once the page has mounted.
 */
export function createDefaultInvoice(): Invoice {
  return {
    invoiceNumber: "INV-0001",
    issueDate: "",
    dueDate: "",
    currency: DEFAULT_CURRENCY,
    from: { name: "", email: "", address: "" },
    billTo: { name: "", email: "", address: "" },
    lineItems: [createEmptyLineItem(INITIAL_LINE_ITEM_ID)],
    taxRate: "",
    discount: "",
    notes: "",
  };
}

/** Computes "today" and "today + 14 days", for populating a fresh invoice client-side only. */
export function getDefaultDates(): { issueDate: string; dueDate: string } {
  const today = new Date();
  const due = new Date(today);
  due.setDate(due.getDate() + 14);
  return { issueDate: toDateInputValue(today), dueDate: toDateInputValue(due) };
}

export function computeLineTotal(item: LineItem): number {
  const quantity = Number.isFinite(item.quantity) ? item.quantity : 0;
  const unitPrice = Number.isFinite(item.unitPrice) ? item.unitPrice : 0;
  return quantity * unitPrice;
}

export function computeTotals(invoice: Invoice): InvoiceTotals {
  const subtotal = invoice.lineItems.reduce((sum, item) => sum + computeLineTotal(item), 0);

  const parsedTaxRate = Number.parseFloat(invoice.taxRate);
  const taxRate = Number.isFinite(parsedTaxRate) ? parsedTaxRate : 0;
  const taxAmount = subtotal * (taxRate / 100);

  const parsedDiscount = Number.parseFloat(invoice.discount);
  const discount = Number.isFinite(parsedDiscount) ? parsedDiscount : 0;

  // A discount larger than subtotal+tax would otherwise render a negative
  // "Total due" on a client-facing invoice with no warning that it's off.
  const total = Math.max(0, subtotal + taxAmount - discount);

  return { subtotal, taxRate, taxAmount, discount, total };
}

/** Parses a user-typed numeric field, treating blank/invalid input as zero. */
export function parseNumberInput(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatDisplayDate(value: string): string {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
