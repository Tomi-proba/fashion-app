# Outfitter — Fashion Assistant

A web app that helps you put together outfits you'll actually wear. You control the input three
ways — pick a **look** (streetwear, clean minimal, preppy, …), pick an **anchor piece** you own or
want to buy, and say what the outfit **must include / must avoid** — and the generator returns 3–5
ranked outfits from your own wardrobe, each with a plain-English explanation of why it works.

## How it works

- **Wardrobe** — add pieces you own (and optionally a wishlist) with category, colour, material,
  fit, formality (1–5), seasons, and style tags. Accessories (bags, sunglasses, watches, jewelry,
  hats, belts) are first-class items, including an optional metal tone for gold/silver pieces.
- **Generate** — pick a look, an anchor item, must-include/must-avoid items and colours, and an
  optional occasion/season. The generator builds every valid combination from your wardrobe,
  filters out anything that breaks a hard constraint, and scores the rest with a deterministic
  **rules engine** (`src/rules/`) — no LLM call, so it's instant and free.
- **Should I buy this?** — describe a piece you're considering; see how many outfit combinations it
  slots into from your current wardrobe, and whether you already own something similar.
- **Color combos** — a simple reference page showing the palette pairing rules the generator uses.
- **Saved** — heart an outfit from the generator to keep it here.

Profile, wardrobe, and saved outfits are stored in the browser's `localStorage` — there's no
backend, no login, and no data leaves your machine.

## The rules engine is data-driven — tune it without touching code

`src/data/config/*.json` holds every opinionated rule the generator uses:

| File | Controls |
|---|---|
| `colors.json` | which colours count as neutral vs. accent, which accent+neutral pairings are "good", which accent+accent pairs clash, and how gold/silver accessories pair with warm/cool palettes |
| `formality.json` | the 1–5 formality scale, and how far apart two items' formality can be before it reads as a mismatch |
| `styles.json` | the description and fit lean for each look (streetwear, preppy, etc.) |
| `seasons.json` | preferred materials and accessory metal lean per season |
| `occasions.json` | the formality band each occasion (uni, wedding guest, gym, …) expects |

Every one of these files is marked `_comment: "OPINIONATED: ..."` at the point where a real styling
judgment call was made — e.g. gold reads warmer/dressier, an oversized top + oversized bottom is
flagged as shapeless, jeans are treated as a neutral base rather than an accent colour. Change the
JSON, no rebuild logic needed.

The actual scoring logic lives in `src/rules/` (`colorHarmony.ts`, `formality.ts`,
`proportions.ts`, `season.ts`, `constraints.ts`) and is combined in `src/rules/engine.ts`. Hard
constraints (must-include, must-exclude, excluded colours) are enforced in `constraints.ts` and can
never be violated, regardless of score.

Explanations (`src/rules/explain.ts`) are built entirely from which rules fired — there's no LLM
call in this MVP. `src/data/types.ts` and `src/lib/generateOutfits.ts` are written so a real
Claude API call could later replace `explainOutfit()` for richer natural-language text, or handle
"describe this piece" from a free-text description, without touching the rules engine itself.

## Development

```bash
npm install
npm run dev      # start dev server (http://localhost:5173)
npm run build    # type-check + production build
npm run lint      # oxlint
```

On first load you'll see a short onboarding form (all optional). After that, open the **Wardrobe**
tab and click **Load example wardrobe** to populate 17 owned pieces + 1 wishlist item so you can
try the generator immediately.

## Example wardrobe & test cases

`src/data/exampleWardrobe.ts` seeds a wardrobe including the pieces from the original brief (dark
indigo jeans, medium-wash jeans, navy hoodie, white sneakers, gold sunglasses) plus enough variety
to exercise the rules. Some things worth trying once it's loaded:

- **Look only** — Generate → look "Streetwear", no anchor. Should favour the hoodie, chunky
  sneakers, bomber jacket, and the *chunky black* sunglasses over the gold pair.
- **Anchor piece** — Generate → anchor "Dark indigo Levi's 501", no look. Outfits should mix in
  both smart-casual and streetwear tops depending on what else is included.
- **Include/exclude** — Generate → must-include "White leather sneakers", must-avoid colour
  "black". Every result should contain the sneakers and never a black item.
- **Combined** — look "Clean Minimal" + anchor "Gold-frame sunglasses" + avoid colour "red". Should
  lean into the white tee, oxford shirt, and jeans, with the gold sunglasses' warm-tone bonus
  showing up in the explanation.
- **Occasion filter** — Generate → occasion "Wedding guest". Casual pieces (hoodie, sneakers)
  should mostly disappear since they fall outside the occasion's formality band.
- **Proportions flag** — manually add two `oversized`-fit items as top + bottom; the generated
  outfit combining them should carry a "can read shapeless" warning.
- **Should I buy this?** — enter a black outerwear piece with no subcategory. It should flag the
  existing "Black bomber jacket" as a possible duplicate, since they share category + colour.
- **Color combos** — check the reference page: gold leans warm/clean-minimal/dressy/preppy/vintage,
  silver leans cool/streetwear/sporty/clean-minimal, and red+orange, red+pink, etc. are listed as
  clashing pairs.

## Out of scope for this MVP

Payments, shopping links, social features, AI image generation, and automatic photo recognition of
clothing — all per the original brief.
