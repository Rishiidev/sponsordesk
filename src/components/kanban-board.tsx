"use client";

import { useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  closestCenter,
  PointerSensor,
  type DragEndEvent,
} from "@dnd-kit/core";

interface KanbanBoardProps {
  deals: Array<{
    id: string;
    title: string;
    brandId: string;
    brandName: string;
    amountCents?: number;
    currency?: string;
    stage: "inbound" | "negotiating" | "live" | "paid" | "lost";
    nextFollowupAt?: string;
  }>;
  onMoveDeal: (dealId: string, newStage: "inbound" | "negotiating" | "live" | "paid" | "lost") => Promise<void>;
}

const stages = ["inbound", "negotiating", "live", "paid", "lost"] as const;

const stageLabels: Record<string, string> = {
  inbound: "Inbound",
  negotiating: "Negotiating",
  live: "Live",
  paid: "Paid",
  lost: "Lost",
};

export default function KanbanBoard({ deals, onMoveDeal }: KanbanBoardProps) {
  const [dealMap, setDealMap] = useState<Record<string, typeof deals[0]>>({});

  // Initialize deal map
  useState(() => {
    const map: Record<string, typeof deals[0]> = {};
    deals.forEach((deal) => {
      map[deal.id] = deal;
    });
    return map;
  });

  // Update deal map when deals prop changes
  // useEffect(() => {
  //   const map: Record<string, typeof deals[0]> = {};
  //   deals.forEach((deal) => {
  //     map[deal.id] = deal;
  //   });
  //   setDealMap(map);
  // }, [deals]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeDealId = active.id as string;
    const activeDeal = dealMap[activeDealId];
    if (!activeDeal) return;

    // Determine new stage based on which column we dropped into
    const newStage = over?.id as "inbound" | "negotiating" | "live" | "paid" | "lost";
    if (!stages.includes(newStage)) return;

    try {
      await onMoveDeal(activeDealId, newStage);
      // Update local state optimistically
      setDealMap((prev) => ({
        ...prev,
        [activeDealId]: { ...prev[activeDealId], stage: newStage },
      }));
    } catch (error) {
      console.error("Failed to move deal:", error);
      // Revert optimistic update would happen here in a real app
    }
  };

  const columns = stages.map((stage) => ({
    id: stage,
    label: stageLabels[stage],
    deals: Object.values(dealMap).filter((deal) => deal.stage === stage),
  }));

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <div className="overflow-x-auto">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {columns.map((column) => (
            <div
              key={column.id}
              className={`border rounded-lg p-4 min-h-[300px] bg-[var(--color-paper)] border-[var(--color-line)]`}
            >
              <h2 className="mb-4 font-semibold text-[var(--color-ink)] flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[var(--color-accent)]"></span>
                {column.label}
              </h2>
              {column.deals.length === 0 ? (
                <p className="text-[var(--color-ink-3)] text-center py-8">
                  No deals in this stage
                </p>
              ) : (
                <div className="space-y-3">
                  {column.deals.map((deal) => (
                    <div
                      key={deal.id}
                      className={`border rounded-lg p-3 bg-white border-[var(--color-line)] hover:bg-[var(--color-paper-2)] transition-all cursor-grab`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 h-6 w-6 items-center justify-center rounded-[var(--radius-tight)] bg-[var(--color-accent)] text-[var(--color-paper)] text-[10px]">
                          ${deal.amountCents ? (deal.amountCents / 100).toFixed(0) : "--"}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-[var(--color-ink)] line-clamp-1">
                            {deal.title}
                          </h3>
                          <p className="text-[var(--color-ink-2)] text-[12px]">
                            {deal.brandName}
                          </p>
                          {deal.nextFollowupAt ? (
                            <div className="mt-1 flex items-center gap-2 text-[11px]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                fill="none"
                                stroke="currentColor"
                                className="flex-shrink-0"
                              >
                                <circle cx="6" cy="6" r="5.5" strokeWidth="1" />
                                <path
                                  d="M6 8v2"
                                  strokeWidth="1.5"
                                />
                                <path
                                  d="M6 4v2"
                                  strokeWidth="1.5"
                                />
                              </svg>
                              <span className="ml-1">
                                {new Date(deal.nextFollowupAt).toLocaleDateString(
                                  undefined,
                                  { month: "short", day: "numeric" }
                                )}
                              </span>
                              {new Date(deal.nextFollowupAt) < new Date() ? (
                                <span className="ml-1 text-[var(--color-accent)] font-medium">OVERDUE</span>
                              ) : null}
                            </div>
                          ) : (
                            <p className="text-[var(--color-ink-2)] text-[12px]">
                              No follow-up scheduled
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DndContext>
  );
}