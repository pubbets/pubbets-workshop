# Base puppet workflow

The current locked V1 base is page 2 of the Canva file `NEW 2026 PUBBETS WORKSHOP APP GRAPHICS`, approved on 2026-08-28.

The older `pubbet-base.svg` was approved from page 3 of the Canva file `2026 ASSETS OUTFITS & SHOES` (`DAHRnSvPYPE`) on 2026-08-07. It is now archive/reference material until rebuilt from the approved V1 Canva page.

Use this workflow if replacing the locked Pubbet base with a newer blank puppet graphic.

## Source image requirements

- Front-facing full body pose.
- High resolution source, ideally square or with clear margins around the puppet.
- Plain or low-clutter background.
- Static open mouth is fine; the mouth and tongue do not need rig controls.
- No clothes, hair, eyes, nose, or accessories baked into the base unless they are intended to be permanent body features.

## Output files

An approved replacement base should update these files together:

- `pubbet-base.svg` - clean vector source art for Rive.
- `pubbet-base.rig.json` - pivots, layer metadata, and colour palette values.

Keep body fills white in the SVG so Rive can recolour the puppet at runtime from the customer-selected palette.

## Required SVG structure

The Rive import should keep these editable groups separate:

- `body_colour`
- `head`
- `left_ear`
- `right_ear`
- `neck`
- `torso`
- `left_arm`
- `right_arm`
- `left_hand`
- `right_hand`
- `left_leg`
- `right_leg`
- `left_foot`
- `right_foot`
- `static_mouth`

The static mouth group may include the red mouth cavity, black mouth shadow, and pink tongue as editable vector paths.

## Validation checklist

Before treating the new base as approved:

- SVG opens cleanly in a browser.
- SVG contains no raster `<image>` elements.
- SVG contains no masks, filters, embedded fonts, or bitmap textures.
- Body fill is neutral white, not a final colour variant.
- All body parts have stable IDs for Rive import.
- Rig manifest JSON parses correctly.
- Garment safe areas are not updated until the new base proportions are approved.

## Asset fitting rule

All new garment and feature SVGs should be fitted to the locked 2026 base. Older CPB/source graphics may be stretched, squashed, repositioned, or path-edited in Rive so they become puppet-fit versions. Thumbnails may remain human-style references; the Rive vector module is the production puppet-fit asset.
