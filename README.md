# Fitcheck — Outfit Suggester

A web app that helps you find outfit ideas for a specific occasion.

## Flow

1. **Pick a gender/style direction** — feminine or masculine.
2. **Pick the occasion** — funeral, interview, wedding guest, date night, party, gala, beach, gym, etc.
3. **Pick an aesthetic** (minimalist, streetwear, glam, boho, ...) — or switch to **"Search a favorite piece"**
   to type in something you already own/love (e.g. "leather jacket") and get outfits built around it.
4. **Swipe through fits** — drag right or tap ♥ to save a look, drag left or tap ✕ to see the next one.
   Every card shows each item's brand, color, price, SKU, retailer, and a "Shop" link.
5. **Appropriateness score** — every outfit is rated 0–10 for the chosen occasion. Scores below a great
   match come with plain-language reasons (e.g. "too flashy for a funeral — sequins read as celebratory,
   not somber").
6. **Loved fits** panel (heart icon, top right) collects everything you've saved.

## Notes

- The clothing catalog, prices, and SKUs are sample/demo data — not a live inventory feed. "Shop" links open
  a web search for the item at the listed retailer rather than a specific product page.
- Item "photos" are simple stylized icons (not real product photography), since there's no live catalog to
  pull from.
- The appropriateness score is computed from each outfit's formality/flashiness/coverage attributes against
  each occasion's expectations — see `src/lib/scoring.ts`.

## Development

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check + production build
npm run lint      # oxlint
```
