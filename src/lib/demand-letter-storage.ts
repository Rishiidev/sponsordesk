import type { DemandLetter } from "./demand-letter-types"
import { createDefaultLetter } from "./demand-letter-utils"

const STORAGE_KEY = "demand-letter-generator:letter:v1"

function isString(value: unknown): value is string {
  return typeof value === "string"
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

/**
 * Defensively rebuilds a valid `DemandLetter` from unknown (e.g. localStorage)
 * data. Missing or malformed fields fall back to sensible defaults rather
 * than throwing, so a corrupted or outdated stored payload can never crash
 * the page.
 */
export function sanitizeLetter(value: unknown): DemandLetter {
  const fallback = createDefaultLetter()
  if (!isRecord(value)) return fallback

  return {
    creatorName: isString(value.creatorName) ? value.creatorName : fallback.creatorName,
    creatorEmail: isString(value.creatorEmail) ? value.creatorEmail : fallback.creatorEmail,
    brandContactName: isString(value.brandContactName) ? value.brandContactName : fallback.brandContactName,
    brandCompany: isString(value.brandCompany) ? value.brandCompany : fallback.brandCompany,
    invoiceNumber: isString(value.invoiceNumber) ? value.invoiceNumber : fallback.invoiceNumber,
    invoiceDate: isString(value.invoiceDate) ? value.invoiceDate : fallback.invoiceDate,
    amountDue: isFiniteNumber(value.amountDue) ? value.amountDue : fallback.amountDue,
    daysOverdue: isFiniteNumber(value.daysOverdue) ? value.daysOverdue : fallback.daysOverdue,
    lateFee: isFiniteNumber(value.lateFee) ? value.lateFee : fallback.lateFee,
    paymentDeadline: isString(value.paymentDeadline) ? value.paymentDeadline : fallback.paymentDeadline,
    currency: isString(value.currency) ? value.currency : fallback.currency,
  }
}

/**
 * Reads and validates the persisted letter. Returns `null` if nothing is
 * stored, storage is unavailable, or the payload can't be parsed — callers
 * should fall back to `createDefaultLetter()` in that case. Never throws.
 */
export function loadLetterFromStorage(): DemandLetter | null {
  try {
    if (typeof window === "undefined") return null
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return sanitizeLetter(parsed)
  } catch {
    return null
  }
}

/** Persists the letter. Silently no-ops on any storage failure (quota, private mode, etc). */
export function saveLetterToStorage(letter: DemandLetter): void {
  try {
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(letter))
  } catch {
    // Storage can throw in private browsing, when disabled, or over quota.
    // Autosave is a nice-to-have, so we swallow the error and move on.
  }
}
