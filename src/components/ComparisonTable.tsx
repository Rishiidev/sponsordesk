import { Check, X } from "lucide-react";

type Row = {
  feature: string;
  ours: boolean | string;
  july: boolean | string;
  notion: boolean | string;
  grin: boolean | string;
};

const ROWS: Row[] = [
  { feature: "Built for solo creators", ours: true, july: false, notion: false, grin: false },
  { feature: "Price under $30/mo", ours: true, july: false, notion: true, grin: false },
  { feature: "No team or agency required", ours: true, july: false, notion: true, grin: true },
  { feature: "Brand deal pipeline (kanban)", ours: true, july: true, notion: "DIY", grin: true },
  { feature: "Contract storage", ours: true, july: true, notion: "DIY", grin: true },
  { feature: "Deliverable reminders", ours: true, july: true, notion: false, grin: true },
  { feature: "Invoice generator", ours: true, july: true, notion: "DIY", grin: true },
  { feature: "AI follow-up drafts", ours: "Soon", july: true, notion: false, grin: false },
  { feature: "Built-in usage rights tracker", ours: true, july: false, notion: false, grin: true },
  { feature: "Takes a % of your deal", ours: false, july: false, notion: false, grin: false },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) {
    return <Check size={17} strokeWidth={2.5} style={{ color: "var(--cobalt-500)" }} />;
  }
  if (value === false) {
    return <X size={17} strokeWidth={2.5} style={{ color: "var(--text-muted)", opacity: 0.5 }} />;
  }
  return <span style={{ font: "var(--type-data)", color: "var(--text-secondary)" }}>{value}</span>;
}

export function ComparisonTable() {
  return (
    <div
      className="overflow-hidden"
      style={{ borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", background: "var(--surface-card)" }}
    >
      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <th className="px-5 py-4 text-left" style={{ font: "var(--type-eyebrow)", color: "var(--text-muted)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase" }}>
                Feature
              </th>
              <th className="px-5 py-4 text-left" style={{ font: "var(--weight-bold) var(--text-13)/1 var(--font-sans)", color: "var(--cobalt-600)" }}>
                SponsorDesk
              </th>
              <th className="px-5 py-4 text-left" style={{ font: "var(--weight-medium) var(--text-13)/1 var(--font-sans)", color: "var(--text-muted)" }}>
                July
              </th>
              <th className="px-5 py-4 text-left" style={{ font: "var(--weight-medium) var(--text-13)/1 var(--font-sans)", color: "var(--text-muted)" }}>
                Notion template
              </th>
              <th className="px-5 py-4 text-left" style={{ font: "var(--weight-medium) var(--text-13)/1 var(--font-sans)", color: "var(--text-muted)" }}>
                GRIN
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.feature} style={i < ROWS.length - 1 ? { borderBottom: "1px solid var(--border-subtle)" } : undefined}>
                <td className="px-5 py-3.5" style={{ font: "var(--type-body-sm)", color: "var(--text-secondary)" }}>
                  {r.feature}
                </td>
                <td className="px-5 py-3.5"><Cell value={r.ours} /></td>
                <td className="px-5 py-3.5"><Cell value={r.july} /></td>
                <td className="px-5 py-3.5"><Cell value={r.notion} /></td>
                <td className="px-5 py-3.5"><Cell value={r.grin} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile fallback */}
      <div className="md:hidden">
        {ROWS.map((r, i) => (
          <div
            key={r.feature}
            className="flex items-center justify-between px-5 py-3"
            style={i < ROWS.length - 1 ? { borderBottom: "1px solid var(--border-subtle)" } : undefined}
          >
            <span style={{ font: "var(--type-body-sm)", color: "var(--text-secondary)" }}>{r.feature}</span>
            <Cell value={r.ours} />
          </div>
        ))}
        <div className="px-5 py-3" style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--surface-sunken)", font: "var(--type-data)", color: "var(--text-muted)" }}>
          SponsorDesk column shown. July / Notion / GRIN comparison on desktop.
        </div>
      </div>
    </div>
  );
}
