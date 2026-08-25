"use client";

import { useState } from "react";
import {
  createDeliverableAction,
  toggleDeliverableCompleteAction,
  deleteDeliverableAction,
} from "@/lib/actions/deliverables";
import { success as hapticSuccess, tap as hapticTap } from "@/lib/haptics";
import type { Deliverable, DeliverablePlatform, DeliverableContentType } from "@/lib/db/local";

const PLATFORM_LABEL: Record<DeliverablePlatform, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  tiktok: "TikTok",
  newsletter: "Newsletter",
  podcast: "Podcast",
  other: "Other",
};

const CONTENT_TYPE_LABEL: Record<DeliverableContentType, string> = {
  integration: "Integration",
  dedicated: "Dedicated",
  story: "Story",
  reel: "Reel",
  post: "Post",
};

function isOverdue(d: Deliverable): boolean {
  if (d.completed) return false;
  if (!d.dueDate) return false;
  return new Date(d.dueDate) < new Date(new Date().toISOString().slice(0, 10));
}

function daysUntil(dueDate: string): number {
  const due = new Date(dueDate);
  const today = new Date(new Date().toISOString().slice(0, 10));
  return Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function DeliverableChecklist({ dealId, deliverables }: { dealId: string; deliverables: Deliverable[] }) {
  const [showForm, setShowForm] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("dealId", dealId);
    const res = await createDeliverableAction(formData);
    if (res.success) {
      window.location.reload();
    } else {
      alert(res.error || "Failed to add deliverable");
    }
  }

  async function handleToggle(d: Deliverable) {
    hapticSuccess();
    await toggleDeliverableCompleteAction(d.id, !d.completed);
    window.location.reload();
  }

  async function handleDelete(id: string, title: string) {
    hapticTap();
    if (!confirm(`Delete deliverable "${title}"?`)) return;
    await deleteDeliverableAction(id);
    window.location.reload();
  }

  const overdue = deliverables.filter(isOverdue);
  const upcoming = deliverables.filter((d) => !d.completed && !isOverdue(d));
  const completed = deliverables.filter((d) => d.completed);

  return (
    <div>
      <header className="flex items-center justify-between">
        <h2 className="text-[14px] font-semibold text-[var(--color-ink)]">Deliverables ({deliverables.length})</h2>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="text-[12px] text-[var(--color-accent)] hover:underline"
        >
          {showForm ? "Cancel" : "Add deliverable →"}
        </button>
      </header>

      {showForm && (
        <form
          onSubmit={handleCreate}
          data-testid="deliverable-form"
          className="mt-4 space-y-3 rounded-[8px] border border-[var(--color-line)] bg-[var(--color-paper-2)] p-4"
        >
          <div>
            <label className="block text-[12px] font-medium text-[var(--color-ink-2)]">Title *</label>
            <input
              name="title"
              required
              placeholder="e.g., Q1 YouTube integration video"
              className="mt-1 block w-full rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2.5 text-[13px]"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-[var(--color-ink-2)]">Due date</label>
              <input
                name="dueDate"
                type="date"
                className="mt-1 block w-full rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2.5 text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[var(--color-ink-2)]">Platform</label>
              <select
                name="platform"
                defaultValue="youtube"
                className="mt-1 block w-full rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2.5 text-[13px]"
              >
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="newsletter">Newsletter</option>
                <option value="podcast">Podcast</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[var(--color-ink-2)]">Content type</label>
              <select
                name="contentType"
                defaultValue="integration"
                className="mt-1 block w-full rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2.5 text-[13px]"
              >
                <option value="integration">Integration</option>
                <option value="dedicated">Dedicated</option>
                <option value="story">Story</option>
                <option value="reel">Reel</option>
                <option value="post">Post</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[var(--color-ink-2)]">Notes</label>
            <textarea
              name="notes"
              rows={2}
              className="mt-1 block w-full rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2.5 text-[13px]"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              data-testid="submit-deliverable"
              className="inline-flex min-h-[44px] h-11 touch-manipulation items-center gap-2 rounded-[6px] bg-[var(--color-accent)] px-3 text-[13px] font-medium text-white hover:opacity-90"
            >
              Add deliverable
            </button>
          </div>
        </form>
      )}

      {overdue.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-accent)]">
            Overdue ({overdue.length})
          </p>
          <ul className="space-y-2">
            {overdue.map((d) => (
              <DeliverableRow key={d.id} d={d} onToggle={handleToggle} onDelete={handleDelete} />
            ))}
          </ul>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-3)]">
            Upcoming ({upcoming.length})
          </p>
          <ul className="space-y-2">
            {upcoming.map((d) => (
              <DeliverableRow key={d.id} d={d} onToggle={handleToggle} onDelete={handleDelete} />
            ))}
          </ul>
        </div>
      )}

      {completed.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-3)]">
            Completed ({completed.length})
          </p>
          <ul className="space-y-2">
            {completed.map((d) => (
              <DeliverableRow key={d.id} d={d} onToggle={handleToggle} onDelete={handleDelete} />
            ))}
          </ul>
        </div>
      )}

      {deliverables.length === 0 && (
        <p className="mt-4 text-[13px] text-[var(--color-ink-3)]">
          No deliverables yet. Track the actual content pieces the brand expects from you.
        </p>
      )}
    </div>
  );
}

