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

## 2026-08-26 — Add a responsive exterior entrance before the home screen

The app opens outside a fantasy handcrafted Pubbets Workshop. Tapping the large
central door is the intentional user gesture that unlocks audible theme music on
mobile browsers, followed by a short move-through-the-door transition into the
existing interior home screen.

- Use one landscape exterior composition for desktop and landscape tablets.
- Use a 4:5 tablet portrait composition for iPad-like browser viewports.
- Use a taller matching portrait composition for phones.
- Do not create separate images for individual device models.
- Show the exterior once per app load; returning home from the builder goes to
  the interior home screen.
- Saved builds are out of scope.
- Easter eggs are postponed. Seasonal visual overlays such as snow may be added
  later without replacing the base exterior artwork.

## 2026-08-26 — Keep the interior home screen ready for a featured puppet

The interior home screen uses a clear top-centre-bottom composition: the
Pubbets Workshop logo stays at the top, an open stage occupies the centre, and
the Start Building and Randomise actions stay together at the bottom.

- The centre remains visually open until the final aligned body, clothing, and
  feature artwork is ready.
- That centre stage will later show a randomly changing assembled puppet.
- The wide Randomise button uses the same light wood border treatment as the
  Start Building button.

## 2026-08-28 — Locked the V1 blank puppet base from the app graphics Canva file

The approved V1 blank puppet base is now page 2 of the Canva file
`NEW 2026 PUBBETS WORKSHOP APP GRAPHICS`.

- Treat this page as the current visual source of truth for the base puppet.
- Page 2 was revised again on 2026-08-29; use the latest page 2 artwork rather
  than earlier screenshots or exported drafts.
- Use this base for future full-body overlays, close-up overlays, and asset
  fitting decisions.
- The base should remain a clean blank puppet: no eyes, nose, hair, glasses,
  clothes, shoes, or accessories baked into the permanent body layer.
- Older generated body drafts and the old Rive base notes are superseded for V1
  production decisions.
- The V1 app may still use app-applied body colour tinting until final aligned
  colour body PNGs are exported from the approved Canva base.

## 2026-08-30 — Production V1 base PNG is the live workshop preview

The approved blank puppet is page 2 of the Canva file
`PUBBETS WORKSHOP ASSETS 2000x3000` (`DAHRnSvPYPE`). That page is saved
losslessly as `assets/puppet/body-base.png` (2000 × 3000 RGBA, true
transparency, off-white fill, red open mouth, no eyes/nose/hair/clothes/shoes).

- The builder preview uses this PNG as the body/base layer on the wooden plinth.
- The nine customer body colours are app tints of this one base. White is not a
  customer colour; an unselected body shows the untinted artwork.
- Feature, garment, shoe, and extra overlays may stay as placeholders on top
  until aligned option PNGs exist. They must not replace this body PNG.
- Older SVG/Rive body drawings are archive/fallback history only.

## 2026-08-30 — Freeze a closed-beta option kit for the 14-day preview

Testers get a small honest menu, not the 409 generated records.

- Keep the full JSON catalogs. Filter at the `catalog.ts` export with
  `src/data/betaKit.ts`.
- Review stays read-only. Totals stay estimates. No Shopify, save/build-sheet,
  or Rive.
- Show option-card thumbnails only when a file exists under
  `assets/thumbnails/`. Body colour keeps felt swatches.
- Overlay PNGs are still missing. Feature placeholders remain SVG until art
  lands.
