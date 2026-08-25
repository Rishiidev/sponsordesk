import type { CSSProperties } from "react";

const baseStyle: CSSProperties = {
  backgroundColor: "var(--color-line)",
  backgroundImage:
    "linear-gradient(90deg, var(--color-line) 0%, var(--color-paper-2) 50%, var(--color-line) 100%)",
  backgroundSize: "200% 100%",
  animation: "skeletonShimmer 1.4s ease-in-out infinite",
};

export function SkeletonText({
  width = "100%",
  height = 12,
  className = "",
}: {
  width?: string | number;
  height?: number;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[4px] ${className}`}
      style={{ ...baseStyle, width, height }}
      aria-hidden
    />
  );
}

export function SkeletonAvatar({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`rounded-full ${className}`}
      style={{ ...baseStyle, width: size, height: size }}
      aria-hidden
    />
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-[12px] border border-[var(--color-line)] bg-white p-4 space-y-3 ${className}`}
      aria-hidden
    >
      <SkeletonText width="60%" height={14} />
      <SkeletonText width="90%" />
      <SkeletonText width="80%" />
    </div>
  );
}

export function SkeletonStatTile({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-[12px] border border-[var(--color-line)] bg-white p-4 space-y-2 ${className}`}
      aria-hidden
    >
      <SkeletonText width="50%" height={10} />
      <SkeletonText width="40%" height={24} />
    </div>
  );
}

export function SkeletonRow({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-3 py-3 border-b border-[var(--color-line)] ${className}`}
      aria-hidden
    >
      <SkeletonAvatar size={28} />
      <div className="flex-1 space-y-2">
        <SkeletonText width="40%" height={12} />
        <SkeletonText width="70%" height={10} />
      </div>
    </div>
  );
}