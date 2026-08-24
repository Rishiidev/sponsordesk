"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth/local";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await signIn(email, password);
      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Sign in failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
      <div className="w-full max-w-[400px] space-y-6">
        <h1 className="text-[24px] font-semibold tracking-tight text-[var(--color-ink)]">
          Sign in to SponsorDesk
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-[13px] font-medium text-[var(--color-ink)]">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-[6px] border border-[var(--color-line)] bg-white px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-[13px] font-medium text-[var(--color-ink)]">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-[6px] border border-[var(--color-line)] bg-white px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>
          {error && (
            <p className="text-[13px] text-[var(--color-ink-2)] bg-[var(--color-accent-soft)] rounded-[6px] px-3 py-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex h-9 items-center justify-center rounded-[6px] bg-[var(--color-accent)] px-4 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <div className="text-[12px] text-[var(--color-ink-3)]">
            Demo credentials: <code className="text-[var(--color-ink)]">demo@sponsordesk.io</code> / <code className="text-[var(--color-ink)]">demo</code>
          </div>
        </form>
      </div>
    </div>
  );
}