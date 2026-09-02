"use client";

export type MobileTab = "edit" | "preview";

interface MobileTabSwitcherProps {
  active: MobileTab;
  onChange: (tab: MobileTab) => void;
}

const TABS: { id: MobileTab; label: string }[] = [
  { id: "edit", label: "Edit" },
  { id: "preview", label: "Preview" },
];

/**
 * Segmented Edit/Preview control for the mobile layout. Each segment is a
 * full 44px-tall tap target (Apple/Android's minimum recommended touch
 * size), with a quick scale-down on press since touch devices have no
 * hover state to lean on for feedback.
 */
export function MobileTabSwitcher({ active, onChange }: MobileTabSwitcherProps) {
  return (
    <div
      role="tablist"
      aria-label="Form and preview"
      className="grid grid-cols-2 gap-1 rounded-[var(--radius-sm)] bg-muted p-1"
    >
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex h-11 touch-manipulation items-center justify-center rounded-[calc(var(--radius-sm)-2px)] text-sm font-semibold transition-all active:scale-[0.97] ${
              isActive
                ? "bg-card text-foreground shadow-[var(--shadow-xs)]"
                : "text-muted-foreground"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
