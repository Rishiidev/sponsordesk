"use client"

import type { Dispatch } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CURRENCIES } from "@/lib/currencies"
import type { DemandLetterAction } from "@/lib/demand-letter-reducer"
import type { DemandLetter } from "@/lib/demand-letter-types"
import { parseNumberInput } from "@/lib/demand-letter-utils"

interface DemandLetterFormProps {
  letter: DemandLetter
  dispatch: Dispatch<DemandLetterAction>
}

export function DemandLetterForm({ letter, dispatch }: DemandLetterFormProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>From you</CardTitle>
          <CardDescription>Who this letter is from.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="creator-name">Your name / business</Label>
            <Input
              id="creator-name"
              value={letter.creatorName}
              placeholder="Alex Rivera"
              onChange={(event) => dispatch({ type: "SET_FIELD", field: "creatorName", value: event.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="creator-email">Your email</Label>
            <Input
              id="creator-email"
              type="email"
              value={letter.creatorEmail}
              placeholder="alex@example.com"
              onChange={(event) => dispatch({ type: "SET_FIELD", field: "creatorEmail", value: event.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>To the brand</CardTitle>
          <CardDescription>Who owes the payment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="brand-contact">Contact name</Label>
            <Input
              id="brand-contact"
              value={letter.brandContactName}
              placeholder="Jamie Chen"
              onChange={(event) => dispatch({ type: "SET_FIELD", field: "brandContactName", value: event.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="brand-company">Company</Label>
            <Input
              id="brand-company"
              value={letter.brandCompany}
              placeholder="Acme Co."
              onChange={(event) => dispatch({ type: "SET_FIELD", field: "brandCompany", value: event.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>The overdue invoice</CardTitle>
          <CardDescription>What's owed, and how overdue it is.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="invoice-number">Invoice number</Label>
              <Input
                id="invoice-number"
                className="font-mono"
                value={letter.invoiceNumber}
                placeholder="INV-0001"
                onChange={(event) => dispatch({ type: "SET_FIELD", field: "invoiceNumber", value: event.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invoice-date">Invoice date</Label>
              <Input
                id="invoice-date"
                type="date"
                className="font-mono"
                value={letter.invoiceDate}
                onChange={(event) => dispatch({ type: "SET_FIELD", field: "invoiceDate", value: event.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="amount-due">Amount due</Label>
              <Input
                id="amount-due"
                type="number"
                inputMode="decimal"
                className="font-mono"
                min={0}
                step="any"
                value={letter.amountDue}
                onChange={(event) =>
                  dispatch({ type: "SET_NUMBER_FIELD", field: "amountDue", value: parseNumberInput(event.target.value) })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={letter.currency}
                onValueChange={(value) => {
                  if (typeof value === "string") {
                    dispatch({ type: "SET_FIELD", field: "currency", value })
                  }
                }}
              >
                <SelectTrigger id="currency" className="w-full">
                  <SelectValue placeholder="Select a currency">
                    {(value: string) => CURRENCIES.find((c) => c.code === value)?.label ?? "Select a currency"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="days-overdue">Days overdue</Label>
              <Input
                id="days-overdue"
                type="number"
                inputMode="numeric"
                className="font-mono"
                min={0}
                step="1"
                value={letter.daysOverdue}
                onChange={(event) =>
                  dispatch({ type: "SET_NUMBER_FIELD", field: "daysOverdue", value: parseNumberInput(event.target.value) })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="late-fee">Late fee (optional)</Label>
              <Input
                id="late-fee"
                type="number"
                inputMode="decimal"
                className="font-mono"
                min={0}
                step="any"
                value={letter.lateFee}
                placeholder="0.00"
                onChange={(event) =>
                  dispatch({ type: "SET_NUMBER_FIELD", field: "lateFee", value: parseNumberInput(event.target.value) })
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="payment-deadline">Payment deadline in this letter</Label>
            <Input
              id="payment-deadline"
              type="date"
              className="font-mono"
              value={letter.paymentDeadline}
              onChange={(event) => dispatch({ type: "SET_FIELD", field: "paymentDeadline", value: event.target.value })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
