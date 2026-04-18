import type { RunRequest, StreamEvent } from "./types";

export async function runStream(
  body: RunRequest,
  onEvent: (e: StreamEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch("/api/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (!res.body) throw new Error("No response body");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buffer.indexOf("\n\n")) !== -1) {
      const raw = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      const dataLine = raw.split("\n").find((l) => l.startsWith("data:"));
      if (!dataLine) continue;
      try {
        onEvent(JSON.parse(dataLine.slice(5).trim()) as StreamEvent);
      } catch {
        // ignore parse errors on keepalive
      }
    }
  }
}

/**
 * Play a cached fixture stream to simulate the backend — used when
 * ?fixture=1 is present so the frontend can run end-to-end offline.
 */
export async function playFixture(
  events: StreamEvent[],
  onEvent: (e: StreamEvent) => void,
  stepMs = 220,
): Promise<void> {
  for (const e of events) {
    onEvent(e);
    await new Promise((r) => setTimeout(r, stepMs));
  }
}
