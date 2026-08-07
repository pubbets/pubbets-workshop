# Rive garment source art

`t-shirt-base.svg` is the master plain T-shirt fitted to the 1280 × 1280 Pubbet base. It follows the simple crew-neck, short-sleeve silhouette in the approved Canva reference while using clean vector paths instead of raster artwork.

The three colourable panels are `shirt_body`, `left_sleeve`, and `right_sleeve`. Bind all three fills to the shared Rive property `tshirtColor`; the seam paths remain static dark outlines. The shirt is white only as a neutral authoring colour, so colour variants do not need separate SVG files.

Recommended Rive layer order:

1. Pubbet body and limbs.
2. Left and right T-shirt sleeves attached to their matching upper-arm bones.
3. T-shirt body attached to the torso bone.
4. Collar, cuff, and hem seam paths.
5. Optional vector garment graphic, clipped or manually contained within the print area in `t-shirt-base.rig.json`.

The SVG avoids gradients, masks, filters, raster images, and fonts. Garment graphics from Canva must be rebuilt as vector paths before adding them to this master.

## First printed garment

`t-shirt-pink-bunny-repeat.svg` is the first completed graphic garment. It reconstructs the repeated bunny-character motif from page 63 of the supplied Canva outfit design as direct vector shapes. The torso and sleeve print groups have their own stable IDs so they can follow the corresponding Rive garment panels.
