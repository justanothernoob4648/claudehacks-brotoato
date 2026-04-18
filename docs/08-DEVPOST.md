# 08 — Devpost Submission Template

> Paste these fields into Devpost's form. Replace `{{bracketed}}` values. Keep the voice: warm, specific, not salesy.

## Project name

**Lantern**

## Tagline (140 char max)

> Turning vanishing voices into letters for the future. 4 Claude agents transform a WW2 veteran's YouTube testimony into an illustrated heirloom letter.

## Inspiration

We started from Dario Amodei's _Machines of Loving Grace_ — specifically the idea that AI's highest calling is to expand what it means to be human, to help people find meaning and leave something behind.

Then we looked at a number: there are about 100,000 World War Two veterans alive in the United States today. There were 16 million. They are dying at roughly 300 per day. By 2030, essentially none will remain.

Their testimonies exist. Thousands of hours of them — the Library of Congress Veterans History Project alone has 110,000+ interviews. But a 42-minute oral history is not a thing a great-grandchild in 2045 will ever sit down to watch. A 600-word illustrated letter is.

Lantern is the bridge between the oral history that exists and the heirloom that doesn't.

## What it does

Paste a YouTube URL of a veteran's testimony. Four Claude agents run in parallel:

1. **Story-Excavator** reads the transcript and extracts 20-40 atomic fragments — memories, places, people, dates, emotions, verbatim quotes.
2. **Fact-Weaver** verifies the historical claims against the web (NARA, Library of Congress, the National WWII Museum) using Claude's hosted web search tool, and pulls public-domain period imagery.
3. **Memory-Graph** builds a typed entity graph of every named person, place, unit, and event — using Haiku 4.5 for fast tool-use.
4. **Narrator** composes the letter with extended thinking enabled, in the veteran's own cadence, addressed to a descendant they will never meet.

The result is a short illustrated letter with footnoted citations. It renders in the browser. You can print it.

## How we built it

- Next.js 16 App Router + React 19 + Tailwind 4 on Vercel
- `@anthropic-ai/sdk` with Sonnet 4.6 (Excavator, Fact-Weaver, Narrator) and Haiku 4.5 (Memory-Graph)
- Anthropic hosted `web_search` tool for Fact-Weaver
- Extended thinking on the Narrator — visible in the live UI trace
- `youtube-transcript` for caption ingestion
- Server-Sent Events (POST + ReadableStream) to stream every tool call to the UI
- Parallel agent execution via `Promise.all` (Fact-Weaver + Memory-Graph)
- No database, no auth, no image generation — every image is sourced and credited from public-domain archives

## What we learned

- **Streaming tool calls is the product.** Judges seeing 4 agents light up in parallel makes the depth legible. A single prompt answering, no matter how good, reads as a chatbot. A tool-use trace reads as software.
- **Extended thinking is demo gold.** Watching the Narrator deliberate about whether the veteran would say "scared" or "a kind of numb" was the emotional hinge of the whole demo.
- **The honest constraint made the idea.** We started thinking about grief and the dead. We ended up honoring the _living_ — the still-breathing 100,000 — because that's what we could actually reach in 90 minutes, and because séance is the wrong register for an Anthropic hackathon. Our skeptic judges were right.

## Challenges

- Next.js 16 ships breaking changes vs. our training data. Had to read the shipped docs in `node_modules/next/dist/docs/` before writing the route handler.
- Keeping the Narrator honest: no invented biography. Solved with a hard prompting principle and by feeding it only verified facts + transcript-derived fragments.
- Parallel SSE ordering — ensuring fragment events land before fact events. Solved with a simple staged orchestrator.

## What's next

- More theaters, more wars, more generations. The pipeline isn't WW2-specific.
- Import paths beyond YouTube — Veterans History Project WAV files, family home videos.
- An optional live interview mode for families who have a living grandparent _and_ 40 minutes this weekend.
- Printed output — a real physical letter mailed to the family, once per quarter.

## Built with

`typescript` · `react` · `next.js` · `tailwindcss` · `@anthropic-ai/sdk` · `youtube-transcript` · `anthropic-claude-sonnet-4.6` · `anthropic-claude-haiku-4.5` · `vercel`

## Try it out

- **Live app**: {{vercel-url}}
- **GitHub**: {{github-url}}
- **Demo video**: {{youtube-unlisted-url}}

## Team

- {{Your name}} — frontend, letter render, demo script
- {{Partner's name}} — backend, agent orchestration, prompts

## Credits

Testimonies sourced from:

- Library of Congress Veterans History Project
- The National WWII Museum (New Orleans)
- WWII Foundation
- {{other specific channels used}}

Imagery sourced from the National Archives and Records Administration (NARA) and Wikimedia Commons, all public domain. Full credits in-app.
