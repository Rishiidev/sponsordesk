import type { DemandLetter } from "./demand-letter-types"
import { DEFAULT_CURRENCY } from "./currencies"

function toDateInputValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/**
 * Today's date, local calendar day (not UTC — toISOString() would roll over
 * a day early/late depending on the browser's timezone offset). Client-only,
 * for the same reason as getDefaultDates below.
 */
export function getTodayLocal(): string {
  return toDateInputValue(new Date())
}

/**
 * Blank starting state. Dates are left empty here (rather than defaulting to
 * "today") for the same reason as the invoice generator's
 * createDefaultInvoice: this factory also backs the server-rendered HTML for
 * a statically-prerendered page, and `new Date()` here would bake in the
 * build's date on the server. getDefaultDates() below runs client-only,
 * after mount.
 */
export function createDefaultLetter(): DemandLetter {
  return {
    creatorName: "",
    creatorEmail: "",
    brandContactName: "",
    brandCompany: "",
    invoiceNumber: "",
    invoiceDate: "",
    amountDue: 0,
    daysOverdue: 0,
    lateFee: 0,
    paymentDeadline: "",
    currency: DEFAULT_CURRENCY,
  }
}

/** "Today" and "today + 7 days", for populating a fresh letter client-side only. */
export function getDefaultDates(): { invoiceDate: string; paymentDeadline: string } {
  const today = new Date()
  const deadline = new Date(today)
  deadline.setDate(deadline.getDate() + 7)
  return { invoiceDate: toDateInputValue(today), paymentDeadline: toDateInputValue(deadline) }
}

export function computeTotalDue(letter: DemandLetter): number {
  const amount = Number.isFinite(letter.amountDue) ? letter.amountDue : 0
  const fee = Number.isFinite(letter.lateFee) ? letter.lateFee : 0
  return Math.max(0, amount + fee)
}

/** Parses a user-typed numeric field, treating blank/invalid input as zero. */
export function parseNumberInput(value: string): number {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function formatDisplayDate(value: string): string {
  if (!value) return "—"
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}
