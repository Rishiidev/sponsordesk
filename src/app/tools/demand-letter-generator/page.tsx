"use client"

import { useEffect, useReducer, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { DemandLetterForm } from "@/components/demand-letter-form"
import { DemandLetterPreview } from "@/components/demand-letter-preview"
import { MobileTabSwitcher, type MobileTab } from "@/components/mobile-tab-switcher"
import { SponsorDeskBrand } from "@/components/sponsordesk-brand"
import { ToolsHeader } from "@/components/tools-header"
import { useIsDesktopLayout } from "@/hooks/use-is-desktop-layout"
import { demandLetterReducer } from "@/lib/demand-letter-reducer"
import { loadLetterFromStorage, saveLetterToStorage } from "@/lib/demand-letter-storage"
import { createDefaultLetter, getDefaultDates, getTodayLocal } from "@/lib/demand-letter-utils"

function DisclaimerNote() {
  return (
    <p className="text-xs text-muted-foreground print:hidden">
      Starting-point template, not legal advice. For large amounts, talk to a lawyer.
    </p>
  )
}

export default function DemandLetterGeneratorPage() {
  const [letter, dispatch] = useReducer(demandLetterReducer, undefined, createDefaultLetter)
  const [mobileTab, setMobileTab] = useState<MobileTab>("edit")
  const [letterDate, setLetterDate] = useState("")
  const isDesktop = useIsDesktopLayout()

  // Restore any in-progress letter from localStorage on first mount (runs
  // after the initial blank render so server and client markup match). If
  // there's nothing saved, this is a brand-new letter, so fill in today's
  // date and a payment deadline 7 days out — computed here, client-side
  // only, for the same reason as the invoice generator's own hydration
  // effect (this page is statically prerendered).
  //
  // letterDate (the date shown at the top of the letter itself) is always
  // set fresh to today, never restored from storage — reopening a saved
  // draft tomorrow should show tomorrow's date, not the day it was started.
  useEffect(() => {
    setLetterDate(getTodayLocal())
    const stored = loadLetterFromStorage()
    if (stored) {
      dispatch({ type: "LOAD_LETTER", letter: stored })
    } else {
      const { invoiceDate, paymentDeadline } = getDefaultDates()
      dispatch({ type: "SET_FIELD", field: "invoiceDate", value: invoiceDate })
      dispatch({ type: "SET_FIELD", field: "paymentDeadline", value: paymentDeadline })
    }
  }, [])

  // Autosave on every change, skipping the very first run — same guard as
  // the invoice generator, to avoid clobbering a just-restored letter.
  const isFirstAutosaveRunRef = useRef(true)
  useEffect(() => {
    if (isFirstAutosaveRunRef.current) {
      isFirstAutosaveRunRef.current = false
      return
    }
    saveLetterToStorage(letter)
  }, [letter])

  const handlePrint = () => window.print()

  if (isDesktop) {
    return (
      <div className="min-h-screen bg-background print:bg-white">
        <ToolsHeader />
        <header className="border-b border-border bg-card shadow-[var(--shadow-xs)] print:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6 lg:px-8">
            <div>
              <p className="text-lg font-semibold tracking-tight">Demand Letter Generator</p>
              <p className="text-sm text-muted-foreground">
                Fill in the details on the left — the preview updates as you type.
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <Button size="lg" onClick={handlePrint}>
                Download PDF
              </Button>
              <DisclaimerNote />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8 print:max-w-none print:p-0">
          <div className="grid gap-8 lg:grid-cols-[minmax(320px,2fr)_3fr] print:block">
            <section className="print:hidden">
              <DemandLetterForm letter={letter} dispatch={dispatch} />
            </section>
            <section>
              <DemandLetterPreview letter={letter} letterDate={letterDate} />
            </section>
          </div>
        </main>

        <SponsorDeskBrand variant="footer" toolSlug="demand-letter-generator" />
      </div>
    )
  }

  // Mobile: same native-app-style shell as the other tools — fixed top bar
  // with an Edit/Preview tab switcher, one scrollable pane that slides via
  // transform, fixed bottom bar for the primary action.
  return (
    <div className="flex h-dvh flex-col bg-background print:block print:h-auto">
      <ToolsHeader />
      <div className="shrink-0 border-b border-border bg-card px-4 pt-3 pb-2 shadow-[var(--shadow-xs)] print:hidden">
        <p className="mb-2 text-base font-semibold tracking-tight">Demand Letter Generator</p>
        <MobileTabSwitcher active={mobileTab} onChange={setMobileTab} />
        <SponsorDeskBrand variant="inline" toolSlug="demand-letter-generator" />
      </div>

      <div className="min-h-0 flex-1 overflow-hidden print:contents">
        <div
          className="flex h-full w-[200%] transition-transform duration-300 ease-out print:contents"
          style={{ transform: mobileTab === "edit" ? "translateX(0%)" : "translateX(-50%)" }}
        >
          <div className="h-full w-1/2 shrink-0 overflow-y-auto px-4 py-4 print:hidden">
            <DemandLetterForm letter={letter} dispatch={dispatch} />
          </div>
          <div className="h-full w-1/2 shrink-0 overflow-y-auto px-4 py-4 print:contents">
            <DemandLetterPreview letter={letter} letterDate={letterDate} />
          </div>
        </div>
      </div>

      <div
        className="shrink-0 border-t border-border bg-card px-4 pt-3 shadow-[0_-1px_2px_rgba(17,17,19,.04)] print:hidden"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <Button size="lg" className="h-12 w-full text-base" onClick={handlePrint}>
          Download PDF
        </Button>
        <div className="mt-1.5 text-center">
          <DisclaimerNote />
        </div>
      </div>
    </div>
  )
}
