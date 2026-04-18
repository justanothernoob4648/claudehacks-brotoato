import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "blue",
}: {
  children: ReactNode;
  tone?: "blue" | "ok" | "warn" | "neutral";
}) {
  const colors =
    tone === "ok"
      ? "bg-[rgba(42,157,153,0.10)] text-[var(--ok)]"
      : tone === "warn"
        ? "bg-[rgba(221,91,0,0.10)] text-[var(--warn)]"
        : tone === "neutral"
          ? "bg-[rgba(0,0,0,0.05)] text-[var(--text-secondary)]"
          : "bg-[var(--badge-bg)] text-[var(--badge-text)]";
  return (
    <span
      className={`inline-flex items-center px-2 py-[3px] rounded-[var(--radius-pill)] micro ${colors}`}
    >
      {children}
    </span>
  );
}

export function StatusDot({ status }: { status: "idle" | "running" | "done" }) {
  const color =
    status === "running"
      ? "bg-[var(--accent)]"
      : status === "done"
        ? "bg-[var(--done)]"
        : "bg-[var(--text-muted)]";
  const animate = status === "running" ? "whisper-pulse" : "";
  return (
    <span
      aria-label={status}
      className={`inline-block w-[6px] h-[6px] rounded-full ${color} ${animate}`}
    />
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 rounded-[var(--radius-btn)] bg-[var(--accent)] text-white font-semibold text-[15px] transition-all duration-150 hover:bg-[var(--accent-active)] active:scale-[0.96] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  active,
}: {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-[6px] rounded-[var(--radius-btn)] text-[14px] font-medium transition-all duration-150 text-[var(--text-primary)] ${
        active
          ? "bg-[rgba(0,0,0,0.05)]"
          : "hover:bg-[rgba(0,0,0,0.04)] active:scale-[0.97]"
      }`}
    >
      {children}
    </button>
  );
}

export function Card({
  children,
  className = "",
  tight,
}: {
  children: ReactNode;
  className?: string;
  tight?: boolean;
}) {
  return (
    <div
      className={`whisper-border card-shadow rounded-[var(--radius-card)] bg-white ${
        tight ? "p-4" : "p-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}
