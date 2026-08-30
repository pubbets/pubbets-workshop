# Pubbets Workshop v1.0

A mobile-first, nine-step custom puppet builder based on the approved Google
Drive decisions and vision-board screens.

The 14-day workshop preview is a look-don't-buy closed beta. Testers see a
frozen 41-option kit, not the full generated catalog. Review is read-only.
Totals are estimates. Checkout stays off.

## Run locally

Double-click `start.bat`, or run:

```powershell
npm.cmd install
npm.cmd run dev
```

Open <http://127.0.0.1:8000>.

## Quality checks

```powershell
npm.cmd run check
```

This validates the closed beta kit (41 in-app options), the generated
409-record JSON catalog, pricing behavior, TypeScript, and the production
bundle.

## Project structure

- `src/App.tsx` — nine-step flow and persistent selection state
- `src/components/PuppetPreview.tsx` — layered PNG puppet preview and whole-puppet motion
- `assets/puppet/body-base.png` — approved Canva V1 blank puppet base
- `src/data/*.json` — generated launch catalog (409 records)
- `src/data/betaKit.ts` — frozen 14-day preview allowlist
- `scripts/generate-data.cjs` — Drive-sourced catalog generator
- `docs/PRODUCT_SPEC.md` — implementation source of truth
- `docs/BETA_KIT.md` — frozen preview IDs and substitutions
- `assets/thumbnails/` — available production thumbnail subset

## Known production inputs

- Transparent, puppet-aligned PNG layers for the final character options
- Remaining final thumbnails and full-size puppet layers
- Shopify base and add-on variant mapping

The review step is read-only. There is no JSON build-sheet export and no
checkout. Workshop totals are estimates only until real Shopify variants are
mapped.
