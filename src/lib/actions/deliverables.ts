"use server";

// Server actions for deliverables
import {
  createDeliverable,
  updateDeliverable,
  markDeliverableComplete,
  deleteDeliverable,
} from "@/lib/db/local";
import type { DeliverablePlatform, DeliverableContentType } from "@/lib/db/local";

const DEMO_USER_ID = "demo-user-id";

export async function createDeliverableAction(formData: FormData) {
  const dealId = formData.get("dealId") as string;
  const title = formData.get("title") as string;
  const dueDate = formData.get("dueDate") as string | undefined;
  const platform = formData.get("platform") as DeliverablePlatform | null;
  const contentType = formData.get("contentType") as DeliverableContentType | null;
  const notes = formData.get("notes") as string | undefined;

  if (!dealId || !title || title.trim().length === 0) {
    return { success: false, error: "Deal and deliverable title are required" };
  }

  const validPlatforms: DeliverablePlatform[] = [
    "youtube",
    "instagram",
    "tiktok",
    "newsletter",
    "podcast",
    "other",
  ];
  if (platform && !validPlatforms.includes(platform)) {
    return { success: false, error: "Invalid platform" };
  }

  const validContentTypes: DeliverableContentType[] = [
    "integration",
    "dedicated",
    "story",
    "reel",
    "post",
  ];
  if (contentType && !validContentTypes.includes(contentType)) {
    return { success: false, error: "Invalid content type" };
  }

  const deliverable = await createDeliverable({
    userId: DEMO_USER_ID,
    dealId,
    title: title.trim(),
    dueDate: dueDate || undefined,
    platform: platform || undefined,
    contentType: contentType || undefined,
    notes: notes?.trim() || undefined,
  });

  return { success: true, deliverable };
}

export async function updateDeliverableAction(id: string, formData: FormData) {
  const title = formData.get("title") as string | undefined;
  const dueDate = formData.get("dueDate") as string | undefined;
  const platform = formData.get("platform") as DeliverablePlatform | null;
  const contentType = formData.get("contentType") as DeliverableContentType | null;
  const notes = formData.get("notes") as string | undefined;

  const data: any = {};
  if (title) data.title = title.trim();
  if (dueDate) data.dueDate = dueDate;
  if (platform) data.platform = platform;
  if (contentType) data.contentType = contentType;
  if (notes !== null) data.notes = notes?.trim() || undefined;

  const deliverable = await updateDeliverable(id, data);
  return { success: true, deliverable };
}

export async function toggleDeliverableCompleteAction(id: string, completed: boolean) {
  const deliverable = await markDeliverableComplete(id, completed);
  return { success: true, deliverable };
}

export async function deleteDeliverableAction(id: string) {
  await deleteDeliverable(id);
  return { success: true };
}
