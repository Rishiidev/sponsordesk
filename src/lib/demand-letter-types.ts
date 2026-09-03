/**
 * Core domain type for the demand-letter generator. Single flat object,
 * mirrors the invoice generator's `Invoice` — trivially serialized to/from
 * localStorage, no line items needed here.
 */
export interface DemandLetter {
  creatorName: string
  creatorEmail: string
  brandContactName: string
  brandCompany: string
  invoiceNumber: string
  invoiceDate: string
  amountDue: number
  daysOverdue: number
  lateFee: number
  paymentDeadline: string
  currency: string
}
