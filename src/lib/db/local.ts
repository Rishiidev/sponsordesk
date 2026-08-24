// Stub for local database (in-memory / JSON file) to be replaced with Supabase
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";
import path from "path";

// Types
export type Brand = {
  id: string;
  userId: string;
  name: string;
  website?: string;
  primaryContactName?: string;
  primaryContactEmail?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Deal = {
  id: string;
  userId: string;
  brandId: string;
  title: string;
  stage: "inbound" | "negotiating" | "live" | "paid" | "lost";
  amountCents?: number;
  currency?: string;
  startDate?: string;
  endDate?: string;
  paymentTermsDays?: number;
  paymentStatus?: string;
  contractUrl?: string;
  notes?: string;
  lastContactAt?: string;
  nextFollowupAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type Contact = {
  id: string;
  userId: string;
  brandId: string;
  name: string;
  role?: string;
  email?: string;
  twitter?: string;
  linkedin?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type InteractionType = "email" | "call" | "dm" | "meeting" | "note";

export type Interaction = {
  id: string;
  userId: string;
  brandId: string;
  dealId?: string;
  contactId?: string;
  type: InteractionType;
  summary: string;
  occurredAt: string; // ISO timestamp
  createdAt: string;
  updatedAt: string;
};

export type DeliverablePlatform = "youtube" | "instagram" | "tiktok" | "newsletter" | "podcast" | "other";
export type DeliverableContentType = "integration" | "dedicated" | "story" | "reel" | "post";

export type Deliverable = {
  id: string;
  userId: string;
  dealId: string;
  title: string;
  dueDate?: string;
  platform?: DeliverablePlatform;
  contentType?: DeliverableContentType;
  notes?: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
};

// File-based persistence: writes to .data/store.json so server actions and
// server components share state across Next.js dev HMR / module re-eval.
type Store = {
  brands: Brand[];
  deals: Deal[];
  contacts: Contact[];
  interactions: Interaction[];
  deliverables: Deliverable[];
};

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

// Per-process write lock to avoid clobbering concurrent writes.
declare global {
  // eslint-disable-next-line no-var
  var __sponsordeskWriteLock: Promise<void> | undefined;
  // eslint-disable-next-line no-var
  var __sponsordeskCache: Store | undefined;
}

function emptyStore(): Store {
  return { brands: [], deals: [], contacts: [], interactions: [], deliverables: [] };
}

async function readStore(): Promise<Store> {
  if (globalThis.__sponsordeskCache) return globalThis.__sponsordeskCache;
  try {
    const buf = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(buf) as Partial<Store>;
    globalThis.__sponsordeskCache = {
      brands: parsed.brands ?? [],
      deals: parsed.deals ?? [],
      contacts: parsed.contacts ?? [],
      interactions: parsed.interactions ?? [],
      deliverables: parsed.deliverables ?? [],
    };
    return globalThis.__sponsordeskCache;
  } catch {
    globalThis.__sponsordeskCache = emptyStore();
    return globalThis.__sponsordeskCache;
  }
}

async function writeStore(s: Store) {
  globalThis.__sponsordeskCache = s;
  const prev = globalThis.__sponsordeskWriteLock ?? Promise.resolve();
  const next = prev.then(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(s, null, 2), "utf8");
  });
  globalThis.__sponsordeskWriteLock = next.catch(() => undefined);
  return next;
}

async function mutate<T>(fn: (s: Store) => T | Promise<T>): Promise<T> {
  const s = await readStore();
  const result = await fn(s);
  await writeStore(s);
  return result;
}

function nowIso() {
  return new Date().toISOString();
}

// --- Brand CRUD ---
export async function getBrands(userId: string): Promise<Brand[]> {
  const s = await readStore();
  return s.brands.filter((b) => b.userId === userId);
}
export async function createBrand(data: Omit<Brand, "id" | "createdAt" | "updatedAt">): Promise<Brand> {
  return mutate(async (s) => {
    const brand: Brand = { id: uuidv4(), ...data, createdAt: nowIso(), updatedAt: nowIso() };
    s.brands.push(brand);
    return brand;
  });
}
export async function updateBrand(id: string, data: Partial<Brand>): Promise<Brand> {
  return mutate(async (s) => {
    const idx = s.brands.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error("Brand not found");
    const updated = { ...s.brands[idx], ...data, updatedAt: nowIso() };
    s.brands[idx] = updated;
    return updated;
  });
}
export async function deleteBrand(id: string): Promise<void> {
  await mutate(async (s) => {
    s.brands = s.brands.filter((b) => b.id !== id);
    const dealIds = new Set(s.deals.filter((d) => d.brandId === id).map((d) => d.id));
    s.deals = s.deals.filter((d) => d.brandId !== id);
    s.contacts = s.contacts.filter((c) => c.brandId !== id);
    s.interactions = s.interactions.filter((i) => i.brandId !== id);
    s.deliverables = s.deliverables.filter((d) => !dealIds.has(d.dealId));
  });
}

// --- Deal CRUD ---
export async function getDeals(userId: string): Promise<Deal[]> {
  const s = await readStore();
  return s.deals.filter((d) => d.userId === userId);
}
// Admin-only aggregate: returns every deal in the store. Only call from
// route groups that already gate access via the admin allowlist.
export async function getAllDeals(): Promise<Deal[]> {
  const s = await readStore();
  return s.deals;
}
export async function createDeal(data: Omit<Deal, "id" | "createdAt" | "updatedAt">): Promise<Deal> {
  return mutate(async (s) => {
    const deal: Deal = { id: uuidv4(), ...data, createdAt: nowIso(), updatedAt: nowIso() };
    s.deals.push(deal);
    return deal;
  });
}
export async function updateDeal(id: string, data: Partial<Deal>): Promise<Deal> {
  return mutate(async (s) => {
    const idx = s.deals.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error("Deal not found");
    const updated = { ...s.deals[idx], ...data, updatedAt: nowIso() };
    s.deals[idx] = updated;
    return updated;
  });
}
export async function deleteDeal(id: string): Promise<void> {
  await mutate(async (s) => {
    s.deals = s.deals.filter((d) => d.id !== id);
    s.deliverables = s.deliverables.filter((d) => d.dealId !== id);
    s.interactions = s.interactions.map((i) => (i.dealId === id ? { ...i, dealId: undefined } : i));
  });
}
export async function moveDealStage(id: string, stage: Deal["stage"]): Promise<Deal> {
  return mutate(async (s) => {
    const idx = s.deals.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error("Deal not found");
    const updated = { ...s.deals[idx], stage, updatedAt: nowIso() };
    s.deals[idx] = updated;
    return updated;
  });
}

// --- Contact CRUD ---
export async function getContacts(userId: string): Promise<Contact[]> {
  const s = await readStore();
  return s.contacts.filter((c) => c.userId === userId);
}
export async function getContactsForBrand(brandId: string): Promise<Contact[]> {
  const s = await readStore();
  return s.contacts.filter((c) => c.brandId === brandId);
}
export async function createContact(data: Omit<Contact, "id" | "createdAt" | "updatedAt">): Promise<Contact> {
  return mutate(async (s) => {
    const contact: Contact = { id: uuidv4(), ...data, createdAt: nowIso(), updatedAt: nowIso() };
    s.contacts.push(contact);
    return contact;
  });
}
export async function updateContact(id: string, data: Partial<Contact>): Promise<Contact> {
  return mutate(async (s) => {
    const idx = s.contacts.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Contact not found");
    const updated = { ...s.contacts[idx], ...data, updatedAt: nowIso() };
    s.contacts[idx] = updated;
    return updated;
  });
}
export async function deleteContact(id: string): Promise<void> {
  await mutate(async (s) => {
    s.contacts = s.contacts.filter((c) => c.id !== id);
    s.interactions = s.interactions.map((i) => (i.contactId === id ? { ...i, contactId: undefined } : i));
  });
}

// --- Interaction CRUD ---
export async function getInteractions(userId: string): Promise<Interaction[]> {
  const s = await readStore();
  return s.interactions.filter((i) => i.userId === userId);
}
export async function getInteractionsForBrand(brandId: string): Promise<Interaction[]> {
  const s = await readStore();
  return s.interactions
    .filter((i) => i.brandId === brandId)
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
}
export async function getInteractionsForDeal(dealId: string): Promise<Interaction[]> {
  const s = await readStore();
  return s.interactions
    .filter((i) => i.dealId === dealId)
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
}
export async function createInteraction(
  data: Omit<Interaction, "id" | "createdAt" | "updatedAt">,
): Promise<Interaction> {
  return mutate(async (s) => {
    const interaction: Interaction = { id: uuidv4(), ...data, createdAt: nowIso(), updatedAt: nowIso() };
    s.interactions.push(interaction);
    if (interaction.dealId) {
      const dealIdx = s.deals.findIndex((d) => d.id === interaction.dealId);
      if (dealIdx !== -1) {
        s.deals[dealIdx] = {
          ...s.deals[dealIdx],
          lastContactAt: interaction.occurredAt,
          updatedAt: nowIso(),
        };
      }
    }
    return interaction;
  });
}
export async function deleteInteraction(id: string): Promise<void> {
  await mutate(async (s) => {
    s.interactions = s.interactions.filter((i) => i.id !== id);
  });
}

// --- Deliverable CRUD ---
export async function getDeliverables(userId: string): Promise<Deliverable[]> {
  const s = await readStore();
  return s.deliverables.filter((d) => d.userId === userId);
}
export async function getDeliverablesForDeal(dealId: string): Promise<Deliverable[]> {
  const s = await readStore();
  return s.deliverables
    .filter((d) => d.dealId === dealId)
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
}
export async function createDeliverable(
  data: Omit<Deliverable, "id" | "createdAt" | "updatedAt" | "completed" | "completedAt">,
): Promise<Deliverable> {
  return mutate(async (s) => {
    const deliverable: Deliverable = {
      id: uuidv4(),
      ...data,
      completed: false,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    s.deliverables.push(deliverable);
    return deliverable;
  });
}
export async function updateDeliverable(id: string, data: Partial<Deliverable>): Promise<Deliverable> {
  return mutate(async (s) => {
    const idx = s.deliverables.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error("Deliverable not found");
    const updated = { ...s.deliverables[idx], ...data, updatedAt: nowIso() };
    s.deliverables[idx] = updated;
    return updated;
  });
}
export async function markDeliverableComplete(id: string, completed: boolean): Promise<Deliverable> {
  return mutate(async (s) => {
    const idx = s.deliverables.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error("Deliverable not found");
    const updated: Deliverable = {
      ...s.deliverables[idx],
      completed,
      completedAt: completed ? nowIso() : undefined,
      updatedAt: nowIso(),
    };
    s.deliverables[idx] = updated;
    return updated;
  });
}
export async function deleteDeliverable(id: string): Promise<void> {
  await mutate(async (s) => {
    s.deliverables = s.deliverables.filter((d) => d.id !== id);
  });
}

// Test/demo helper: clear all data.
export async function __resetStore() {
  await writeStore(emptyStore());
}
