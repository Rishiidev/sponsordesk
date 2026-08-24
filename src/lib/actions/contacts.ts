"use server";

// Server actions for contacts and interactions
import {
  createContact,
  updateContact,
  deleteContact,
  createInteraction,
  deleteInteraction,
  getContacts,
  getInteractions,
} from "@/lib/db/local";
import type { InteractionType } from "@/lib/db/local";

const DEMO_USER_ID = "demo-user-id";

// --- Contact actions ---

export async function createContactAction(formData: FormData) {
  const brandId = formData.get("brandId") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as string | undefined;
  const email = formData.get("email") as string | undefined;
  const twitter = formData.get("twitter") as string | undefined;
  const linkedin = formData.get("linkedin") as string | undefined;
  const notes = formData.get("notes") as string | undefined;

  if (!brandId || !name || name.trim().length === 0) {
    return { success: false, error: "Brand and contact name are required" };
  }

  const contact = await createContact({
    userId: DEMO_USER_ID,
    brandId,
    name: name.trim(),
    role: role?.trim() || undefined,
    email: email?.trim() || undefined,
    twitter: twitter?.trim() || undefined,
    linkedin: linkedin?.trim() || undefined,
    notes: notes?.trim() || undefined,
  });

  return { success: true, contact };
}

export async function updateContactAction(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const role = formData.get("role") as string | undefined;
  const email = formData.get("email") as string | undefined;
  const twitter = formData.get("twitter") as string | undefined;
  const linkedin = formData.get("linkedin") as string | undefined;
  const notes = formData.get("notes") as string | undefined;

  if (!name || name.trim().length === 0) {
    return { success: false, error: "Contact name is required" };
  }

  const contact = await updateContact(id, {
    name: name.trim(),
    role: role?.trim() || undefined,
    email: email?.trim() || undefined,
    twitter: twitter?.trim() || undefined,
    linkedin: linkedin?.trim() || undefined,
    notes: notes?.trim() || undefined,
  });

  return { success: true, contact };
}

export async function deleteContactAction(id: string) {
  await deleteContact(id);
  return { success: true };
}

// --- Interaction actions ---

export async function createInteractionAction(formData: FormData) {
  const brandId = formData.get("brandId") as string;
  const dealId = formData.get("dealId") as string | undefined;
  const contactId = formData.get("contactId") as string | undefined;
  const type = formData.get("type") as InteractionType;
  const summary = formData.get("summary") as string;
  const occurredAt = formData.get("occurredAt") as string | undefined;

  if (!brandId || !type || !summary || summary.trim().length === 0) {
    return { success: false, error: "Brand, type, and summary are required" };
  }

  const validTypes: InteractionType[] = ["email", "call", "dm", "meeting", "note"];
  if (!validTypes.includes(type)) {
    return { success: false, error: "Invalid interaction type" };
  }

  const interaction = await createInteraction({
    userId: DEMO_USER_ID,
    brandId,
    dealId: dealId || undefined,
    contactId: contactId || undefined,
    type,
    summary: summary.trim(),
    occurredAt: occurredAt || new Date().toISOString(),
  });

  return { success: true, interaction };
}

export async function deleteInteractionAction(id: string) {
  await deleteInteraction(id);
  return { success: true };
}

// --- Read helpers ---

export async function getContactsForUser() {
  return getContacts(DEMO_USER_ID);
}

export async function getInteractionsForUser() {
  return getInteractions(DEMO_USER_ID);
}
