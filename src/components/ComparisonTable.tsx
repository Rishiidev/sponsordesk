import { Check, X } from "@phosphor-icons/react/dist/ssr";

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
  { feature: "Invoice generator", ours: "Soon", july: true, notion: "DIY", grin: true },
  { feature: "AI follow-up drafts", ours: "Soon", july: true, notion: false, grin: false },
  { feature: "Built-in usage rights tracker", ours: true, july: false, notion: false, grin: true },
  { feature: "Takes a % of your deal", ours: false, july: false, notion: false, grin: false },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) {
    return <Check size={18} weight="bold" className="text-[var(--color-accent)]" />;
  }
  if (value === false) {
    return <X size={18} weight="bold" className="text-[var(--color-ink-3)] opacity-50" />;
  }
  return <span className="text-[13px] text-[var(--color-ink-2)]">{value}</span>;
}

export function ComparisonTable() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-soft)] border border-[var(--color-line)] bg-white">
      {/* Mobile: card list. Desktop: table */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-line)]">
              <th className="px-5 py-4 text-left text-[12px] font-medium uppercase tracking-wider text-[var(--color-ink-3)]">
                Feature
              </th>
              <th className="px-5 py-4 text-left text-[13px] font-semibold text-[var(--color-ink)]">
                SponsorDesk
              </th>
              <th className="px-5 py-4 text-left text-[13px] font-medium text-[var(--color-ink-3)]">
                July
              </th>
              <th className="px-5 py-4 text-left text-[13px] font-medium text-[var(--color-ink-3)]">
                Notion template
              </th>
              <th className="px-5 py-4 text-left text-[13px] font-medium text-[var(--color-ink-3)]">
                GRIN
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr
                key={r.feature}
                className={i < ROWS.length - 1 ? "border-b border-[var(--color-line)]/60" : ""}
              >
                <td className="px-5 py-3.5 text-[14px] text-[var(--color-ink-2)]">
                  {r.feature}
                </td>
                <td className="px-5 py-3.5">
                  <Cell value={r.ours} />
                </td>
                <td className="px-5 py-3.5">
                  <Cell value={r.july} />
                </td>
                <td className="px-5 py-3.5">
                  <Cell value={r.notion} />
                </td>
                <td className="px-5 py-3.5">
                  <Cell value={r.grin} />
                </td>
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
            className={
              "flex items-center justify-between px-5 py-3 " +
              (i < ROWS.length - 1 ? "border-b border-[var(--color-line)]/60" : "")
            }
          >
            <span className="text-[14px] text-[var(--color-ink-2)]">{r.feature}</span>
            <Cell value={r.ours} />
          </div>
        ))}
        <div className="border-t border-[var(--color-line)] bg-[var(--color-paper-2)] px-5 py-3 text-[12px] text-[var(--color-ink-3)]">
          SponsorDesk column shown. July / Notion / GRIN comparison on desktop.
        </div>
      </div>
    </div>
  );
}