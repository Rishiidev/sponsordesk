import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { MediaKit } from "@/lib/media-kit-types";
import { averageEngagement, formatFollowers, totalReach } from "@/lib/media-kit-utils";

interface MediaKitPreviewProps {
  kit: MediaKit;
}

/**
 * Composed typography roles from the design tokens, matching the invoice
 * preview's use of the same token system (src/styles/tokens/typography.css).
 */
const eyebrowStyle = { font: "var(--type-eyebrow)" };
const dataStyle = { font: "var(--type-data)" };
const titleStyle = { font: "var(--type-h1)", letterSpacing: "var(--tracking-tighter)" };

export function MediaKitPreview({ kit }: MediaKitPreviewProps) {
  const reach = totalReach(kit.platforms);
  const avgEngagement = averageEngagement(kit.platforms);
  const hasCollabs = kit.pastCollabs.some((c) => c.brand.trim().length > 0);

  return (
    <Card
      id="media-kit-preview"
      className="print:m-0 print:w-full print:rounded-none print:border-0 print:shadow-none"
    >
      <CardContent className="p-6 sm:p-10 print:p-0">
        <div className="flex flex-col gap-8 text-foreground">
          {/* Name + tagline + contact */}
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
            <div>
              <h1 style={titleStyle}>{kit.creatorName || "Your name"}</h1>
              {kit.tagline && <p className="mt-1 text-muted-foreground">{kit.tagline}</p>}
            </div>
            <div className="grid grid-cols-[auto_auto] gap-x-6 gap-y-1 sm:text-right">
              {kit.niche && (
                <>
                  <span className="text-muted-foreground" style={eyebrowStyle}>
                    Niche
                  </span>
                  <span style={dataStyle}>{kit.niche}</span>
                </>
              )}
              {kit.location && (
                <>
                  <span className="text-muted-foreground" style={eyebrowStyle}>
                    Location
                  </span>
                  <span style={dataStyle}>{kit.location}</span>
                </>
              )}
              {kit.email && (
                <>
                  <span className="text-muted-foreground" style={eyebrowStyle}>
                    Contact
                  </span>
                  <span style={dataStyle}>{kit.email}</span>
                </>
              )}
            </div>
          </div>

          <Separator />

          {kit.bio && <p className="whitespace-pre-line text-sm text-muted-foreground">{kit.bio}</p>}

          {/* Reach summary */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-[var(--radius-sm)] border border-border p-4">
              <p className="text-muted-foreground" style={eyebrowStyle}>
                Total reach
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{formatFollowers(reach)}</p>
            </div>
            <div className="rounded-[var(--radius-sm)] border border-border p-4">
              <p className="text-muted-foreground" style={eyebrowStyle}>
                Platforms
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{kit.platforms.length}</p>
            </div>
            <div className="rounded-[var(--radius-sm)] border border-border p-4">
              <p className="text-muted-foreground" style={eyebrowStyle}>
                Avg. engagement
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">
                {avgEngagement === null ? "—" : `${avgEngagement.toFixed(1)}%`}
              </p>
            </div>
          </div>

          {/* Platform breakdown table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="py-2 pr-2 font-medium" style={eyebrowStyle}>
                    Platform
                  </th>
                  <th className="py-2 px-2 font-medium" style={eyebrowStyle}>
                    Handle
                  </th>
                  <th className="py-2 px-2 text-right font-medium" style={eyebrowStyle}>
                    Followers
                  </th>
                  <th className="py-2 pl-2 text-right font-medium" style={eyebrowStyle}>
                    Engagement
                  </th>
                </tr>
              </thead>
              <tbody>
                {kit.platforms.map((p) => (
                  <tr key={p.id} className="border-b border-border/60">
                    <td className="py-3 pr-2 align-top font-medium">{p.platform || "—"}</td>
                    <td className="py-3 px-2 align-top text-muted-foreground">{p.handle || "—"}</td>
                    <td className="py-3 px-2 text-right align-top tabular-nums" style={dataStyle}>
                      {formatFollowers(p.followers)}
                    </td>
                    <td className="py-3 pl-2 text-right align-top tabular-nums" style={dataStyle}>
                      {p.engagementRate ? `${p.engagementRate}%` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {hasCollabs && (
            <>
              <Separator />
              <div>
                <p className="text-muted-foreground" style={eyebrowStyle}>
                  Past brand collabs
                </p>
                <ul className="mt-2 space-y-1.5">
                  {kit.pastCollabs
                    .filter((c) => c.brand.trim().length > 0)
                    .map((c) => (
                      <li key={c.id} className="text-sm">
                        <span className="font-medium">{c.brand}</span>
                        {c.description && <span className="text-muted-foreground"> — {c.description}</span>}
                      </li>
                    ))}
                </ul>
              </div>
            </>
          )}

          {kit.rateNote ? (
            <>
              <Separator />
              <div>
                <p className="text-muted-foreground" style={eyebrowStyle}>
                  Rates
                </p>
                <p className="mt-2 whitespace-pre-line text-sm">{kit.rateNote}</p>
              </div>
            </>
          ) : (
            <>
              <Separator />
              <p className="text-sm text-muted-foreground">Rates available on request.</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
