# Pubbets Workshop v1.0

A mobile-first, nine-step custom puppet builder based on the approved Google
Drive decisions and vision-board screens.

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

This validates the generated 402-record catalog, pricing behavior, TypeScript,
and the production bundle.

## Project structure

- `src/App.tsx` — nine-step flow and persistent selection state
- `src/components/PuppetPreview.tsx` — animated SVG fallback and Rive handoff boundary
- `src/data/*.json` — generated launch catalog
- `scripts/generate-data.cjs` — Drive-sourced catalog generator
- `docs/PRODUCT_SPEC.md` — implementation source of truth
- `assets/thumbnails/` — available production thumbnail subset

## Known production inputs

- Approved `.riv` file and state-machine input names
- Remaining final thumbnails/textures
- Shopify base and add-on variant mapping

The review screen exports a JSON build sheet until checkout can be connected
without risking a mismatch between the displayed total and the charged amount.
