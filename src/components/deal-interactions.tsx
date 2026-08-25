"use client";

import { useState } from "react";
import { createInteractionAction, deleteInteractionAction } from "@/lib/actions/contacts";
import type { Interaction, InteractionType, Contact } from "@/lib/db/local";

const TYPE_LABEL: Record<InteractionType, string> = {
  email: "Email",
  call: "Call",
  dm: "DM",
  meeting: "Meeting",
  note: "Note",
};

const TYPE_GLYPH: Record<InteractionType, string> = {
  email: "@",
  call: "☎",
  dm: "✉",
  meeting: "▣",
  note: "✎",
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export function DealInteractions({
  dealId,
  brandId,
  interactions,
  contacts,
}: {
  dealId: string;
  brandId: string;
  interactions: Interaction[];
  contacts: Contact[];
}) {
  const [showForm, setShowForm] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("brandId", brandId);
    formData.set("dealId", dealId);
    const res = await createInteractionAction(formData);
    if (res.success) {
      window.location.reload();
    } else {
      alert(res.error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this interaction?")) return;
    await deleteInteractionAction(id);
    window.location.reload();
  }

  return (
    <div>
      <header className="flex items-center justify-between">
        <h2 className="text-[14px] font-semibold text-[var(--color-ink)]">Interactions ({interactions.length})</h2>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="text-[12px] text-[var(--color-accent)] hover:underline"
        >
          {showForm ? "Cancel" : "Log interaction →"}
        </button>
      </header>

      {showForm && (
        <form onSubmit={handleCreate} className="mt-4 space-y-3 rounded-[8px] border border-[var(--color-line)] bg-[var(--color-paper-2)] p-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-[var(--color-ink-2)]">Type *</label>
              <select
                name="type"
                required
                defaultValue="email"
                className="mt-1 block w-full rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2.5 text-[13px]"
              >
                <option value="email">Email</option>
                <option value="call">Call</option>
                <option value="dm">DM</option>
                <option value="meeting">Meeting</option>
                <option value="note">Note</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[var(--color-ink-2)]">When</label>
              <input
                name="occurredAt"
                type="datetime-local"
                defaultValue={new Date().toISOString().slice(0, 16)}
                className="mt-1 block w-full rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2.5 text-[13px]"
              />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[var(--color-ink-2)]">Contact (optional)</label>
            <select
              name="contactId"
              defaultValue=""
              className="mt-1 block w-full rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2.5 text-[13px]"
            >
              <option value="">— None —</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[var(--color-ink-2)]">Summary *</label>
            <textarea
              name="summary"
              required
              rows={3}
              placeholder="What was said, decided, promised?"
              className="mt-1 block w-full rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2.5 text-[13px]"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              data-testid="submit-interaction"
              className="inline-flex min-h-[44px] h-11 touch-manipulation items-center gap-2 rounded-[6px] bg-[var(--color-accent)] px-3 text-[13px] font-medium text-white hover:opacity-90"
            >
              Save interaction
            </button>
          </div>
        </form>
      )}

      {interactions.length === 0 ? (
        <p className="mt-4 text-[13px] text-[var(--color-ink-3)]">No interactions tied to this deal yet.</p>
      ) : (
        <ol className="mt-4 space-y-3">
          {interactions.map((i) => {
            const contact = contacts.find((c) => c.id === i.contactId);
            return (
              <li key={i.id} className="flex gap-3 rounded-[8px] border border-[var(--color-line)] bg-[var(--color-paper-2)] p-3">
                <div className="flex min-h-[44px] h-11 touch-manipulation w-9 flex-none items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[14px] font-semibold text-[var(--color-accent)]">
                  {TYPE_GLYPH[i.type]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-semibold text-[var(--color-ink)]">
                      {TYPE_LABEL[i.type]}
                      {contact && <span className="ml-2 font-normal text-[var(--color-ink-2)]">with {contact.name}</span>}
                    </p>
                    <button
                      onClick={() => handleDelete(i.id)}
                      className="text-[11px] text-[var(--color-ink-3)] hover:text-[var(--color-accent)]"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="mt-0.5 text-[11px] text-[var(--color-ink-3)]">{formatDateTime(i.occurredAt)}</p>
                  <p className="mt-2 whitespace-pre-wrap text-[13px] text-[var(--color-ink)]">{i.summary}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
