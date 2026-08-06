# Pubbets Workshop v1.0 — Product Specification

This document is the local implementation source of truth. It consolidates the
Google Drive Decisions Log, Changelog, catalog generator, and four vision-board
screens reviewed on 2026-08-06.

## Product direction

- Replace the legacy Shopify Custom Product Builder and the later Three.js prototype.
- Build a mobile-first, tactile workshop experience with nine guided steps.
- Use Rive for the final puppet animation. Until the approved `.riv` file exists,
  the app uses an animated SVG fallback behind a stable preview component boundary.
- Keep option metadata flat and prices data-driven.
- Keep outfit layering: `top`, `bottom`, `over`, `looks`, and `premium`.
- Do not add gender or subgroup filters in v1.0.
- Keep all launch labels unisex.

## Nine-step flow

1. Body colour
2. Eye Studio
3. Nose
4. Glasses
5. Hair
6. Outfit
7. Shoes
8. Extras
9. Review and save build

## Launch behavior

- Every change updates the preview immediately.
- Reset, randomize, sound toggle, next/back navigation, progress, and pricing work
  without a network connection after the app has loaded.
- Selections persist in the browser.
- The review step exports a production build sheet as JSON.
- Checkout must not claim an estimated price is chargeable. Real Shopify checkout
  is enabled only after base and add-on variant IDs are mapped and tested.

## Catalog

`scripts/generate-data.cjs` is the source for the eight category files under
`src/data/`. Current generated total: 402 records.

## Rive handoff contract

The final Rive file should expose the artboard/component references already stored
in catalog metadata (`riveArtboardRef`). The UI passes selected asset IDs, body and
bindable colours, preview mode, and a celebration trigger to `PuppetPreview`.
Replacing the SVG fallback must not alter wizard or pricing state.

## Drive references

- Project root: https://drive.google.com/drive/folders/1t0aOcLQ7unTpAj4tJlvtawDx8_wzGEfI
- Vision board: https://drive.google.com/drive/folders/10bNW6ilVm9fJoMvmaKyGA2flTScCejny
- Decisions: https://drive.google.com/file/d/17tKWZZ4xYn2P1SDkAxFq4nVzDQky4tDd/view
- Changelog: https://drive.google.com/file/d/1TddcH3j-Mo3Bz48K6FtZgdw03L-3JE7N/view

## Known inputs still required

- Approved `.riv` puppet file and its state-machine/input names.
- Final production thumbnails/textures for catalog records that currently use a
  generated fallback tile.
- Shopify store domain plus base/add-on variant mapping.
