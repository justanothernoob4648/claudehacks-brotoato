"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { AgentTrace } from "@/components/AgentTrace";
import { LetterRender } from "@/components/LetterRender";
import { Badge, GhostButton, PrimaryButton } from "@/components/UI";
import { getFixture } from "@/lib/fixtures";
import { playFixture, runStream } from "@/lib/sse";
import type {
  AgentName,
  Entity,
  Fact,
  Fragment,
  Letter,
  RunRequest,
  Stage,
  StreamEvent,
} from "@/lib/types";

type AgentStatus = "idle" | "running" | "done";

type RunState = {
  runId: number;
  stage: Stage;
  stageMessage: string;
  title?: string;
  speaker?: string;
  transcript?: string;
  fragments: Fragment[];
  facts: Fact[];
  entities: Entity[];
  thinking: Array<{ agent: AgentName; text: string }>;
  agentStatus: Record<AgentName, AgentStatus>;
  letterChunks: string[];
  letter?: Letter;
  error?: string;
};

type Action =
  | StreamEvent
  | { type: "__reset"; title?: string; speaker?: string };

function freshState(runId: number, title?: string, speaker?: string): RunState {
  return {
    runId,
    stage: "idle",
    stageMessage: "Ready.",
    title,
    speaker,
    fragments: [],
    facts: [],
    entities: [],
    thinking: [],
    agentStatus: {
      excavator: "idle",
      fact_weaver: "idle",
      memory_graph: "idle",
      narrator: "idle",
    },
    letterChunks: [],
  };
}

function reducer(state: RunState, event: Action): RunState {
  switch (event.type) {
    case "__reset":
      return freshState(state.runId + 1, event.title, event.speaker);
    case "status":
      return { ...state, stage: event.stage, stageMessage: event.message };
    case "transcript":
      return {
        ...state,
        transcript: event.text,
        title: event.title ?? state.title,
        speaker: event.speaker ?? state.speaker,
      };
    case "fragment":
      return { ...state, fragments: [...state.fragments, event.fragment] };
    case "fact":
      return { ...state, facts: [...state.facts, event.fact] };
    case "entity":
      return { ...state, entities: [...state.entities, event.entity] };
    case "thinking":
      return {
        ...state,
        thinking: [...state.thinking, { agent: event.agent, text: event.text }],
      };
    case "agent_start":
      return {
        ...state,
        agentStatus: { ...state.agentStatus, [event.agent]: "running" },
      };
    case "agent_end":
      return {
        ...state,
        agentStatus: { ...state.agentStatus, [event.agent]: "done" },
      };
    case "letter_chunk":
      return { ...state, letterChunks: [...state.letterChunks, event.text] };
    case "letter_complete":
      return { ...state, letter: event.letter, stage: "complete" };
    case "error":
      return { ...state, error: event.message, stage: "error" };
    default:
      return state;
  }
}

const PRESETS = [
  {
    fixtureId: "norman-duncan",
    label: "Norman · D-Day · 101st Airborne",
    theater: "Europe",
  },
  {
    fixtureId: "hannah-rivera",
    label: "Hannah · USO · Home front",
    theater: "Home front",
    disabled: true,
  },
  {
    fixtureId: "tom-okada",
    label: "Tom · Pacific · 442nd",
    theater: "Pacific",
    disabled: true,
  },
];

