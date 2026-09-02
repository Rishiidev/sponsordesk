"use client";

import { useSyncExternalStore } from "react";

/** Must match the `lg` breakpoint used for the side-by-side desktop grid in page.tsx. */
const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribe(onChange: () => void): () => void {
  if (typeof window === "undefined" || !("matchMedia" in window)) return () => {};
  const mediaQueryList = window.matchMedia(DESKTOP_QUERY);
  mediaQueryList.addEventListener("change", onChange);
  return () => mediaQueryList.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

/** Always `false` server-side, so the server-rendered markup matches the client's first render. */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Whether the desktop (side-by-side) layout should render, as opposed to the
 * mobile tabbed Edit/Preview layout. These two layouts are structurally
 * different DOM trees (not just CSS reflow of the same one), so this is a
 * real conditional render rather than a Tailwind `lg:` class toggle.
 *
 * Built on `useSyncExternalStore` — the standard way to subscribe a
 * component to a `matchMedia` query — rather than `useState` + `useEffect`,
 * so React (not a manual effect) owns tearing/consistency, and the server
 * snapshot (`false`) always matches the client's first render, avoiding any
 * hydration mismatch. A desktop visitor may see the mobile shell for a
 * single frame before this resolves to `true`; that's the standard,
 * accepted trade-off for a client-only layout branch.
 */
export function useIsDesktopLayout(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
