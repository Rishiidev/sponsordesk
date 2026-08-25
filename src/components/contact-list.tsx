"use client";

import { useState } from "react";
import { createContactAction, deleteContactAction } from "@/lib/actions/contacts";
import type { Contact } from "@/lib/db/local";

export function ContactList({ brandId, contacts }: { brandId: string; contacts: Contact[] }) {
  const [showForm, setShowForm] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("brandId", brandId);
    const res = await createContactAction(formData);
    if (res.success) {
      window.location.reload();
    } else {
      alert(res.error);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete contact "${name}"? This cannot be undone.`)) return;
    await deleteContactAction(id);
    window.location.reload();
  }

  return (
    <div>
      <header className="flex items-center justify-between">
        <h2 className="text-[14px] font-semibold text-[var(--color-ink)]">Contacts ({contacts.length})</h2>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="text-[12px] text-[var(--color-accent)] hover:underline"
        >
          {showForm ? "Cancel" : "Add contact →"}
        </button>
      </header>

      {showForm && (
        <form onSubmit={handleCreate} className="mt-4 space-y-3 rounded-[8px] border border-[var(--color-line)] bg-[var(--color-paper-2)] p-4">
          <div>
            <label className="block text-[12px] font-medium text-[var(--color-ink-2)]">Name *</label>
            <input
              name="name"
              required
              placeholder="Jane Doe"
              className="mt-1 block w-full rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2.5 text-[13px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-[var(--color-ink-2)]">Role</label>
              <input
                name="role"
                placeholder="Head of Marketing"
                className="mt-1 block w-full rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2.5 text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[var(--color-ink-2)]">Email</label>
              <input
                name="email"
                type="email"
                placeholder="jane@brand.com"
                className="mt-1 block w-full rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2.5 text-[13px]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-[var(--color-ink-2)]">Twitter</label>
              <input
                name="twitter"
                placeholder="@jane"
                className="mt-1 block w-full rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2.5 text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[var(--color-ink-2)]">LinkedIn</label>
              <input
                name="linkedin"
                placeholder="linkedin.com/in/jane"
                className="mt-1 block w-full rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2.5 text-[13px]"
              />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[var(--color-ink-2)]">Notes</label>
            <textarea
              name="notes"
              rows={2}
              placeholder="Any context worth remembering."
              className="mt-1 block w-full rounded-[6px] border border-[var(--color-line)] bg-white px-3 py-2.5 text-[13px]"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              data-testid="submit-contact"
              className="inline-flex min-h-[44px] h-11 touch-manipulation items-center gap-2 rounded-[6px] bg-[var(--color-accent)] px-3 text-[13px] font-medium text-white hover:opacity-90"
            >
              Add contact
            </button>
          </div>
        </form>
      )}

      {contacts.length === 0 ? (
        <p className="mt-4 text-[13px] text-[var(--color-ink-3)]">No contacts yet. Add the people you talk to at this brand.</p>
      ) : (
        <ul className="mt-4 divide-y divide-[var(--color-line)]">
          {contacts.map((c) => (
            <li key={c.id} className="flex items-start justify-between gap-3 py-3">
              <div>
                <p className="text-[14px] font-medium text-[var(--color-ink)]">{c.name}</p>
                <p className="mt-0.5 text-[12px] text-[var(--color-ink-3)]">
                  {[c.role, c.email, c.twitter, c.linkedin].filter(Boolean).join(" · ") || "—"}
                </p>
                {c.notes && (
                  <p className="mt-1 text-[12px] text-[var(--color-ink-2)]">{c.notes}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(c.id, c.name)}
                className="text-[12px] text-[var(--color-ink-3)] hover:text-[var(--color-accent)]"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
