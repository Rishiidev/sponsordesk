// Reminder detection logic. Pure functions + a small async aggregator.
import {
  getDeals,
  getDeliverables,
  getInteractions,
  getBrands,
} from "@/lib/db/local";
import type { Deal, Deliverable, Contact, Interaction, Brand } from "@/lib/db/local";

export type FollowUpReminder = {
  dealId: string;
  dealTitle: string;
  brandName: string;
  nextFollowupAt: string;
  daysOverdue: number;
};

export type DueSoonDeliverable = {
  deliverableId: string;
  title: string;
  dealId: string;
  dealTitle: string;
  brandName: string;
  dueDate: string;
  daysUntilDue: number;
};

export type StaleDeal = {
  dealId: string;
  dealTitle: string;
  brandName: string;
  stage: Deal["stage"];
  lastContactAt?: string;
  daysSinceLastContact: number;
};

export type RemindersForUser = {
  overdueFollowUps: FollowUpReminder[];
  dueSoonDeliverables: DueSoonDeliverable[];
  staleDeals: StaleDeal[];
  totalCount: number;
};

const STAGE_DONE: Deal["stage"][] = ["paid", "lost"];
const STALE_DAYS_THRESHOLD = 14;
const STALE_STAGES: Deal["stage"][] = ["negotiating"];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function daysBetween(a: Date, b: Date) {
  const ms = startOfDay(b).getTime() - startOfDay(a).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

// Pure: deals with a nextFollowupAt in the past that aren't already done.
export function getOverdueFollowUps(deals: Deal[], brandNameById: Map<string, string>): FollowUpReminder[] {
  const now = new Date();
  return deals
    .filter((d) => !STAGE_DONE.includes(d.stage))
    .filter((d) => !!d.nextFollowupAt)
    .map((d) => {
      const due = new Date(d.nextFollowupAt as string);
      return { deal: d, due, daysOverdue: daysBetween(due, now) };
    })
    .filter((r) => r.daysOverdue > 0)
    .sort((a, b) => b.daysOverdue - a.daysOverdue)
    .map(({ deal, due, daysOverdue }) => ({
      dealId: deal.id,
      dealTitle: deal.title,
      brandName: brandNameById.get(deal.brandId) ?? "(unknown brand)",
      nextFollowupAt: due.toISOString(),
      daysOverdue,
    }));
}

// Pure: deliverables due within the next N days, sorted soonest first.
export function getDueSoonDeliverables(
  deliverables: Deliverable[],
  dealById: Map<string, Deal>,
  brandNameById: Map<string, string>,
  withinDays = 3,
): DueSoonDeliverable[] {
  const now = new Date();
  return deliverables
    .filter((d) => !d.completed)
    .filter((d) => !!d.dueDate)
    .map((d) => {
      const due = new Date(d.dueDate as string);
      return { d, due, daysUntilDue: daysBetween(now, due) };
    })
    .filter((r) => r.daysUntilDue >= 0 && r.daysUntilDue <= withinDays)
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue)
    .map(({ d, due, daysUntilDue }) => {
      const deal = dealById.get(d.dealId);
      return {
        deliverableId: d.id,
        title: d.title,
        dealId: d.dealId,
        dealTitle: deal?.title ?? "(unknown deal)",
        brandName: deal ? brandNameById.get(deal.brandId) ?? "(unknown brand)" : "(unknown brand)",
        dueDate: due.toISOString(),
        daysUntilDue,
      };
    });
}

// Pure: deals in active stages with no contact in the last N days.
export function getStaleDeals(
  deals: Deal[],
  interactions: Interaction[],
  brandNameById: Map<string, string>,
  thresholdDays = STALE_DAYS_THRESHOLD,
): StaleDeal[] {
  const now = new Date();
  return deals
    .filter((d) => STALE_STAGES.includes(d.stage))
    .map((d) => {
      const dealInteractions = interactions
        .filter((i) => i.dealId === d.id)
        .map((i) => new Date(i.occurredAt).getTime());
      const tsCandidates: number[] = [];
      if (d.lastContactAt) tsCandidates.push(new Date(d.lastContactAt).getTime());
      if (d.updatedAt) tsCandidates.push(new Date(d.updatedAt).getTime());
      tsCandidates.push(...dealInteractions);
      const lastTs = tsCandidates.length ? Math.max(...tsCandidates) : undefined;
      const last = lastTs ? new Date(lastTs) : undefined;
      const days = last ? daysBetween(last, now) : Infinity;
      return { deal: d, last, daysSinceLastContact: days };
    })
    .filter((r) => r.daysSinceLastContact >= thresholdDays)
    .sort((a, b) => b.daysSinceLastContact - a.daysSinceLastContact)
    .map(({ deal, last, daysSinceLastContact }) => ({
      dealId: deal.id,
      dealTitle: deal.title,
      brandName: brandNameById.get(deal.brandId) ?? "(unknown brand)",
      stage: deal.stage,
      lastContactAt: last?.toISOString(),
      daysSinceLastContact: daysSinceLastContact === Infinity ? thresholdDays + 1 : daysSinceLastContact,
    }));
}

// Pure: stitch the three pure functions together.
export function buildReminders(
  deals: Deal[],
  deliverables: Deliverable[],
  interactions: Interaction[],
  brandNameById: Map<string, string>,
): RemindersForUser {
  const dealById = new Map(deals.map((d) => [d.id, d]));
  const overdue = getOverdueFollowUps(deals, brandNameById);
  const dueSoon = getDueSoonDeliverables(deliverables, dealById, brandNameById, 3);
  const stale = getStaleDeals(deals, interactions, brandNameById);
  return {
    overdueFollowUps: overdue,
    dueSoonDeliverables: dueSoon,
    staleDeals: stale,
    totalCount: overdue.length + dueSoon.length + stale.length,
  };
}

// Async: load a user's data from the local db and build reminders.
export async function getRemindersForUser(userId: string): Promise<RemindersForUser> {
  const [deals, deliverables, interactions, brands] = await Promise.all([
    getDeals(userId),
    getDeliverables(userId),
    getInteractions(userId),
    getBrands(userId),
  ]);
  const brandNameById = new Map(brands.map((b) => [b.id, b.name] as const));
  return buildReminders(deals, deliverables, interactions, brandNameById);
}
