export default function DemoBanner() {
  return (
    <div className="bg-[var(--color-accent-soft)] border-l-4 border-[var(--color-accent)] p-4 my-6">
      <div className="flex items-start gap-3">
        <div className="flex h-5 w-5 items-center justify-center rounded-[6px] bg-[var(--color-accent)] text-[var(--color-paper)] text-[12px]">
          !
        </div>
        <div className="text-[13px] text-[var(--color-ink)]">
          Demo mode — using local auth. Wire Supabase to enable real auth.
        </div>
      </div>
    </div>
  );
}