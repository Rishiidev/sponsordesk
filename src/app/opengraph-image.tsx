import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SponsorDesk — track brand deals without losing your mind";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#faf9f7",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "#2b4bff",
            }}
          />
          <div style={{ fontSize: 30, fontWeight: 800, color: "#111113", letterSpacing: -0.5 }}>
            SponsorDesk
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 980 }}>
          <div style={{ fontSize: 60, fontWeight: 800, color: "#111113", lineHeight: 1.1, letterSpacing: -1.5 }}>
            Track brand deals without losing your mind.
          </div>
          <div style={{ fontSize: 26, color: "#4a4c56", lineHeight: 1.4 }}>
            The brand deal CRM built for solo creators — not agencies.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 20, color: "#9498a3" }}>
          sponsordesk.bruuhh.com
        </div>
      </div>
    ),
    { ...size },
  );
}
