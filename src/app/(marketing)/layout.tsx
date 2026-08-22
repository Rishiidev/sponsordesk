import type { ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Marketing-specific layout (e.g., navbar, footer) can go here */}
      <nav className="flex h-16 items-center justify-between px-6 bg-[var(--color-paper)] border-b border-[var(--color-line)]">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] bg-[var(--color-ink)] text-[13px] font-semibold text-[var(--color-accent)]">
            S
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-[var(--color-ink)]">SponsorDesk</span>
        </div>
        <div className="hidden md:flex items-center gap-5 text-[14px] text-[var(--color-ink-2)] hover:text-[var(--color-ink)]">
          <a href="/">How it works</a>
          <a href="/">Features</a>
          <a href="/">Pricing</a>
        </div>
      </nav>
      {children}
      {/* Simple footer */}
      <footer className="mt-20 pt-10 border-t border-[var(--color-line)]">
        <div className="max-w-[1120px] mx-auto px-5 pb-10 md:px-8">
          <p className="text-[13px] text-[var(--color-ink-3)]">
            © {new Date().getFullYear()} SponsorDesk. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}