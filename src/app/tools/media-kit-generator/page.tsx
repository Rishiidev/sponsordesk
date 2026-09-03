"use client";

import { useEffect, useReducer, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { MediaKitForm } from "@/components/media-kit-form";
import { MediaKitPreview } from "@/components/media-kit-preview";
import { MobileTabSwitcher, type MobileTab } from "@/components/mobile-tab-switcher";
import { SponsorDeskBrand } from "@/components/sponsordesk-brand";
import { ToolsHeader } from "@/components/tools-header";
import { useIsDesktopLayout } from "@/hooks/use-is-desktop-layout";
import { mediaKitReducer } from "@/lib/media-kit-reducer";
import { loadMediaKitFromStorage, saveMediaKitToStorage } from "@/lib/media-kit-storage";
import { createDefaultMediaKit } from "@/lib/media-kit-utils";

export default function MediaKitGeneratorPage() {
  const [kit, dispatch] = useReducer(mediaKitReducer, undefined, createDefaultMediaKit);
  const [mobileTab, setMobileTab] = useState<MobileTab>("edit");
  const isDesktop = useIsDesktopLayout();

  // Restore any in-progress kit from localStorage on first mount (this runs
  // after the initial blank render so server and client markup match).
  useEffect(() => {
    const stored = loadMediaKitFromStorage();
    if (stored) {
      dispatch({ type: "LOAD_KIT", kit: stored });
    }
  }, []);

  // Autosave on every change, skipping the very first run. Without that
  // guard this effect would fire on mount with the blank default kit and
  // briefly clobber a just-restored one before the hydration effect above
  // has a chance to commit.
  const isFirstAutosaveRunRef = useRef(true);
  useEffect(() => {
    if (isFirstAutosaveRunRef.current) {
      isFirstAutosaveRunRef.current = false;
      return;
    }
    saveMediaKitToStorage(kit);
  }, [kit]);

  const handlePrint = () => window.print();

  if (isDesktop) {
    return (
      <div className="min-h-screen bg-background print:bg-white">
        <ToolsHeader />
        <header className="border-b border-border bg-card shadow-[var(--shadow-xs)] print:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6 lg:px-8">
            <div>
              <p className="text-lg font-semibold tracking-tight">Media Kit Generator</p>
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
              <MediaKitForm kit={kit} dispatch={dispatch} />
            </section>
            <section>
              <MediaKitPreview kit={kit} />
            </section>
          </div>
        </main>

        <SponsorDeskBrand variant="footer" toolSlug="media-kit-generator" />
      </div>
    );
  }

  // Mobile: a native-app-style shell — fixed top bar with an Edit/Preview
  // tab switcher, one scrollable pane in the middle (the two panes live
  // side by side and slide via transform, rather than being stacked and
  // reflowed), and a fixed bottom bar for the primary action.
  return (
    <div className="flex h-dvh flex-col bg-background print:block print:h-auto">
      <ToolsHeader />
      <div className="shrink-0 border-b border-border bg-card px-4 pt-3 pb-2 shadow-[var(--shadow-xs)] print:hidden">
        <p className="mb-2 text-base font-semibold tracking-tight">Media Kit Generator</p>
        <MobileTabSwitcher active={mobileTab} onChange={setMobileTab} />
        <SponsorDeskBrand variant="inline" toolSlug="media-kit-generator" />
      </div>

      <div className="min-h-0 flex-1 overflow-hidden print:contents">
        <div
          className="flex h-full w-[200%] transition-transform duration-300 ease-out print:contents"
          style={{ transform: mobileTab === "edit" ? "translateX(0%)" : "translateX(-50%)" }}
        >
          <div className="h-full w-1/2 shrink-0 overflow-y-auto px-4 py-4 print:hidden">
            <MediaKitForm kit={kit} dispatch={dispatch} />
          </div>
          <div className="h-full w-1/2 shrink-0 overflow-y-auto px-4 py-4 print:contents">
            <MediaKitPreview kit={kit} />
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
