/**
 * Web Vibration API wrapper. Best-effort: silently no-ops on iOS Safari
 * (which doesn't expose navigator.vibrate) and on user-disabled devices.
 */
function vibrate(pattern: number | number[]) {
  try {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(pattern);
    }
  } catch {
    // Ignore — some browsers throw on user-gesture requirements.
  }
}

/** Light tap. Good for button presses and link taps. */
export function tap() {
  vibrate(10);
}

/** Stronger tap for swipes / drags (e.g., kanban drop). */
export function swipe() {
  vibrate(20);
}

/** Success pattern: two short pulses. For completed actions. */
export function success() {
  vibrate([10, 50, 10]);
}

/** Warning pattern. For destructive confirmations. */
export function warn() {
  vibrate([15, 30, 15]);
}