"use client";

import type { Dispatch } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CURRENCIES, formatCurrency } from "@/lib/currencies";
import type { InvoiceAction } from "@/lib/invoice-reducer";
import type { Invoice, PartyDetails } from "@/lib/invoice-types";
import { computeLineTotal, parseNumberInput } from "@/lib/invoice-utils";

interface InvoiceFormProps {
  invoice: Invoice;
  dispatch: Dispatch<InvoiceAction>;
}

interface PartyFieldsProps {
  title: string;
  description: string;
  party: "from" | "billTo";
  values: PartyDetails;
  dispatch: Dispatch<InvoiceAction>;
  namePlaceholder: string;
  emailPlaceholder: string;
  addressPlaceholder: string;
}

function PartyFields({
  title,
  description,
  party,
  values,
  dispatch,
  namePlaceholder,
  emailPlaceholder,
  addressPlaceholder,
}: PartyFieldsProps) {
  const idPrefix = party;

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-name`}>Name</Label>
        <Input
          id={`${idPrefix}-name`}
          value={values.name}
          placeholder={namePlaceholder}
          onChange={(event) =>
            dispatch({ type: "SET_PARTY_FIELD", party, field: "name", value: event.target.value })
          }
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-email`}>Email</Label>
        <Input
          id={`${idPrefix}-email`}
          type="email"
          value={values.email}
          placeholder={emailPlaceholder}
          onChange={(event) =>
            dispatch({ type: "SET_PARTY_FIELD", party, field: "email", value: event.target.value })
          }
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-address`}>Address</Label>
        <Textarea
          id={`${idPrefix}-address`}
          value={values.address}
          placeholder={addressPlaceholder}
          rows={3}
          onChange={(event) =>
            dispatch({ type: "SET_PARTY_FIELD", party, field: "address", value: event.target.value })
          }
        />
      </div>
    </div>
  );
}

export function InvoiceForm({ invoice, dispatch }: InvoiceFormProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoice details</CardTitle>
          <CardDescription>Number, dates, and currency for this invoice.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="invoice-number">Invoice number</Label>
              <Input
                id="invoice-number"
                className="font-mono"
                value={invoice.invoiceNumber}
                placeholder="INV-0001"
                onChange={(event) =>
                  dispatch({ type: "SET_FIELD", field: "invoiceNumber", value: event.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="issue-date">Issue date</Label>
              <Input
                id="issue-date"
                type="date"
                className="font-mono"
                value={invoice.issueDate}
                onChange={(event) =>
                  dispatch({ type: "SET_FIELD", field: "issueDate", value: event.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="due-date">Due date</Label>
              <Input
                id="due-date"
                type="date"
                className="font-mono"
                value={invoice.dueDate}
                onChange={(event) =>
                  dispatch({ type: "SET_FIELD", field: "dueDate", value: event.target.value })
                }
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={invoice.currency}
                onValueChange={(value) => {
                  if (typeof value === "string") {
                    dispatch({ type: "SET_FIELD", field: "currency", value });
                  }
                }}
              >
                <SelectTrigger id="currency" className="w-full">
                  {/* Base UI's SelectValue shows the raw value, not the matching item's
                      label, unless given a render function — without this it would show
                      "USD" instead of "USD — US Dollar". */}
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>From &amp; Bill To</CardTitle>
          <CardDescription>Your business details and who you&apos;re billing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <PartyFields
            title="From"
            description="Your business or freelance details."
            party="from"
            values={invoice.from}
            dispatch={dispatch}
            namePlaceholder="Your business name"
            emailPlaceholder="you@yourbusiness.com"
            addressPlaceholder={"123 Main St\nCity, State ZIP"}
          />
          <PartyFields
            title="Bill To"
            description="Who this invoice is for."
            party="billTo"
            values={invoice.billTo}
            dispatch={dispatch}
            namePlaceholder="Client name"
            emailPlaceholder="client@company.com"
            addressPlaceholder={"456 Client Ave\nCity, State ZIP"}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Line items</CardTitle>
          <CardDescription>Add each thing you&apos;re billing for.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {invoice.lineItems.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-1 gap-3 rounded-[var(--radius-sm)] border border-border p-3 sm:grid-cols-12 sm:items-end sm:gap-2"
            >
              <div className="space-y-1.5 sm:col-span-5">
                <Label htmlFor={`item-description-${item.id}`} className="sm:sr-only">
                  Description
                </Label>
                <Input
                  id={`item-description-${item.id}`}
                  value={item.description}
                  placeholder={`Line item ${index + 1} description`}
                  onChange={(event) =>
                    dispatch({
                      type: "SET_LINE_ITEM_DESCRIPTION",
                      id: item.id,
                      value: event.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor={`item-qty-${item.id}`} className="sm:sr-only">
                  Qty
                </Label>
                <Input
                  id={`item-qty-${item.id}`}
                  type="number"
                  inputMode="decimal"
                  className="font-mono"
                  min={0}
                  step="any"
                  value={item.quantity}
                  onChange={(event) =>
                    dispatch({
                      type: "SET_LINE_ITEM_NUMBER",
                      id: item.id,
                      field: "quantity",
                      value: parseNumberInput(event.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor={`item-price-${item.id}`} className="sm:sr-only">
                  Unit price
                </Label>
                <Input
                  id={`item-price-${item.id}`}
                  type="number"
                  inputMode="decimal"
                  className="font-mono"
                  min={0}
                  step="any"
                  value={item.unitPrice}
                  onChange={(event) =>
                    dispatch({
                      type: "SET_LINE_ITEM_NUMBER",
                      id: item.id,
                      field: "unitPrice",
                      value: parseNumberInput(event.target.value),
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between gap-2 sm:col-span-2 sm:justify-end">
                <span className="text-sm font-medium sm:hidden">Line total</span>
                <span className="font-mono text-sm font-medium tabular-nums">
                  {formatCurrency(computeLineTotal(item), invoice.currency)}
                </span>
              </div>
              <div className="flex justify-end sm:col-span-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-lg"
                  aria-label="Remove line item"
                  onClick={() => dispatch({ type: "REMOVE_LINE_ITEM", id: item.id })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => dispatch({ type: "ADD_LINE_ITEM" })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add line item
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax, discount &amp; notes</CardTitle>
          <CardDescription>Optional adjustments and payment terms.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="tax-rate">Tax rate (%)</Label>
              <Input
                id="tax-rate"
                type="number"
                inputMode="decimal"
                className="font-mono"
                min={0}
                step="any"
                value={invoice.taxRate}
                placeholder="0"
                onChange={(event) =>
                  dispatch({ type: "SET_FIELD", field: "taxRate", value: event.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="discount">Discount (flat)</Label>
              <Input
                id="discount"
                type="number"
                inputMode="decimal"
                className="font-mono"
                min={0}
                step="any"
                value={invoice.discount}
                placeholder="0.00"
                onChange={(event) =>
                  dispatch({ type: "SET_FIELD", field: "discount", value: event.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes / payment terms</Label>
            <Textarea
              id="notes"
              value={invoice.notes}
              placeholder="Thank you for your business! Payment due within 14 days via bank transfer or card."
              rows={4}
              onChange={(event) =>
                dispatch({ type: "SET_FIELD", field: "notes", value: event.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
