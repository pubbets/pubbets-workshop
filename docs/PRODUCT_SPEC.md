# Pubbets Workshop v1.0 — Product Specification

This document is the local implementation source of truth. It consolidates the
Google Drive Decisions Log, Changelog, catalog generator, and four vision-board
screens reviewed on 2026-08-06.

## Product direction

- Replace the legacy Shopify Custom Product Builder and the later Three.js prototype.
- Build a mobile-first, tactile workshop experience with nine guided steps.
- V1 uses transparent PNG artwork layered over one fixed puppet canvas.
- Animate the assembled puppet as a single preview for slides, zooms, entrances,
  exits, selection reactions, and the final celebration.
- Rive is postponed and is not a V1 dependency or app engine.
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
9. Review finished build

## Launch behavior

- Every change updates the preview immediately.
- Reset, randomize, sound toggle, next/back navigation, progress, and pricing work
  without a network connection after the app has loaded.
- Selections persist in the browser.
- The V1 review step is read-only. There is no JSON build-sheet export.
  Build-sheet buttons and downloads are postponed.
- Future build-sheet v2 should generate a customer/admin visual build sheet in
  the handmade Pubbets tracking-sheet style: customer details, order number,
  start date, final puppet preview, selected features/garments, production notes,
  and Pubbets branding. The customer version can support welcome emails; the
  admin version can support order tracking and fulfilment.
- Checkout stays off. Workshop totals are estimates only and must not be
  presented as chargeable. Real Shopify checkout is enabled only after base
  and add-on variant IDs are mapped and tested.

## Catalog

`scripts/generate-data.cjs` is the source for the eight category files under
`src/data/`. Current generated JSON total: 409 records.

The 14-day workshop preview is a look-don't-buy closed beta. The in-app
catalog is the frozen 41-option kit in `src/data/betaKit.ts` and
`docs/BETA_KIT.md`. The generator can still write the full JSON set. Restore
the 409-record UI later by setting `BETA_KIT_ENABLED` to `false`.

## PNG layer contract

- One transparent PNG per selectable visual option.
- Use the same master canvas, puppet scale, centre point, and neutral front-facing pose.
- Export assets already positioned for the base puppet; do not tightly crop individual layers.
- Preserve transparency and export at 2x display resolution where practical.
- The shared blank body is `assets/puppet/body-base.png`, tinted in-app with the
  nine customer body colours.
- Layer order is: body, outfit, shoes, hair, eyes, glasses, nose, extras.
- Thumbnails may be generated from the same master art, but the preview uses the
  full-size aligned PNG layer.
- The preview may scale or gently reshape a layer during fitting, without changing
  the source option ID or pricing data.
- Whole-puppet motion belongs to the preview container, so all selected layers move together.
- Existing `riveArtboardRef` fields are legacy compatibility data and are ignored by V1.

## Drive references

- Project root: https://drive.google.com/drive/folders/1t0aOcLQ7unTpAj4tJlvtawDx8_wzGEfI
- Vision board: https://drive.google.com/drive/folders/10bNW6ilVm9fJoMvmaKyGA2flTScCejny
- Decisions: https://drive.google.com/file/d/17tKWZZ4xYn2P1SDkAxFq4nVzDQky4tDd/view
- Changelog: https://drive.google.com/file/d/1TddcH3j-Mo3Bz48K6FtZgdw03L-3JE7N/view

## Known inputs still required

- Final aligned transparent PNG layers for catalog records that currently use a
  generated fallback tile or SVG placeholder.
- Shopify store domain plus base/add-on variant mapping.
