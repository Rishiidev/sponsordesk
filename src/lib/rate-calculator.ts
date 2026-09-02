export type Platform = "instagram" | "tiktok" | "youtube" | "newsletter" | "podcast";
export type Niche =
  | "general"
  | "beauty-fashion"
  | "tech-saas"
  | "finance"
  | "gaming"
  | "food"
  | "fitness-health"
  | "parenting-family";

export type Deliverable = {
  id: string;
  label: string;
  /** Multiplier against the platform's base per-1k rate. */
  multiplier: number;
};

export type PlatformConfig = {
  label: string;
  /** What the audience-size input represents for this platform. */
  audienceLabel: string;
  audiencePlaceholder: string;
  /** Base rate in USD per 1,000 of the audience metric, for the platform's baseline deliverable. */
  baseRatePer1k: number;
  /** Typical engagement rate (%) for this platform, used to scale the estimate up/down from the user's own rate. Podcasts skip this — downloads already reflect real reach, not a rate to compare against a baseline. */
  typicalEngagementRate: number | null;
  deliverables: Deliverable[];
};

export const PLATFORMS: Record<Platform, PlatformConfig> = {
  instagram: {
    label: "Instagram",
    audienceLabel: "Followers",
    audiencePlaceholder: "25000",
    baseRatePer1k: 10,
    typicalEngagementRate: 1.5,
    deliverables: [
      { id: "story", label: "Single story", multiplier: 0.4 },
      { id: "post", label: "Feed post", multiplier: 1 },
      { id: "reel", label: "Reel", multiplier: 1.3 },
      { id: "bundle", label: "3-post bundle", multiplier: 2.5 },
    ],
  },
  tiktok: {
    label: "TikTok",
    audienceLabel: "Followers",
    audiencePlaceholder: "50000",
    baseRatePer1k: 8,
    typicalEngagementRate: 5,
    deliverables: [
      { id: "video", label: "Single video", multiplier: 1 },
      { id: "series", label: "3-video series", multiplier: 2.5 },
    ],
  },
  youtube: {
    label: "YouTube",
    audienceLabel: "Subscribers",
    audiencePlaceholder: "40000",
    baseRatePer1k: 20,
    typicalEngagementRate: 4,
    deliverables: [
      { id: "integration", label: "60-90s integration", multiplier: 1 },
      { id: "dedicated", label: "Dedicated video", multiplier: 2.5 },
    ],
  },
  newsletter: {
    label: "Newsletter",
    audienceLabel: "Subscribers",
    audiencePlaceholder: "15000",
    baseRatePer1k: 30,
    typicalEngagementRate: 35,
    deliverables: [
      { id: "mention", label: "Single mention", multiplier: 0.6 },
      { id: "section", label: "Dedicated section", multiplier: 1 },
      { id: "solo", label: "Full solo send", multiplier: 1.8 },
    ],
  },
  podcast: {
    label: "Podcast",
    audienceLabel: "Avg. downloads per episode",
    audiencePlaceholder: "8000",
    baseRatePer1k: 18,
    typicalEngagementRate: null,
    deliverables: [
      { id: "preroll", label: "Pre-roll ad", multiplier: 0.8 },
      { id: "midroll", label: "Mid-roll ad", multiplier: 1 },
      { id: "dedicated", label: "Dedicated episode", multiplier: 2 },
    ],
  },
};

export const NICHES: Record<Niche, { label: string; multiplier: number }> = {
  general: { label: "General / Lifestyle", multiplier: 1 },
  "beauty-fashion": { label: "Beauty & Fashion", multiplier: 1.15 },
  "tech-saas": { label: "Tech & SaaS", multiplier: 1.3 },
  finance: { label: "Finance & Investing", multiplier: 1.4 },
  gaming: { label: "Gaming", multiplier: 1.1 },
  food: { label: "Food & Cooking", multiplier: 1.05 },
  "fitness-health": { label: "Fitness & Health", multiplier: 1.15 },
  "parenting-family": { label: "Parenting & Family", multiplier: 1.1 },
};

export type RateEstimate = {
  low: number;
  mid: number;
  high: number;
};

/**
 * Rough CPM-style estimate, not a quote. Engagement is compared against a
 * fixed per-platform baseline and clamped to +/-2x so a wildly off input
 * (e.g. a typo) can't blow the range out to something absurd. Podcasts skip
 * the engagement step entirely since downloads are already a real reach
 * number, not a rate that needs adjusting against a "typical" benchmark.
 */
export function estimateRate({
  platform,
  audienceSize,
  engagementRate,
  deliverableId,
  niche,
}: {
  platform: Platform;
  audienceSize: number;
  engagementRate: number | null;
  deliverableId: string;
  niche: Niche;
}): RateEstimate | null {
  if (!Number.isFinite(audienceSize) || audienceSize <= 0) return null;

  const config = PLATFORMS[platform];
  const deliverable = config.deliverables.find((d) => d.id === deliverableId) ?? config.deliverables[0];
  const nicheMultiplier = NICHES[niche].multiplier;

  let engagementMultiplier = 1;
  if (config.typicalEngagementRate !== null && engagementRate !== null && engagementRate > 0) {
    engagementMultiplier = clamp(engagementRate / config.typicalEngagementRate, 0.5, 2);
  }

  const base = config.baseRatePer1k * (audienceSize / 1000) * deliverable.multiplier * nicheMultiplier * engagementMultiplier;

  return {
    low: Math.round(base * 0.8),
    mid: Math.round(base),
    high: Math.round(base * 1.3),
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
