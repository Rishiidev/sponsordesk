"use client";

import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CURRENCIES } from "@/lib/currencies";
import { convertFromUSD, formatCurrencyAmount } from "@/lib/geo-currency";
import {
  PLATFORMS,
  NICHES,
  estimateRate,
  type Platform,
  type Niche,
} from "@/lib/rate-calculator";

export function RateCalculatorForm({ defaultCurrency }: { defaultCurrency: string }) {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [audienceSize, setAudienceSize] = useState("");
  const [engagementRate, setEngagementRate] = useState("");
  const [deliverableId, setDeliverableId] = useState(PLATFORMS.instagram.deliverables[0].id);
  const [niche, setNiche] = useState<Niche>("general");
  const [currency, setCurrency] = useState(defaultCurrency);

  const config = PLATFORMS[platform];

  const estimate = useMemo(
    () =>
      estimateRate({
        platform,
        audienceSize: Number(audienceSize),
        engagementRate: engagementRate ? Number(engagementRate) : null,
        deliverableId,
        niche,
      }),
    [platform, audienceSize, engagementRate, deliverableId, niche]
  );

  function handlePlatformChange(value: string) {
    const next = value as Platform;
    setPlatform(next);
    setDeliverableId(PLATFORMS[next].deliverables[0].id);
    setEngagementRate("");
    // Audience size means something different per platform (followers vs.
    // downloads vs. subscribers) — carrying the old number over would look
    // like a real estimate for a metric the visitor never actually entered.
    setAudienceSize("");
  }

  function handleEngagementBlur() {
    const n = Number(engagementRate);
    if (Number.isFinite(n) && n < 0) setEngagementRate("0");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(320px,1fr)_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Your details</CardTitle>
          <CardDescription>Rough estimate for one sponsored deliverable.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="platform">Platform</Label>
              <Select value={platform} onValueChange={(value) => typeof value === "string" && handlePlatformChange(value)}>
                <SelectTrigger id="platform" className="w-full">
                  <SelectValue>{(value: Platform) => PLATFORMS[value]?.label}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(PLATFORMS) as [Platform, typeof PLATFORMS[Platform]][]).map(([id, p]) => (
                    <SelectItem key={id} value={id}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={(value) => typeof value === "string" && setCurrency(value)}>
                <SelectTrigger id="currency" className="w-full">
                  <SelectValue>{(value: string) => CURRENCIES.find((c) => c.code === value)?.code}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="audience">{config.audienceLabel}</Label>
              <Input
                id="audience"
                type="number"
                inputMode="numeric"
                min={0}
                placeholder={config.audiencePlaceholder}
                value={audienceSize}
                onChange={(e) => setAudienceSize(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="engagement">
                {config.typicalEngagementRate !== null ? "Engagement rate %" : "N/A"}
              </Label>
              <Input
                id="engagement"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.1"
                placeholder={config.typicalEngagementRate !== null ? String(config.typicalEngagementRate) : ""}
                value={engagementRate}
                onChange={(e) => setEngagementRate(e.target.value)}
                onBlur={handleEngagementBlur}
                disabled={config.typicalEngagementRate === null}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="deliverable">Deliverable</Label>
            <Select value={deliverableId} onValueChange={(value) => typeof value === "string" && setDeliverableId(value)}>
              <SelectTrigger id="deliverable" className="w-full">
                <SelectValue>{(value: string) => config.deliverables.find((d) => d.id === value)?.label}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {config.deliverables.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="niche">Niche</Label>
            <Select value={niche} onValueChange={(value) => typeof value === "string" && setNiche(value as Niche)}>
              <SelectTrigger id="niche" className="w-full">
                <SelectValue>{(value: Niche) => NICHES[value]?.label}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(NICHES) as [Niche, typeof NICHES[Niche]][]).map(([id, n]) => (
                  <SelectItem key={id} value={id}>
                    {n.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Suggested rate</CardTitle>
          <CardDescription>Rough industry-CPM estimate — a starting point for negotiation, not a quote.</CardDescription>
        </CardHeader>
        <CardContent>
          {estimate ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold tracking-tight text-foreground">
                  {formatCurrencyAmount(convertFromUSD(estimate.mid, currency), currency)}
                </span>
                <span className="text-sm text-muted-foreground">typical</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Range: {formatCurrencyAmount(convertFromUSD(estimate.low, currency), currency)} –{" "}
                {formatCurrencyAmount(convertFromUSD(estimate.high, currency), currency)}
              </p>
              {currency !== "USD" && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Converted from a USD estimate at an approximate rate — local sponsorship rates vary by market,
                  not just currency.
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Enter your {config.audienceLabel.toLowerCase()} to see an estimate.</p>
          )}
          <p className="mt-5 text-xs text-muted-foreground">
            Based on typical platform CPM ranges, adjusted for niche and engagement. Actual rates vary with
            audience quality, exclusivity, and usage rights — use this as a starting point, not a ceiling.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
