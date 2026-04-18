// Shared types — source of truth. Mirrors docs/02-API-CONTRACT.md.
// Do not edit without both frontend + backend agreement. Bump SCHEMA_VERSION on any change.

export const SCHEMA_VERSION = 1;

export type Stage =
  | "idle"
  | "fetching_transcript"
  | "excavating"
  | "fact_checking"
  | "graphing"
  | "narrating"
  | "complete"
  | "error";

export type AgentName =
  | "excavator"
  | "fact_weaver"
  | "memory_graph"
  | "narrator";

export type FragmentKind =
  | "memory"
  | "place"
  | "person"
  | "date"
  | "emotion"
  | "quote"
  | "unit";

export type Fragment = {
  id: string;
  kind: FragmentKind;
  text: string;
  sourceSpan?: { startSec: number; endSec: number };
};

export type EntityKind = "person" | "place" | "event" | "unit" | "object";

export type Entity = {
  id: string;
  kind: EntityKind;
  name: string;
  description?: string;
  relatedTo?: string[];
};

export type Fact = {
  id: string;
  claim: string;
  verdict: "verified" | "uncertain" | "contradicted";
  sources: Array<{ title: string; url: string }>;
  imageUrl?: string;
  imageCredit?: string;
};

export type LetterSection = {
  heading?: string;
  body: string;
  imageUrl?: string;
  imageCredit?: string;
  footnotes?: Array<{ marker: string; text: string; url?: string }>;
};

export type Letter = {
  salutation: string;
  sections: LetterSection[];
  signoff: string;
  speaker: string;
  generatedAt: string;
};

export type StreamEvent =
  | { type: "status"; stage: Stage; message: string }
  | {
      type: "transcript";
      text: string;
      durationSec: number;
      title?: string;
      speaker?: string;
    }
  | { type: "fragment"; fragment: Fragment }
  | { type: "entity"; entity: Entity }
  | { type: "fact"; fact: Fact }
  | { type: "thinking"; agent: AgentName; text: string }
  | { type: "agent_start"; agent: AgentName }
  | {
      type: "agent_end";
      agent: AgentName;
      usage?: { inputTokens: number; outputTokens: number };
    }
  | { type: "letter_chunk"; text: string }
  | { type: "letter_complete"; letter: Letter }
  | { type: "error"; message: string };

export type RunRequest = {
  youtubeUrl?: string;
  fixtureId?: string;
  title?: string;
  speaker?: string;
};
