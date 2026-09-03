/**
 * Core domain types for the media kit generator. Everything about the kit
 * lives in a single `MediaKit` object so it can be trivially serialized
 * to/from localStorage, same as the invoice generator's `Invoice`.
 */

export interface PlatformStat {
  id: string;
  platform: string;
  handle: string;
  followers: number;
  /** Percentage, kept as the raw string the user typed so it can be blank. */
  engagementRate: string;
}

export interface PastCollab {
  id: string;
  brand: string;
  description: string;
}

export interface MediaKit {
  creatorName: string;
  tagline: string;
  niche: string;
  location: string;
  email: string;
  bio: string;
  platforms: PlatformStat[];
  pastCollabs: PastCollab[];
  rateNote: string;
}
