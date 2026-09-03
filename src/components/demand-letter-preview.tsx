import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/currencies"
import type { DemandLetter } from "@/lib/demand-letter-types"
import { computeTotalDue, formatDisplayDate } from "@/lib/demand-letter-utils"

interface DemandLetterPreviewProps {
  letter: DemandLetter
  letterDate: string
}

const bodyStyle = { font: "var(--type-body)" }

export function DemandLetterPreview({ letter, letterDate }: DemandLetterPreviewProps) {
  const total = computeTotalDue(letter)
  const hasFee = letter.lateFee > 0
  const greeting = letter.brandContactName ? `Dear ${letter.brandContactName},` : "To whom it may concern,"

  return (
    <Card
      id="demand-letter-preview"
      className="print:m-0 print:w-full print:rounded-none print:border-0 print:shadow-none"
    >
      <CardContent className="p-6 sm:p-10 print:p-0">
        <div className="flex flex-col gap-6 text-foreground" style={bodyStyle}>
          <div>
            <p className="font-semibold">{letter.creatorName || "Your name"}</p>
            {letter.creatorEmail && <p className="text-sm text-muted-foreground">{letter.creatorEmail}</p>}
          </div>

          <p className="text-sm text-muted-foreground">{formatDisplayDate(letterDate)}</p>

          <div>
            <p className="text-sm text-muted-foreground">To:</p>
            <p className="font-medium">{letter.brandContactName || "Accounts Payable"}</p>
            {letter.brandCompany && <p className="text-sm text-muted-foreground">{letter.brandCompany}</p>}
          </div>

          <Separator />

          <p className="font-semibold uppercase tracking-wide text-sm">
            Re: Formal Notice — Overdue Invoice {letter.invoiceNumber || "—"}
          </p>

          <p>{greeting}</p>

          <p>
            This letter serves as formal notice that Invoice <strong>{letter.invoiceNumber || "—"}</strong>, issued on{" "}
            {formatDisplayDate(letter.invoiceDate)} for {formatCurrency(letter.amountDue, letter.currency)}, remains
            unpaid and is now <strong>{letter.daysOverdue} days overdue</strong>.
          </p>

          {hasFee && (
            <p>
              This total now includes a late fee of {formatCurrency(letter.lateFee, letter.currency)}, bringing the
              total amount due to <strong>{formatCurrency(total, letter.currency)}</strong>.
            </p>
          )}

          <p>
            Immediate payment of the full amount is required. Please remit payment no later than{" "}
            <strong>{formatDisplayDate(letter.paymentDeadline)}</strong>. If payment has already been sent, please
            disregard this notice and contact me directly so we can reconcile our records.
          </p>

          <p>Failure to remit payment by the above date may result in further collection action.</p>

          <div className="mt-4">
            <p>Sincerely,</p>
            <p className="mt-6 font-semibold">{letter.creatorName || "Your name"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
