import type { MediaKit, PastCollab, PlatformStat } from "./media-kit-types";
import { createDefaultMediaKit, createEmptyCollab, createEmptyPlatform, generateId } from "./media-kit-utils";

const STORAGE_KEY = "media-kit-generator:kit:v1";

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function sanitizePlatform(value: unknown): PlatformStat | null {
  if (!isRecord(value)) return null;
  const fallback = createEmptyPlatform();
  return {
    id: isString(value.id) && value.id.length > 0 ? value.id : generateId(),
    platform: isString(value.platform) ? value.platform : fallback.platform,
    handle: isString(value.handle) ? value.handle : "",
    followers: isFiniteNumber(value.followers) ? value.followers : 0,
    engagementRate: isString(value.engagementRate) ? value.engagementRate : "",
  };
}

function sanitizeCollab(value: unknown): PastCollab | null {
  if (!isRecord(value)) return null;
  return {
    id: isString(value.id) && value.id.length > 0 ? value.id : generateId(),
    brand: isString(value.brand) ? value.brand : "",
    description: isString(value.description) ? value.description : "",
  };
}

/**
 * Defensively rebuilds a valid `MediaKit` from unknown (e.g. localStorage)
 * data. Missing or malformed fields fall back to sensible defaults rather
 * than throwing, so a corrupted or outdated stored payload can never crash
 * the page.
 */
export function sanitizeMediaKit(value: unknown): MediaKit {
  const fallback = createDefaultMediaKit();
  if (!isRecord(value)) return fallback;

  const rawPlatforms = Array.isArray(value.platforms) ? value.platforms : [];
  const platforms = rawPlatforms.map(sanitizePlatform).filter((p): p is PlatformStat => p !== null);

  const rawCollabs = Array.isArray(value.pastCollabs) ? value.pastCollabs : [];
  const pastCollabs = rawCollabs.map(sanitizeCollab).filter((c): c is PastCollab => c !== null);

  return {
    creatorName: isString(value.creatorName) ? value.creatorName : fallback.creatorName,
    tagline: isString(value.tagline) ? value.tagline : fallback.tagline,
    niche: isString(value.niche) ? value.niche : fallback.niche,
    location: isString(value.location) ? value.location : fallback.location,
    email: isString(value.email) ? value.email : fallback.email,
    bio: isString(value.bio) ? value.bio : fallback.bio,
    platforms: platforms.length > 0 ? platforms : [createEmptyPlatform()],
    pastCollabs,
    rateNote: isString(value.rateNote) ? value.rateNote : fallback.rateNote,
  };
}

/**
 * Reads and validates the persisted kit. Returns `null` if nothing is
 * stored, storage is unavailable, or the payload can't be parsed — callers
 * should fall back to `createDefaultMediaKit()` in that case. Never throws.
 */
export function loadMediaKitFromStorage(): MediaKit | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return sanitizeMediaKit(parsed);
  } catch {
    return null;
  }
}

/** Persists the kit. Silently no-ops on any storage failure (quota, private mode, etc). */
export function saveMediaKitToStorage(kit: MediaKit): void {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(kit));
  } catch {
    // Storage can throw in private browsing, when disabled, or over quota.
    // Autosave is a nice-to-have, so we swallow the error and move on.
  }
}
