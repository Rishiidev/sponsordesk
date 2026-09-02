import type { Invoice, PartyDetails } from "./invoice-types";
import { createEmptyLineItem } from "./invoice-utils";

type PartyKey = "from" | "billTo";
type TopLevelStringField =
  | "invoiceNumber"
  | "issueDate"
  | "dueDate"
  | "currency"
  | "taxRate"
  | "discount"
  | "notes";
type LineItemNumberField = "quantity" | "unitPrice";

export type InvoiceAction =
  | { type: "LOAD_INVOICE"; invoice: Invoice }
  | { type: "SET_DATES"; issueDate: string; dueDate: string }
  | { type: "SET_FIELD"; field: TopLevelStringField; value: string }
  | { type: "SET_PARTY_FIELD"; party: PartyKey; field: keyof PartyDetails; value: string }
  | { type: "ADD_LINE_ITEM" }
  | { type: "REMOVE_LINE_ITEM"; id: string }
  | { type: "SET_LINE_ITEM_DESCRIPTION"; id: string; value: string }
  | { type: "SET_LINE_ITEM_NUMBER"; id: string; field: LineItemNumberField; value: number };

export function invoiceReducer(state: Invoice, action: InvoiceAction): Invoice {
  switch (action.type) {
    case "LOAD_INVOICE":
      return action.invoice;

    case "SET_DATES":
      return { ...state, issueDate: action.issueDate, dueDate: action.dueDate };

    case "SET_FIELD":
      return { ...state, [action.field]: action.value };

    case "SET_PARTY_FIELD":
      return {
        ...state,
        [action.party]: { ...state[action.party], [action.field]: action.value },
      };

    case "ADD_LINE_ITEM":
      return { ...state, lineItems: [...state.lineItems, createEmptyLineItem()] };

    case "REMOVE_LINE_ITEM": {
      const remaining = state.lineItems.filter((item) => item.id !== action.id);
      // Always keep at least one row so the table never disappears entirely.
      return { ...state, lineItems: remaining.length > 0 ? remaining : [createEmptyLineItem()] };
    }

    case "SET_LINE_ITEM_DESCRIPTION":
      return {
        ...state,
        lineItems: state.lineItems.map((item) =>
          item.id === action.id ? { ...item, description: action.value } : item
        ),
      };

    case "SET_LINE_ITEM_NUMBER":
      return {
        ...state,
        lineItems: state.lineItems.map((item) =>
          item.id === action.id ? { ...item, [action.field]: action.value } : item
        ),
      };

    default:
      return state;
  }
}
