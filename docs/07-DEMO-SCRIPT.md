# 07 — Demo Script (60 seconds)

> One of you reads this aloud while the other drives the screen. Rehearse twice before submitting.

## The setup (5 sec before mic on)

- App loaded at `http://localhost:3000` (or the live Vercel URL)
- Three preset buttons visible
- Console closed; address bar clean

## The beats

**[0:00 — 0:08] The hook. Eyes on camera.**

> "There are about 100,000 World War Two veterans alive today. At the rate they're dying, there will be essentially none by 2030. Their stories are on YouTube — unwatched, unread, unreachable by the great-grandchildren they're actually for."

**[0:08 — 0:12] The gesture. Click the preset.**

> "Lantern turns a YouTube URL into a letter."

_(Click Preset 1 — "Norman Duncan · D-Day · 101st Airborne")_

**[0:12 — 0:25] The agents come alive.** _(Frontend animates: Excavator panel fills with fragments, Fact-Weaver shows a web-search citation, Memory-Graph grows nodes, Narrator shows a "thinking…" trace.)_

> "Four Claude agents run in parallel. One pulls out story fragments. One fact-checks against the National Archives via web search. One builds a graph of every person, place, and unit he mentions. The fourth — using extended thinking — writes the letter in his voice."

**[0:25 — 0:40] The thinking trace lands.** _(Narrator panel shows a visible thinking step: "weighing whether he'd say 'scared' or 'a kind of numb'…")_

> "Watch that. The model is reasoning about his voice, not hallucinating it. Every claim in the final letter gets a footnote and a source."

**[0:40 — 0:55] The letter renders.** _(LetterRender panel scrolls into view. Sepia card, serif type, period photo inline, footnote superscripts visible.)_

> _(Read softly, slowly — one sentence only.)_
> "'Dear child I will never meet — you were twelve when I was twelve, and the war was sixty years past for you. I want to tell you about the morning it rained on us in Normandy…'"

_(Pause. Let it breathe.)_

**[0:55 — 1:00] The close.**

> "Lantern. Before the last voice goes quiet."

_(Cut.)_

## Rehearsal notes

- The silent pause at 0:54 after the letter sentence is the whole demo. Do not fill it with words.
- Do NOT say "powered by AI" or "leveraging LLMs". You're telling a story, not selling a product.
- Do NOT read the whole letter. One line is the point — the rest is implied by the render.
- Do NOT explain the agents as an architecture diagram. Show them lighting up, name what they do in one clause each.

## If something breaks mid-demo

| Failure                | Recover                                                                     |
| ---------------------- | --------------------------------------------------------------------------- |
| Transcript fetch fails | Click a different preset (fixtures cached)                                  |
| Claude API times out   | Restart the run; keep narrating the problem statement                       |
| UI freezes             | Hard refresh, click preset 2, say "let's try another voice"                 |
| Letter looks bad       | Close laptop. Say "here's the other one" and show a pre-rendered screenshot |

## Screenshots you MUST take before the demo window

- Finished letter from preset 1 (full-page)
- Agent trace mid-run (all 4 panels active)
- Entity graph populated
- Three YouTube thumbnails for the Devpost

Save them in `public/demo/`. If the live demo falls apart, you have backup images for the Devpost and a recording.

## Recording tips

- Record at 1920x1080 or higher
- Use a clip-on mic or record audio separately and overlay
- Record the whole 60 seconds in one take — don't edit mid-sentence
- Upload to YouTube (unlisted) or to Devpost directly as an MP4 ≤ 3 min
