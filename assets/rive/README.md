# Pubbet Rive source art

`pubbet-base-purple.svg` is a clean vector reconstruction of the supplied purple base-layer reference. It has a transparent canvas and simple fills and strokes that import cleanly into Rive.

The major riggable parts have stable IDs: head and ears, torso, separate arms and hands, separate legs and feet, mouth cavity, mouth shadow, and tongue. Suggested pivot positions are recorded in `pubbet-base-purple.rig.json`.

Recommended import order:

1. Import the SVG into a 1280 × 1280 Rive artboard.
2. Confirm that the named groups remain separate.
3. Place bones and pivots using the rig manifest.
4. Add eyes, nose, hair, clothing, shoes, and accessories as layers above this base.
5. Drive the body fill from a colour property instead of duplicating the full rig for every body colour.

The SVG deliberately avoids gradients, masks, filters, raster images, and embedded fonts.
