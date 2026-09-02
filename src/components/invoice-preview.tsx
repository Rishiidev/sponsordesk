import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/currencies";
import type { Invoice, InvoiceTotals } from "@/lib/invoice-types";
import { computeLineTotal, formatDisplayDate } from "@/lib/invoice-utils";

interface InvoicePreviewProps {
  invoice: Invoice;
  totals: InvoiceTotals;
}

/**
 * Composed typography roles from the design tokens
 * (src/styles/tokens/typography.css). Using the `font` shorthand directly
 * keeps these pixel-for-pixel matched to the token system's intended
 * family/size/weight/line-height, the same way the token system's own
 * components apply them (see e.g. SponsorDesk's invoice page, which this
 * preview's field/value layout is modeled after).
 */
const eyebrowStyle = { font: "var(--type-eyebrow)" };
const dataStyle = { font: "var(--type-data)" };
const titleStyle = { font: "var(--type-h1)", letterSpacing: "var(--tracking-tighter)" };

export function InvoicePreview({ invoice, totals }: InvoicePreviewProps) {
  const { subtotal, taxRate, taxAmount, discount, total } = totals;
  const hasNotes = invoice.notes.trim().length > 0;

  return (
    <Card
      id="invoice-preview"
      className="print:m-0 print:w-full print:rounded-none print:border-0 print:shadow-none"
    >
      <CardContent className="p-6 sm:p-10 print:p-0">
        <div className="flex flex-col gap-8 text-foreground">
          {/* Title + invoice number / dates */}
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
            <div>
              <h1 style={titleStyle}>Invoice</h1>
              <p className="mt-1 text-muted-foreground" style={dataStyle}>
                {invoice.invoiceNumber || "—"}
              </p>
            </div>
            <div className="grid grid-cols-[auto_auto] gap-x-6 gap-y-1 sm:text-right">
              <span className="text-muted-foreground" style={eyebrowStyle}>
                Issue date
              </span>
              <span style={dataStyle}>{formatDisplayDate(invoice.issueDate)}</span>
              <span className="text-muted-foreground" style={eyebrowStyle}>
                Due date
              </span>
              <span style={dataStyle}>{formatDisplayDate(invoice.dueDate)}</span>
            </div>
          </div>

          <Separator />

          {/* From / Bill To, side by side */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground" style={eyebrowStyle}>
                From
              </p>
              <p className="mt-2 font-semibold break-words">
                {invoice.from.name || "Your business name"}
              </p>
              {invoice.from.address && (
                <p className="whitespace-pre-line text-sm text-muted-foreground break-words">
                  {invoice.from.address}
                </p>
              )}
              {invoice.from.email && (
                <p className="text-sm text-muted-foreground break-words">{invoice.from.email}</p>
              )}
            </div>
            <div>
              <p className="text-muted-foreground" style={eyebrowStyle}>
                Bill To
              </p>
              <p className="mt-2 font-semibold break-words">
                {invoice.billTo.name || "Client name"}
              </p>
              {invoice.billTo.address && (
                <p className="whitespace-pre-line text-sm text-muted-foreground break-words">
                  {invoice.billTo.address}
                </p>
              )}
              {invoice.billTo.email && (
                <p className="text-sm text-muted-foreground break-words">{invoice.billTo.email}</p>
              )}
            </div>
          </div>

          {/* Line items table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="py-2 pr-2 font-medium" style={eyebrowStyle}>
                    Description
                  </th>
                  <th className="py-2 px-2 text-right font-medium" style={eyebrowStyle}>
                    Qty
                  </th>
                  <th className="py-2 px-2 text-right font-medium" style={eyebrowStyle}>
                    Unit price
                  </th>
                  <th className="py-2 pl-2 text-right font-medium" style={eyebrowStyle}>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems.map((item) => (
                  <tr key={item.id} className="border-b border-border/60">
                    <td className="py-3 pr-2 align-top">{item.description || "—"}</td>
                    <td className="py-3 px-2 text-right align-top tabular-nums" style={dataStyle}>
                      {item.quantity}
                    </td>
                    <td className="py-3 px-2 text-right align-top tabular-nums" style={dataStyle}>
                      {formatCurrency(item.unitPrice, invoice.currency)}
                    </td>
                    <td
                      className="py-3 pl-2 text-right align-top tabular-nums text-foreground"
                      style={dataStyle}
                    >
                      {formatCurrency(computeLineTotal(item), invoice.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals block, right-aligned */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums" style={dataStyle}>
                  {formatCurrency(subtotal, invoice.currency)}
                </span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                  <span className="tabular-nums" style={dataStyle}>
                    {formatCurrency(taxAmount, invoice.currency)}
                  </span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="tabular-nums" style={dataStyle}>
                    -{formatCurrency(discount, invoice.currency)}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex items-baseline justify-between">
                <span className="font-semibold">Total due</span>
                <span className="font-mono text-lg font-bold tabular-nums">
                  {formatCurrency(total, invoice.currency)}
                </span>
              </div>
            </div>
          </div>

          {hasNotes && (
            <>
              <Separator />
              <div>
                <p className="text-muted-foreground" style={eyebrowStyle}>
                  Notes
                </p>
                <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                  {invoice.notes}
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
