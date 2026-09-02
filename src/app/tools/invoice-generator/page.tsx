"use client";

import { useEffect, useReducer, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { InvoiceForm } from "@/components/invoice-form";
import { InvoicePreview } from "@/components/invoice-preview";
import { MobileTabSwitcher, type MobileTab } from "@/components/mobile-tab-switcher";
import { SponsorDeskBrand } from "@/components/sponsordesk-brand";
import { useIsDesktopLayout } from "@/hooks/use-is-desktop-layout";
import { invoiceReducer } from "@/lib/invoice-reducer";
import { loadInvoiceFromStorage, saveInvoiceToStorage } from "@/lib/invoice-storage";
import { computeTotals, createDefaultInvoice, getDefaultDates } from "@/lib/invoice-utils";

export default function InvoiceGeneratorPage() {
  const [invoice, dispatch] = useReducer(invoiceReducer, undefined, createDefaultInvoice);
  const [mobileTab, setMobileTab] = useState<MobileTab>("edit");
  const isDesktop = useIsDesktopLayout();

  // Restore any in-progress invoice from localStorage on first mount (this
  // runs after the initial blank render so server and client markup match).
  // If there's nothing saved, this is a brand-new invoice, so fill in
  // today's date and a due date 14 days out — computed here, client-side
  // only, rather than in the default-state factory, since this page is
  // statically prerendered and `new Date()` there would bake in the build
  // date on the server while the client shows the real "today".
  useEffect(() => {
    const stored = loadInvoiceFromStorage();
    if (stored) {
      dispatch({ type: "LOAD_INVOICE", invoice: stored });
    } else {
      const { issueDate, dueDate } = getDefaultDates();
      dispatch({ type: "SET_DATES", issueDate, dueDate });
    }
  }, []);

  // Autosave on every change, skipping the very first run. Without that
  // guard this effect would fire on mount with the blank default invoice
  // and briefly clobber a just-restored one before the hydration effect's
  // dispatch above has a chance to commit.
  const isFirstAutosaveRunRef = useRef(true);
  useEffect(() => {
    if (isFirstAutosaveRunRef.current) {
      isFirstAutosaveRunRef.current = false;
      return;
    }
    saveInvoiceToStorage(invoice);
  }, [invoice]);

  const totals = computeTotals(invoice);
  const handlePrint = () => window.print();

  if (isDesktop) {
    return (
      <div className="min-h-screen bg-background print:bg-white">
        <header className="border-b border-border bg-card shadow-[var(--shadow-xs)] print:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6 lg:px-8">
            <div>
              <p className="text-lg font-semibold tracking-tight">Invoice Generator</p>
              <p className="text-sm text-muted-foreground">
                Fill in the details on the left — the preview updates as you type.
              </p>
            </div>
            <Button size="lg" onClick={handlePrint}>
              Download PDF
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8 print:max-w-none print:p-0">
          <div className="grid gap-8 lg:grid-cols-[minmax(320px,2fr)_3fr] print:block">
            <section className="print:hidden">
              <InvoiceForm invoice={invoice} dispatch={dispatch} />
            </section>
            <section>
              <InvoicePreview invoice={invoice} totals={totals} />
            </section>
          </div>
        </main>

        <SponsorDeskBrand variant="footer" />
      </div>
    );
  }

  // Mobile: a native-app-style shell — fixed top bar with an Edit/Preview
  // tab switcher, one scrollable pane in the middle (the two panes live
  // side by side and slide via transform, rather than being stacked and
  // reflowed), and a fixed bottom bar for the primary action.
  return (
    <div className="flex h-dvh flex-col bg-background print:block print:h-auto">
      <div className="shrink-0 border-b border-border bg-card px-4 pt-3 pb-2 shadow-[var(--shadow-xs)] print:hidden">
        <p className="mb-2 text-base font-semibold tracking-tight">Invoice Generator</p>
        <MobileTabSwitcher active={mobileTab} onChange={setMobileTab} />
        <SponsorDeskBrand variant="inline" />
      </div>

      <div className="min-h-0 flex-1 overflow-hidden print:contents">
        <div
          className="flex h-full w-[200%] transition-transform duration-300 ease-out print:contents"
          style={{ transform: mobileTab === "edit" ? "translateX(0%)" : "translateX(-50%)" }}
        >
          <div className="h-full w-1/2 shrink-0 overflow-y-auto px-4 py-4 print:hidden">
            <InvoiceForm invoice={invoice} dispatch={dispatch} />
          </div>
          <div className="h-full w-1/2 shrink-0 overflow-y-auto px-4 py-4 print:contents">
            <InvoicePreview invoice={invoice} totals={totals} />
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
      </div>
    </div>
  );
}
