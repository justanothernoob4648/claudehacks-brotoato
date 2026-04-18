import type { ReactNode } from "react";
import type { AgentName } from "@/lib/types";
import { StatusDot } from "./UI";

type AgentMeta = {
  label: string;
  hint: string;
};

const META: Record<AgentName, AgentMeta> = {
  excavator: {
    label: "Story-Excavator",
    hint: "Pulls atomic fragments from the transcript.",
  },
  fact_weaver: {
    label: "Fact-Weaver",
    hint: "Verifies history via web search.",
  },
  memory_graph: {
    label: "Memory-Graph",
    hint: "Builds the typed entity graph.",
  },
  narrator: {
    label: "Narrator",
    hint: "Composes the letter with extended thinking.",
  },
};

export function AgentPanel({
  agent,
  status,
  count,
  children,
}: {
  agent: AgentName;
  status: "idle" | "running" | "done";
  count?: number;
  children: ReactNode;
}) {
  const meta = META[agent];
  return (
    <div
      className="whisper-border card-shadow rounded-[var(--radius-card)] bg-white p-5 flex flex-col gap-3 min-h-[220px]"
      aria-label={meta.label}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <StatusDot status={status} />
            <h3 className="heading-card text-[16px] leading-tight">
              {meta.label}
            </h3>
          </div>
          <p className="caption-muted">{meta.hint}</p>
        </div>
        {typeof count === "number" && count > 0 ? (
          <span className="micro text-[var(--text-muted)] tabular-nums">
            {count}
          </span>
        ) : null}
      </header>
      <div className="flex flex-col gap-2 overflow-hidden">{children}</div>
    </div>
  );
}
