import type { DemandLetter } from "./demand-letter-types"

type StringField =
  | "creatorName"
  | "creatorEmail"
  | "brandContactName"
  | "brandCompany"
  | "invoiceNumber"
  | "invoiceDate"
  | "paymentDeadline"
  | "currency"
type NumberField = "amountDue" | "daysOverdue" | "lateFee"

export type DemandLetterAction =
  | { type: "LOAD_LETTER"; letter: DemandLetter }
  | { type: "SET_FIELD"; field: StringField; value: string }
  | { type: "SET_NUMBER_FIELD"; field: NumberField; value: number }

export function demandLetterReducer(state: DemandLetter, action: DemandLetterAction): DemandLetter {
  switch (action.type) {
    case "LOAD_LETTER":
      return action.letter

    case "SET_FIELD":
      return { ...state, [action.field]: action.value }

    case "SET_NUMBER_FIELD":
      return { ...state, [action.field]: action.value }

    default:
      return state
  }
}
