# Incoming base puppet workflow

Use this workflow when replacing the current placeholder Pubbet base with the final blank puppet graphic.

## Source image requirements

- Front-facing full body pose.
- High resolution source, ideally square or with clear margins around the puppet.
- Plain or low-clutter background.
- Static open mouth is fine; the mouth and tongue do not need rig controls.
- No clothes, hair, eyes, nose, or accessories baked into the base unless they are intended to be permanent body features.

## Output files

The approved final base should replace the current placeholder files:

- `pubbet-base.svg` - clean vector source art for Rive.
- `pubbet-base.rig.json` - pivots, layer metadata, and colour palette values.

Keep body fills white in the SVG so Rive can recolour the puppet at runtime from the customer-selected palette.

## Required SVG structure

The Rive import should keep these editable groups separate:

- `body_colour`
- `head`
- `left_ear`
- `right_ear`
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
