# 02 — API Contract (the handoff)

> **Both builders MUST read this before writing a line of code.** This file is the interface between the two computers. Any change must be agreed between frontend and backend owners.

## Endpoint

### `POST /api/run`

**Request body** (JSON):

```ts
type RunRequest = {
  youtubeUrl?: string; // e.g. "https://www.youtube.com/watch?v=..."
  fixtureId?: string; // e.g. "norman-duncan" — loads pre-cached transcript, skips fetch
  title?: string; // optional display label, e.g. "Norman Duncan · D-Day · 101st Airborne"
  speaker?: string; // optional speaker name for the letter salutation
};
```

One of `youtubeUrl` or `fixtureId` MUST be present.

**Response**:

- `Content-Type: text/event-stream`
- Transfer-encoding: chunked
- One SSE event per line-group, terminated by `\n\n`
- On error, final event is `{ type: "error", message }` then the stream closes

## Shared TypeScript types — the single source of truth

> Copy this block verbatim into `src/lib/types.ts`. Neither side re-derives these.

```ts
// ─────────────────────────────────────────────────────────────────────────
// src/lib/types.ts — SHARED between frontend & backend.
// Change only by agreement of both owners. Bump SCHEMA_VERSION on any change.
// ─────────────────────────────────────────────────────────────────────────

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
  | "memory" // a specific recalled moment
  | "place" // a named location
  | "person" // someone mentioned
  | "date" // a year or date
  | "emotion" // a feeling attached to a moment
  | "quote"; // a verbatim line worth preserving

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
  relatedTo?: string[]; // ids of other entities
};

export type Fact = {
  id: string;
  claim: string; // "The 101st landed near Sainte-Mère-Église"
  verdict: "verified" | "uncertain" | "contradicted";
  sources: Array<{ title: string; url: string }>;
  imageUrl?: string; // public-domain / Commons / NARA
  imageCredit?: string;
};

export type LetterSection = {
  heading?: string;
  body: string; // markdown
  imageUrl?: string;
  imageCredit?: string;
  footnotes?: Array<{ marker: string; text: string; url?: string }>;
};

export type Letter = {
  salutation: string; // "Dear great-grandchild I will never meet,"
  sections: LetterSection[];
  signoff: string; // "With love, across the years — Norman"
  speaker: string;
  generatedAt: string; // ISO
};

// ─────────────────────────────────────────────────────────────────────────
// Stream events — the wire format
// ─────────────────────────────────────────────────────────────────────────

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
  | { type: "thinking"; agent: AgentName; text: string } // extended-thinking chunks
  | { type: "agent_start"; agent: AgentName }
  | {
      type: "agent_end";
      agent: AgentName;
      usage?: { inputTokens: number; outputTokens: number };
    }
  | { type: "letter_chunk"; text: string } // streamed narrator output
  | { type: "letter_complete"; letter: Letter }
  | { type: "error"; message: string };
```

## SSE wire format

Each event is sent as:

```
event: message
data: {"type":"fragment","fragment":{...}}

```

(Blank line terminates the event. `event:` name is literally `message` for all events so the EventSource default handler fires.)

The frontend MAY instead consume the stream by reading the body with `Response.body.getReader()` + a line parser — that works better across browsers than `EventSource` for POST requests. **Recommendation: frontend uses `fetch` + `ReadableStream` reader, not `EventSource`**, since `EventSource` doesn't support POST.

## Ordering guarantees

Backend promises:

1. First event is always `status { stage: "fetching_transcript" }`
2. Exactly one `transcript` event before any `fragment`
3. All `fragment` events before any `fact` or `entity`
4. `letter_complete` is the last event (besides any trailing `error`)
5. `agent_start` / `agent_end` bracket each agent's work

Frontend can rely on these. If backend violates them, it's a backend bug.

## Error modes (contract)

| Code path                  | Event                                                   | What frontend should show                |
| -------------------------- | ------------------------------------------------------- | ---------------------------------------- |
| Invalid URL                | `error { message: "Invalid YouTube URL" }`              | Red banner, retry prompt                 |
| Transcript unavailable     | `error { message: "No captions found for this video" }` | Red banner, suggest a preset             |
| Claude API failure mid-run | `error` then stream closes                              | Keep partial results visible, show toast |
| Timeout (>90s)             | `error { message: "Took too long" }`                    | Same                                     |

## Fixtures for parallel development

While the backend is being built, the frontend MUST be able to work end-to-end against a fixture. Drop `src/fixtures/sample-norman.json` containing an array of `StreamEvent`s in expected order. Frontend dev-mode plays them with ~300ms delay between to simulate the stream.

See `docs/fixtures/sample-norman.json` for the seed file (copy it into `src/fixtures/`).

## Versioning rule

If either builder needs to add a field to any type: bump `SCHEMA_VERSION`, announce in chat, get a thumbs-up, update this doc, then ship.
