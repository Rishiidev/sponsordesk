import type { Invoice, LineItem, PartyDetails } from "./invoice-types";
import { createDefaultInvoice, createEmptyLineItem, generateId } from "./invoice-utils";

const STORAGE_KEY = "invoice-generator:invoice:v1";

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function sanitizeParty(value: unknown, fallback: PartyDetails): PartyDetails {
  if (!isRecord(value)) return fallback;
  return {
    name: isString(value.name) ? value.name : fallback.name,
    email: isString(value.email) ? value.email : fallback.email,
    address: isString(value.address) ? value.address : fallback.address,
  };
}

function sanitizeLineItem(value: unknown): LineItem | null {
  if (!isRecord(value)) return null;
  return {
    id: isString(value.id) && value.id.length > 0 ? value.id : generateId(),
    description: isString(value.description) ? value.description : "",
    quantity: isFiniteNumber(value.quantity) ? value.quantity : 0,
    unitPrice: isFiniteNumber(value.unitPrice) ? value.unitPrice : 0,
  };
}

/**
 * Defensively rebuilds a valid `Invoice` from unknown (e.g. localStorage) data.
 * Missing or malformed fields fall back to sensible defaults rather than
 * throwing, so a corrupted or outdated stored payload can never crash the page.
 */
export function sanitizeInvoice(value: unknown): Invoice {
  const fallback = createDefaultInvoice();
  if (!isRecord(value)) return fallback;

  const rawLineItems = Array.isArray(value.lineItems) ? value.lineItems : [];
  const lineItems = rawLineItems
    .map(sanitizeLineItem)
    .filter((item): item is LineItem => item !== null);

  return {
    invoiceNumber: isString(value.invoiceNumber) ? value.invoiceNumber : fallback.invoiceNumber,
    issueDate: isString(value.issueDate) ? value.issueDate : fallback.issueDate,
    dueDate: isString(value.dueDate) ? value.dueDate : fallback.dueDate,
    currency: isString(value.currency) ? value.currency : fallback.currency,
    from: sanitizeParty(value.from, fallback.from),
    billTo: sanitizeParty(value.billTo, fallback.billTo),
    lineItems: lineItems.length > 0 ? lineItems : [createEmptyLineItem()],
    taxRate: isString(value.taxRate) ? value.taxRate : fallback.taxRate,
    discount: isString(value.discount) ? value.discount : fallback.discount,
    notes: isString(value.notes) ? value.notes : fallback.notes,
  };
}

/**
 * Reads and validates the persisted invoice. Returns `null` if nothing is
 * stored, storage is unavailable, or the payload can't be parsed — callers
 * should fall back to `createDefaultInvoice()` in that case. Never throws.
 */
export function loadInvoiceFromStorage(): Invoice | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return sanitizeInvoice(parsed);
  } catch {
    return null;
  }
}

/** Persists the invoice. Silently no-ops on any storage failure (quota, private mode, etc). */
export function saveInvoiceToStorage(invoice: Invoice): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(invoice));
  } catch {
    // Storage can throw in private browsing, when disabled, or over quota.
    // Autosave is a nice-to-have, so we swallow the error and move on.
  }
}
