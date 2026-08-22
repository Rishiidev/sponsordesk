// Stub for reminder detection logic
export type FollowUpReminder = {
  dealId: string;
  dealTitle: string;
  brandName: string;
  daysOverdue: number;
};

export type DueSoonDeliverable = {
  deliverableId: string;
  title: string;
  dealId: string;
  brandName: string;
  daysUntilDue: number;
};

export type StaleDeal = {
  dealId: string;
  dealTitle: string;
  brandName: string;
  daysSinceLastContact: number;
};

export type RemindersForUser = {
  overdueFollowUps: FollowUpReminder[];
  dueSoonDeliverables: DueSoonDeliverable[];
  staleDeals: StaleDeal[];
};

export async function getRemindersForUser(userId: string): Promise<RemindersForUser> {
  // In demo mode, return empty arrays; we'll implement real logic later
  return {
    overdueFollowUps: [],
    dueSoonDeliverables: [],
    staleDeals: [],
  };
}

// Helper functions (pure) for internal use
export function getOverdueFollowUps(deals: any[]): FollowUpReminder[] {
  return [];
}
export function getDueSoonDeliverables(deliverables: any[]): DueSoonDeliverable[] {
  return [];
}
export function getStaleDeals(deals: any[]): StaleDeal[] {
  return [];
}