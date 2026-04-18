# 06 — Demo Clips

Three pre-selected YouTube URLs drive the preset buttons. You MUST pick three that meet these criteria before minute 50 of the hackathon. If you don't, the live demo relies on a single fixture, which is riskier.

## Curation criteria (non-negotiable)

1. **Auto-captions available** — test by opening the video and clicking the CC button. If no CC, skip.
2. **Length 3–8 minutes** — shorter than 3 is too thin; longer than 8 pushes transcript over budget.
3. **Specific verifiable facts** — at least 2 of: a unit (e.g. "101st Airborne"), a named place (e.g. "Carentan"), a specific date, a specific operation (e.g. "Market Garden").
4. **Emotional hooks** — a moment of fear, loss, love, or humor the veteran describes clearly. This is what the Narrator will lean on.
5. **Clear audio** — if captions are full of `[inaudible]` or `[music]`, skip.
6. **Speaker identifiable** — name and (ideally) branch/unit stated early.
7. **Public testimony, reputable channel** — prefer these sources over random uploads:

## Recommended source channels

| Source                                             | Why                                                    | YouTube handle                                                                                         |
| -------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| **Library of Congress — Veterans History Project** | Gold standard. Public record, released for public use. | [@librarycongress](https://www.youtube.com/@librarycongress) · also their VHP website links to YouTube |
| **The National WWII Museum (New Orleans)**         | Large curated interview library                        | [@WWIIMuseum](https://www.youtube.com/@WWIIMuseum)                                                     |
| **WWII Foundation (Tim Gray Media)**               | Hundreds of vet interviews                             | [@WWIIFoundation](https://www.youtube.com/@WWIIFoundation)                                             |
| **StoryCorps**                                     | Short, well-edited, always captioned                   | [@StoryCorps](https://www.youtube.com/@StoryCorps)                                                     |
| **Witness to War Foundation**                      | Focused oral history archive                           | [@WitnesstoWar](https://www.youtube.com/@WitnesstoWar)                                                 |
| **Drive On Podcast** / similar                     | Modern-produced vet interviews                         | (search their channel)                                                                                 |

## Search strategy (do this in minute 45-50)

Open YouTube and try these queries. For each, scrub to confirm captions + clarity:

```
"WWII veteran interview" D-Day 101st
"WWII veteran interview" Pacific Iwo Jima
"WWII veteran interview" Bulge 3rd Army
"WWII veteran oral history" nurse USO 1944
"WWII veteran" Battle of the Bulge specific
"WWII veteran" Pearl Harbor survivor
"WWII veteran" Tuskegee Airmen
Library of Congress Veterans History Project YouTube [name of battle]
```

You want **three** veterans from **different theaters** so the demo feels curated and the presets look intentional:

- **Preset 1** — European Theater (D-Day / Normandy / Bulge)
- **Preset 2** — Pacific Theater (Guadalcanal / Iwo Jima / Okinawa)
- **Preset 3** — Home front or non-combat (nurse, USO, Merchant Marine, Women's Army Corps, Tuskegee Airmen)

The diversity signals taste and respect. Don't ship three white infantrymen.

## For each clip, record

Paste into `src/fixtures/index.json` once you've picked:

```json
{
  "norman-duncan": {
    "youtubeUrl": "https://www.youtube.com/watch?v=XXXXXX",
    "title": "Norman Duncan · D-Day · 101st Airborne",
    "speaker": "Norman Duncan",
    "text": "[full captions text, flattened to a single string]",
    "durationSec": 412
  },
  "hannah-rivera": { ... },
  "tom-okada": { ... }
}
```

The fixtures let you demo even if the YouTube fetch fails live. **Pre-cache them.** Fetch once in dev, write to disk, commit.

## Ethical framing (include in the Devpost + demo)

- These testimonies are publicly posted. The speakers consented to preservation; we're making that preservation usable for descendants.
- Credit every source by channel in the Devpost and in a small footer on the landing page ("Testimonies sourced from the Library of Congress Veterans History Project and the National WWII Museum").
- No AI-generated imagery of the veterans themselves. Period photos only, from public-domain / government archives, with credit captions.
- No synthesized voice. Speech stays in its original video.

## Backup plan

If curation takes too long or all three candidates fail the caption test, fall back to:

- One clip + the same clip played "three ways" (different prompts/treatments) to show depth.
- Or: embed the fixture JSON straight into the preset buttons and skip live YouTube fetch entirely. The demo still works.

The goal is a clean demo, not a flex on live fetching. Cached is fine.
