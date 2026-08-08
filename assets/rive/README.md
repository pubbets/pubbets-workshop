# Pubbet Rive source art

`pubbet-base.svg` is the locked 2026 blank puppet base for the new app. Its approved visual source is page 3 of the Canva file `2026 ASSETS OUTFITS & SHOES` (`DAHRnSvPYPE`). Its body shapes use a neutral white fill so Rive can apply the customer-selected colour at runtime. It has a transparent canvas and simple fills and strokes that import cleanly into Rive.

This base replaces the older CPB-copy body proportions. Future clothing, hair, glasses, shoes, and accessories should be fitted to this 2026 base, even if their thumbnails still show human-style garments or older source shapes.

The riggable parts have stable IDs: head and ears, torso, separate arms and hands, and separate legs and feet. Suggested pivot positions are recorded in `pubbet-base.rig.json`.

The mouth cavity, mouth shadow, and tongue remain editable vector paths, but they live inside the `static_mouth` group and do not need bones or animation controls.

Recommended import order:

1. Import the SVG into a 1280 × 1280 Rive artboard.
2. Confirm that the named groups remain separate.
3. Place bones and pivots using the rig manifest.
4. Add eyes, nose, hair, clothing, shoes, and accessories as layers above this base.
5. Bind every white body-part fill to one shared Rive colour property instead of duplicating the full rig for every body colour.

## Body colour values

The approved customer palette is recorded in `pubbet-base.rig.json` under `bodyColours`:

- Dark Green — `#006553`
- Caramel Brown — `#B9843C`
- Yellow — `#FBEE01`
- Light Orange — `#E6B327`
- Blue — `#58AAD6`
- Light Purple — `#BCAFD2`
- Pink — `#EF9DC3`
- Beige — `#F3DABB`
- Green — `#7BAA37`

White (`#FFFFFF`) is the neutral authoring fill and is not a customer colour option.

The SVG deliberately avoids gradients, masks, filters, raster images, and embedded fonts.

## Colour choice buttons

The body colour choice buttons/swatches should be Rive/vector assets, not separate raster images for each colour. Create one neutral colourable fleece swatch/button and bind its fill to the selected body colour value.

Normal app interface buttons, such as OK?, Next, Back, Randomise, Reset, Sound, and Save, are UI artwork and can stay as transparent raster PNGs. They do not need to be rebuilt in Rive unless we later decide they need animation or runtime recolouring.

## Garments

Rive-ready clothing masters live in `garments/`. Start with `garments/t-shirt-base.svg`; its colourable panels, pivots, layer order, and safe print area are documented in `garments/t-shirt-base.rig.json`.
