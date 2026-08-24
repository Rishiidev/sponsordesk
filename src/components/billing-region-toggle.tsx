// Lightweight client component for picking region. The page re-renders on
// selection so we just push a query string and let the server re-resolve.
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function RegionToggle({
  current,
}: {
  current: "IN" | "ROW";
}) {
  const router = useRouter();
  const search = useSearchParams();
  const [pending, startTransition] = useTransition();

  function pick(region: "IN" | "ROW") {
    if (region === current) return;
    const params = new URLSearchParams(search.toString());
    params.set("region", region);
    startTransition(() => {
      router.push(`/settings/billing?${params.toString()}`);
    });
  }

  return (
    <div
      role="radiogroup"
      aria-label="Billing region"
      className="inline-flex overflow-hidden rounded-[8px] border border-[var(--color-line)] bg-[var(--color-paper-2)] p-1"
    >
      <button
        type="button"
        role="radio"
        aria-checked={current === "IN"}
        disabled={pending}
        onClick={() => pick("IN")}
        className={
          "h-8 px-3 text-[12px] font-medium transition-colors " +
          (current === "IN"
            ? "bg-white text-[var(--color-ink)] shadow-sm"
            : "text-[var(--color-ink-3)] hover:text-[var(--color-ink)]")
        }
      >
        India · INR
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={current === "ROW"}
        disabled={pending}
        onClick={() => pick("ROW")}
        className={
          "h-8 px-3 text-[12px] font-medium transition-colors " +
          (current === "ROW"
            ? "bg-white text-[var(--color-ink)] shadow-sm"
            : "text-[var(--color-ink-3)] hover:text-[var(--color-ink)]")
        }
      >
        Rest of world · USD
      </button>
    </div>
  );
}