function DeliverableRow({
  d,
  onToggle,
  onDelete,
}: {
  d: Deliverable;
  onToggle: (d: Deliverable) => void;
  onDelete: (id: string, title: string) => void;
}) {
  const overdue = isOverdue(d);
  const days = d.dueDate ? daysUntil(d.dueDate) : null;
  return (
    <li
      className={`flex items-start gap-3 rounded-[8px] border p-3 ${
        d.completed
          ? "border-[var(--color-line)] bg-[var(--color-paper-2)] opacity-60"
          : overdue
          ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
          : "border-[var(--color-line)] bg-white"
      }`}
    >
      <button
        onClick={() => onToggle(d)}
        aria-label={d.completed ? "Mark incomplete" : "Mark complete"}
        className={`mt-0.5 flex h-7 w-7 min-h-[28px] flex-none items-center justify-center rounded-[4px] border-2 touch-manipulation ${
          d.completed
            ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
            : overdue
            ? "border-[var(--color-accent)]"
            : "border-[var(--color-line)]"
        }`}
      >
        {d.completed && (
          <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3">
            <path d="M3 8L7 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <div className="flex-1">
        <p
          className={`text-[14px] ${
            d.completed ? "text-[var(--color-ink-3)] line-through" : overdue ? "font-medium text-[var(--color-accent)]" : "text-[var(--color-ink)]"
          }`}
        >
          {d.title}
        </p>
        <p className={`mt-0.5 text-[11px] ${overdue ? "text-[var(--color-accent)]" : "text-[var(--color-ink-3)]"}`}>
          {d.platform && <span>{PLATFORM_LABEL[d.platform]}</span>}
          {d.contentType && d.platform && <span> · </span>}
          {d.contentType && <span>{CONTENT_TYPE_LABEL[d.contentType]}</span>}
          {d.dueDate && days !== null && (
            <>
              {(d.platform || d.contentType) && " · "}
              <span>
                {new Date(d.dueDate).toLocaleDateString()}
                {!d.completed && days < 0 && ` (${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} overdue)`}
                {!d.completed && days === 0 && " (today)"}
                {!d.completed && days > 0 && days <= 3 && ` (in ${days} day${days === 1 ? "" : "s"})`}
              </span>
            </>
          )}
        </p>
        {d.notes && <p className="mt-1 text-[12px] text-[var(--color-ink-2)]">{d.notes}</p>}
      </div>
      <button
        onClick={() => onDelete(d.id, d.title)}
        className="text-[11px] text-[var(--color-ink-3)] hover:text-[var(--color-accent)]"
      >
        Remove
      </button>
    </li>
  );
}
