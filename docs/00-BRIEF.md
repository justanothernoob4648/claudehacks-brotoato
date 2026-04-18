# 00 — Project Brief

## The vision

Dario Amodei's _Machines of Loving Grace_ argues that AI's highest calling is to expand what it means to be human — to help people find meaning, create, and leave something behind. **Lantern is that thesis, aimed at the single most urgent cultural-preservation problem we can actually touch in 90 minutes: the last living WW2 veterans.**

~16 million Americans served. ~100,000 are still alive. ~300 die every day. They are, on a measurable timeline, **disappearing**. Their testimonies exist — YouTube, Library of Congress Veterans History Project, StoryCorps, family recordings — but they are long, raw, un-curated, un-reachable. A great-grandchild in 2050 will not sit through a 42-minute oral history. They will, however, read a 600-word illustrated letter from Great-Grandpa.

**Lantern turns a YouTube URL into that letter.**

## The 60-second demo (memorize this)

> "There are about 100,000 WW2 veterans alive today. By 2030 there will be essentially none. Their stories are on YouTube — unread, unreachable. Watch this."
>
> _[Click preset: "Norman Duncan, D-Day, 101st Airborne"]_
>
> _[4 agent panels light up: Excavator, Fact-Weaver, Memory-Graph, Narrator. Tool-call log streams. Web search pulls a 1944 Normandy photo. Entity graph grows.]_
>
> "Four Claude agents — one extracts the fragments, one fact-checks against history, one builds the family graph, one writes in his voice."
>
> _[Illustrated letter renders: "Dear great-grandchild I will never meet…" Period photo. Footnotes: [verified via NARA]]_
>
> "This is what flourishing looks like when machines help us not forget."

## The rubric, re-read as strategy

| Weight | Criterion               | How Lantern wins                                                                                                                                                                   |
| ------ | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 40%    | **Claude Integration**  | 4 agents, hosted web search, extended thinking on Narrator, parallel Fact-Weaver + Memory-Graph, visible tool-call trace in UI. Judges _see_ the depth, not just hear us claim it. |
| 30%    | **Impact & Usefulness** | Concrete, measurable, time-urgent problem. Every judge knows someone in that generation or has lost one.                                                                           |
| 20%    | **Technical Execution** | Scoped tight: one page, one API route, SSE for streaming, no auth, no DB.                                                                                                          |
| 10%    | **Presentation**        | Illustrated letter render is the closer. Read one line aloud, sit silent, then show the GitHub + Devpost.                                                                          |

## Hard constraints (read twice)

1. **90 minutes total**. This is not a stretch goal.
2. **2 normal-ability builders**, no specialized users recruited.
3. **Must be demo-able on stage** — no live telephony, no "4 weeks later" theater. Everything the judge sees happens in real time or pre-cached.
4. **GitHub + Devpost submission required.**

## What we are NOT building (say no, stay in scope)

- No voice chat. No live-microphone interview. YouTube URL input only.
- No user accounts, no save-to-cloud, no history. One session per page load.
- No image generation. Use real public-domain photos via web search citations.
- No full audio playback. The transcript is the input; the letter is the output.
- No "simulate the dead person" chat. The Narrator writes _as_ the veteran because the veteran's words are the source. No recipient-reply, no séance.

## What makes this different from the 50 other hackathon "AI memoir" tools

- **Source**: existing public testimony, not a live interview we can't actually stage.
- **Output artifact**: an illustrated _letter_, not a chat log — a thing you print and keep.
- **Depth**: 4-agent pipeline with visible tool use, not a single prompt to GPT.
- **Verification**: every claim in the letter has a citation footnote. Judges trust it.
- **Urgency**: every other memoir tool pretends to be universal. We name the deadline.
