import type { MediaKit, PastCollab, PlatformStat } from "./media-kit-types";

/** Generates a reasonably-unique id for a platform/collab row's React key / removal target. */
export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `row-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Fixed, deterministic ids for the rows the form starts with, so the default
 * kit renders identically on the server and on the client during hydration
 * (crypto.randomUUID() would produce a different value on each side).
 * Rows added later via "Add platform" / "Add collab" use generateId()
 * instead, since those only ever happen client-side in response to a click.
 */
const INITIAL_PLATFORM_ID = "platform-initial";

export function createEmptyPlatform(id: string = generateId()): PlatformStat {
  return { id, platform: "Instagram", handle: "", followers: 0, engagementRate: "" };
}

export function createEmptyCollab(id: string = generateId()): PastCollab {
  return { id, brand: "", description: "" };
}

export function createDefaultMediaKit(): MediaKit {
  return {
    creatorName: "",
    tagline: "",
    niche: "",
    location: "",
    email: "",
    bio: "",
    platforms: [createEmptyPlatform(INITIAL_PLATFORM_ID)],
    pastCollabs: [],
    rateNote: "",
  };
}

/** Formats a raw follower count as a compact display string, e.g. 42300 -> "42.3K". */
export function formatFollowers(count: number): string {
  if (!Number.isFinite(count) || count <= 0) return "0";
  if (count >= 1_000_000) return `${trimTrailingZero(count / 1_000_000)}M`;
  if (count >= 1_000) return `${trimTrailingZero(count / 1_000)}K`;
  return String(count);
}

function trimTrailingZero(value: number): string {
  return value.toFixed(1).replace(/\.0$/, "");
}

/** Parses a user-typed numeric field, treating blank/invalid input as zero. */
export function parseNumberInput(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function totalReach(platforms: PlatformStat[]): number {
  return platforms.reduce((sum, p) => sum + (Number.isFinite(p.followers) ? p.followers : 0), 0);
}

/** Average engagement rate across platforms that have one set, ignoring blanks. */
export function averageEngagement(platforms: PlatformStat[]): number | null {
  const rates = platforms
    .map((p) => Number.parseFloat(p.engagementRate))
    .filter((n) => Number.isFinite(n));
  if (rates.length === 0) return null;
  return rates.reduce((sum, n) => sum + n, 0) / rates.length;
}
