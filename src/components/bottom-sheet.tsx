"use client";

import { useEffect, useRef, type ReactNode } from "react";

export type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

/**
 * iOS-style bottom sheet: slides up from the bottom on mobile; on desktop
 * it falls back to a centered modal-style card. Designed for short forms
 * and detail editors, not full-page navigation.
 */
export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    // Lock background scroll while open
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-end justify-center md:items-center"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
      />
      <div
        ref={sheetRef}
        className="relative z-10 w-full max-h-[92vh] overflow-y-auto rounded-t-[16px] md:max-h-[85vh] md:max-w-[560px] md:rounded-[16px] bg-[var(--color-paper)] shadow-[0_-8px_24px_rgba(0,0,0,0.12)] animate-[slideUp_220ms_ease-out]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Drag handle (visual only) */}
        <div className="sticky top-0 -mt-1 flex justify-center bg-[var(--color-paper)] pb-2 pt-2 md:hidden">
          <span className="h-1 w-10 rounded-full bg-[var(--color-line)]" />
        </div>
        {title && (
          <div className="sticky top-0 flex items-center justify-between border-b border-[var(--color-line)] bg-[var(--color-paper)] px-5 py-3 md:static md:border-b md:bg-transparent">
            <h2 className="text-[16px] font-semibold text-[var(--color-ink)]">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex h-11 w-11 min-h-[44px] items-center justify-center rounded-full text-[var(--color-ink-3)] hover:bg-[var(--color-paper-2)] touch-manipulation"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6L18 18M6 18L18 6" />
              </svg>
            </button>
          </div>
        )}
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}