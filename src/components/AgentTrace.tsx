import type { AgentName, Entity, Fact, Fragment } from "@/lib/types";
import { AgentPanel } from "./AgentPanel";
import { Badge } from "./UI";

type Props = {
  agentStatus: Record<AgentName, "idle" | "running" | "done">;
  fragments: Fragment[];
  facts: Fact[];
  entities: Entity[];
  thinking: Array<{ agent: AgentName; text: string }>;
  letterCharCount: number;
};

export function AgentTrace({
  agentStatus,
  fragments,
  facts,
  entities,
  thinking,
  letterCharCount,
}: Props) {
  const narratorThinking = thinking.filter((t) => t.agent === "narrator");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <AgentPanel
        agent="excavator"
        status={agentStatus.excavator}
        count={fragments.length}
      >
        {fragments.length === 0 ? (
          <EmptyState>Awaiting transcript…</EmptyState>
        ) : (
          <ul className="flex flex-col gap-[6px] max-h-[260px] overflow-y-auto pr-1">
            {fragments.slice(-14).map((f) => (
              <li
                key={f.id}
                className="whisper-in flex items-start gap-2 text-[13px] leading-snug"
              >
                <Badge tone="neutral">{f.kind}</Badge>
                <span className="text-[var(--text-primary)]">{f.text}</span>
              </li>
            ))}
          </ul>
        )}
      </AgentPanel>

      <AgentPanel
        agent="fact_weaver"
        status={agentStatus.fact_weaver}
        count={facts.length}
      >
        {facts.length === 0 ? (
          <EmptyState>Awaiting claims to verify…</EmptyState>
        ) : (
          <ul className="flex flex-col gap-3 max-h-[260px] overflow-y-auto pr-1">
            {facts.map((f) => (
              <li
                key={f.id}
                className="whisper-in flex flex-col gap-1 text-[13px]"
              >
                <div className="flex items-start gap-2">
                  <Badge
                    tone={
                      f.verdict === "verified"
                        ? "ok"
                        : f.verdict === "contradicted"
                          ? "warn"
                          : "neutral"
                    }
                  >
                    {f.verdict}
                  </Badge>
                  <span className="text-[var(--text-primary)] leading-snug">
                    {f.claim}
                  </span>
                </div>
                {f.sources.slice(0, 2).map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="caption-muted hover:text-[var(--accent)] hover:underline truncate"
                  >
                    → {s.title}
                  </a>
                ))}
              </li>
            ))}
          </ul>
        )}
      </AgentPanel>

      <AgentPanel
        agent="memory_graph"
        status={agentStatus.memory_graph}
        count={entities.length}
      >
        {entities.length === 0 ? (
          <EmptyState>Graph empty…</EmptyState>
        ) : (
          <ul className="flex flex-col gap-[6px] max-h-[260px] overflow-y-auto pr-1">
            {entities.map((e) => (
              <li
                key={e.id}
                className="whisper-in flex items-start gap-2 text-[13px] leading-snug"
              >
                <Badge tone="neutral">{e.kind}</Badge>
                <span className="text-[var(--text-primary)]">
                  {e.name}
                  {e.description ? (
                    <span className="caption-muted block">{e.description}</span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        )}
      </AgentPanel>

      <AgentPanel
        agent="narrator"
        status={agentStatus.narrator}
        count={letterCharCount}
      >
        {narratorThinking.length === 0 && letterCharCount === 0 ? (
          <EmptyState>Thinking pending…</EmptyState>
        ) : (
          <div className="flex flex-col gap-2 text-[13px] max-h-[260px] overflow-y-auto pr-1">
            {narratorThinking.map((t, i) => (
              <p
                key={i}
                className="whisper-in caption-muted italic leading-snug"
              >
                <span className="text-[var(--text-muted)]">thinking:</span>{" "}
                <span className="text-[var(--text-secondary)]">{t.text}</span>
              </p>
            ))}
            {letterCharCount > 0 ? (
              <p className="mt-1 micro text-[var(--badge-text)]">
                writing letter · {letterCharCount} chars
                {agentStatus.narrator === "running" ? (
                  <span className="whisper-blink">▍</span>
                ) : null}
              </p>
            ) : null}
          </div>
        )}
      </AgentPanel>
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className="caption-muted italic">{children}</div>;
}
