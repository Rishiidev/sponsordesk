"use client";

import { useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

type Props = {
  children: ReactNode;
  onRefresh?: () => Promise<void> | void;
  /** Pixel threshold to trigger refresh (default 80) */
  threshold?: number;
};

export function PullToRefresh({ children, onRefresh, threshold = 80 }: Props) {
  const router = useRouter();
  const startY = useRef<number | null>(null);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      if (onRefresh) await onRefresh();
      else router.refresh();
    } finally {
      // Hold the spinner long enough that the user sees something happened
      setTimeout(() => {
        setRefreshing(false);
        setPull(0);
      }, 500);
    }
  }

  return (
    <div
      onTouchStart={(e) => {
        if (refreshing) return;
        if (typeof window !== "undefined" && window.scrollY > 0) return;
        startY.current = e.touches[0].clientY;
      }}
      onTouchMove={(e) => {
        if (startY.current === null) return;
        if (typeof window !== "undefined" && window.scrollY > 0) {
          startY.current = null;
          setPull(0);
          return;
        }
        const distance = e.touches[0].clientY - startY.current;
        if (distance > 0) {
          // Damped: 50% feel
          setPull(Math.min(distance * 0.5, threshold + 30));
        }
      }}
      onTouchEnd={() => {
        if (startY.current === null) return;
        if (pull > threshold && !refreshing) {
          handleRefresh();
        } else {
          setPull(0);
        }
        startY.current = null;
      }}
    >
      {(pull > 8 || refreshing) && (
        <div
          className="flex items-center justify-center gap-2 overflow-hidden transition-[height] duration-150"
          style={{ height: refreshing ? 56 : Math.max(28, pull) }}
          aria-live="polite"
        >
          <div
            className="h-5 w-5 rounded-full border-2 border-[var(--color-line)] border-t-[var(--color-accent)]"
            style={{
              animation: refreshing ? "spin 0.8s linear infinite" : "none",
              transform: refreshing ? undefined : `rotate(${pull * 4}deg)`,
            }}
            aria-hidden
          />
          <span className="text-[12px] text-[var(--color-ink-3)]">
            {refreshing
              ? "Refreshing…"
              : pull > threshold
              ? "Release to refresh"
              : "Pull to refresh"}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}