export default function Home() {
  const [state, dispatch] = useReducer(reducer, freshState(0));
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function run(body: RunRequest) {
    if (busy) return;
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setBusy(true);
    dispatch({ type: "__reset", title: body.title, speaker: body.speaker });

    try {
      const events = body.fixtureId ? getFixture(body.fixtureId) : null;
      if (events) {
        await playFixture(events, (e) => dispatch(e));
      } else if (body.youtubeUrl) {
        await runStream(body, (e) => dispatch(e), abortRef.current.signal);
      } else {
        throw new Error("Provide a YouTube URL or pick a preset.");
      }
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      dispatch({
        type: "error",
        message: e instanceof Error ? e.message : "Unknown error",
      });
    } finally {
      setBusy(false);
    }
  }

  // Auto-play the default preset when ?fixture=1 is present.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search);
    if (q.get("fixture") === "1") {
      const preset = PRESETS[0];
      void run({
        fixtureId: preset.fixtureId,
        title: preset.label,
        speaker: preset.label.split("·")[0].trim(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const letterCharCount = state.letterChunks.join("").length;
  const streamingLetter = !state.letter
    ? state.letterChunks.join("")
    : undefined;
  const anyActivity =
    state.stage !== "idle" ||
    state.fragments.length > 0 ||
    state.facts.length > 0 ||
    state.entities.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Nav ── */}
      <nav className="w-full border-b border-[rgba(0,0,0,0.08)] bg-white sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LanternMark />
            <span className="font-semibold text-[15px] tracking-tight">
              Lantern
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Badge>Claude Hackathon 2026</Badge>
            <a
              href="https://github.com/justanothernoob4648/claudehacks-brotoato"
              target="_blank"
              rel="noreferrer noopener"
              className="caption hover:text-[var(--accent)] transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero + input ── */}
      <section className="w-full bg-white">
        <div className="max-w-[1200px] mx-auto px-6 pt-20 pb-14 flex flex-col gap-8">
          <div className="flex flex-col gap-4 max-w-3xl">
            <Badge tone="blue">
              ~100,000 WW2 veterans alive · ~300 die every day
            </Badge>
            <h1 className="display-hero text-[var(--text-primary)]">
              Before the last voice goes quiet.
            </h1>
            <p className="body-lg text-[var(--text-secondary)] max-w-xl">
              Paste a YouTube URL of a veteran's testimony. Four Claude agents
              turn it into an illustrated letter to a descendant they will never
              meet.
            </p>
          </div>

          <form
            className="flex flex-col md:flex-row gap-3 max-w-3xl"
            onSubmit={(e) => {
              e.preventDefault();
              if (url.trim()) void run({ youtubeUrl: url.trim() });
            }}
          >
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=…"
              className="flex-1 px-3 py-[10px] rounded-[var(--radius-btn)] border border-[#dddddd] bg-white text-[15px] focus:border-[var(--accent-focus)] focus:outline-none transition-colors"
            />
            <PrimaryButton type="submit" disabled={busy || !url.trim()}>
              {busy ? "Working…" : "Begin"}
            </PrimaryButton>
          </form>

          <div className="flex flex-wrap items-center gap-2 max-w-3xl">
            <span className="caption-muted mr-1">Try:</span>
            {PRESETS.map((p) => (
              <GhostButton
                key={p.fixtureId}
                onClick={() =>
                  !p.disabled &&
                  void run({
                    fixtureId: p.fixtureId,
                    title: p.label,
                    speaker: p.label.split("·")[0].trim(),
                  })
                }
              >
                <span className={p.disabled ? "text-[var(--text-muted)]" : ""}>
                  {p.label}
                  {p.disabled ? " (soon)" : ""}
                </span>
              </GhostButton>
            ))}
          </div>

          {state.error ? (
            <div className="whisper-in max-w-3xl rounded-[var(--radius-card)] border border-[rgba(221,91,0,0.25)] bg-[rgba(221,91,0,0.06)] px-4 py-3 caption text-[var(--warn)]">
              {state.error}
            </div>
          ) : null}
        </div>
      </section>

      {/* ── Agent trace (warm section) ── */}
      <section className="w-full bg-[var(--bg-warm)] border-y border-[rgba(0,0,0,0.06)]">
        <div className="max-w-[1200px] mx-auto px-6 py-14 flex flex-col gap-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex flex-col gap-1">
              <h2 className="heading-md">Four agents at work</h2>
              <p className="caption-muted">
                {anyActivity
                  ? state.stageMessage
                  : "Pick a preset or paste a URL to see the agents run."}
              </p>
            </div>
            {state.title ? <Badge tone="neutral">{state.title}</Badge> : null}
          </div>
          <AgentTrace
            agentStatus={state.agentStatus}
            fragments={state.fragments}
            facts={state.facts}
            entities={state.entities}
            thinking={state.thinking}
            letterCharCount={letterCharCount}
          />
        </div>
      </section>

      {/* ── Letter ── */}
      <section className="w-full bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="flex flex-col items-center gap-3 mb-10">
            <Badge tone="ok">The heirloom</Badge>
            <h2 className="display-secondary text-center">The letter.</h2>
          </div>
          <LetterRender
            letter={state.letter}
            streamingText={streamingLetter}
            speaker={state.speaker}
          />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="w-full border-t border-[rgba(0,0,0,0.08)] bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="caption-muted">
            Testimonies sourced from the Library of Congress Veterans History
            Project, the National WWII Museum, and the WWII Foundation. Imagery
            public-domain via NARA and Wikimedia Commons.
          </p>
          <p className="caption-muted">
            Built in 90 minutes · Claude Hackathon 2026
          </p>
        </div>
      </footer>
    </div>
  );
}

function LanternMark() {
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center w-7 h-7 rounded-[8px] bg-[var(--accent)] text-white text-[13px] font-bold"
      style={{ letterSpacing: "-0.02em" }}
    >
      L
    </span>
  );
}
