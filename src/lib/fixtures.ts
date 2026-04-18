import type { StreamEvent } from "./types";
import sampleNorman from "../fixtures/sample-norman.json";

export const fixtures = {
  "norman-duncan": {
    title: "Norman Duncan · D-Day · 101st Airborne",
    speaker: "Norman Duncan",
    theater: "Europe",
    events: sampleNorman as StreamEvent[],
  },
} as const;

export type FixtureId = keyof typeof fixtures;

export function getFixture(id: string): StreamEvent[] | null {
  return id in fixtures ? fixtures[id as FixtureId].events : null;
}
