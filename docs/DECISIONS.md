# Pubbets Workshop — Decisions Log

## 2026-08-05 — Reverse-engineered the legacy Pubbets Lab configurator
Found the existing "FIRST VERSION - CPB COPY" project in Google Drive
(puppet-builder-config.js, puppet-builder.js, puppet-builder.css,
puppet-builder.liquid, SHOPIFY-SETUP.md). This is the current live
Shopify Custom Product Builder being replaced.

Key things it does well, worth carrying forward conceptually:
- Every option is a flat metadata record: id, label, image path(s), price
- `layerOrder` array defines visual stacking (body → outfit → hair → eyes → glasses → nose → accessory)
- Nested/multistep flow for Eyes (shape family → sub-style → colour) —
  matches the Eye Studio conditional workflow in the v1.0 brief
- Add-on pricing lives in the metadata (price field per option), not hardcoded

## 2026-08-05 — Restarting the asset taxonomy for v1.0, not porting it as-is
The legacy Outfit category has real complexity: `group` (top/bottom/over/
looks/premium), `subgroup` (tshirt/collar), and `gender` (all/boy/girl)
tags layered together. Decision: rebuild clean rather than reuse this.

For v1.0:
- **Keep**: layering concept (top/bottom/over/looks) — puppets need this
  for the Mix & Match experience
- **Drop for now**: `gender` tagging and `subgroup` — everything ships
  unisex-labeled at launch. Gendered curation, if wanted later, becomes
  a filter on the existing data, not a schema change.
- **Keep**: per-option pricing (some hair, outfits, shoes, accessories
  carry surcharges in the live business model — this is real and stays)

## 2026-08-05 — Asset metadata schema for v1.0

```
{
  id: string,
  label: string,
  category: 'body'|'eyes'|'nose'|'glasses'|'hair'|'outfit'|'shoes'|'accessory',
  group?: 'top'|'bottom'|'over'|'looks'|'premium',   // outfit only
  price?: number,                                      // add-on surcharge if any
  riveArtboardRef: string,        // Rive artboard/component this binds to
  colourBindable: boolean,        // true = tint overlay, false = discrete asset swap
  vectorAssetPath?: string,       // SVG, flat-colour swappable items
  textureAssetPath?: string,      // PNG, patterned garments (gingham/plaid/denim)
  thumbnailPath: string,
  requiredTier?: 'diy'|'curated'|'masterworks'
}
```

## 2026-08-13 — V1 changed from Rive/vector production to layered PNG artwork

Rive conversion was delaying usable production art. V1 will use transparent PNG
layers aligned to a shared puppet canvas. This still supports immediate previews,
layer swaps, fitting adjustments, zooms, slides, transitions, and animation of the
complete assembled puppet.

- Rive is not the V1 app engine and is not required for launch.
- SVG/vector conversion is postponed, not required for asset acceptance.
- UI and navigation remain transparent raster PNG artwork.
- Puppet features, garments, shoes, hair, and extras use transparent aligned PNG layers.
- The base/body may use discrete colour PNGs or an app-applied tint where the result is reliable.
- Old Rive files and metadata remain reference/archive material only.

Current V1 asset fields:

```
{
  id: string,
  label: string,
  category: 'body'|'eyes'|'nose'|'glasses'|'hair'|'outfit'|'shoes'|'accessory',
  group?: string,
  price?: number,
  previewAssetPath?: string,     // full-size transparent aligned PNG
  thumbnailPath?: string,        // selection-button image
  colour?: string,               // body/swatch colour when app tinting is used
  requiredTier?: 'diy'|'curated'|'masterworks'
}
```
