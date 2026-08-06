# Pubbet Rive source art

`pubbet-base.svg` is a clean vector reconstruction of the supplied purple base-layer reference. Its body shapes use a neutral white fill so Rive can apply the customer-selected colour at runtime. It has a transparent canvas and simple fills and strokes that import cleanly into Rive.

The riggable parts have stable IDs: head and ears, torso, separate arms and hands, and separate legs and feet. Suggested pivot positions are recorded in `pubbet-base.rig.json`.

The mouth cavity, mouth shadow, and tongue remain editable vector paths, but they live inside the `static_mouth` group and do not need bones or animation controls.

Recommended import order:

1. Import the SVG into a 1280 × 1280 Rive artboard.
2. Confirm that the named groups remain separate.
3. Place bones and pivots using the rig manifest.
4. Add eyes, nose, hair, clothing, shoes, and accessories as layers above this base.
5. Bind every white body-part fill to one shared Rive colour property instead of duplicating the full rig for every body colour.

The SVG deliberately avoids gradients, masks, filters, raster images, and embedded fonts.
