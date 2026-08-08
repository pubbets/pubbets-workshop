# Pubbets Workshop UI assets

This folder holds custom interface art for the app.

## Backgrounds

- `backgrounds/home-pegboard-background.png` - title/home screen background.
- `backgrounds/workshop-stage-background-source.jpg` - preferred warm workshop stage background for Step 1 Body Colour and builder preview scenes. It has a clear central display area and round wooden plinth for the puppet preview.

## Buttons

Source artwork lives in `buttons/`.

Final app interface buttons should be transparent raster PNGs, not Rive assets. The button art uses wood grain, fleece texture, stitching, highlights, and soft shadows, so PNG is the preferred production format for normal UI controls.

The exception is the body colour choice buttons/swatches. Those should be built as Rive/vector colourable assets so the same swatch can be recoloured for the nine approved body colours.

Current saved source files:

- `buttons/ui-button-back-source.png` - supplied Back button artwork.
- `buttons/ui-button-complete-tick-source.png` - supplied completed step tick badge artwork.
- `buttons/ui-button-ok-source.png` - supplied OK? confirm button artwork.
- `buttons/ui-button-next-source.png` - supplied Next button artwork.
- `buttons/ui-button-no-thanks-source.png` - supplied No Thanks button artwork.
- `buttons/ui-button-randomise-square-source.png` - supplied square randomise dice button artwork.
- `buttons/ui-button-randomise-wide-source.png` - supplied wide home-screen randomise button artwork.
- `buttons/ui-button-reset-source.png` - supplied Reset button artwork.
- `buttons/ui-button-save-build-sheet-source.png` - supplied Save Build Sheet button artwork.
- `buttons/ui-button-sound-off-source.png` - supplied sound muted button artwork.
- `buttons/ui-button-sound-on-source.png` - supplied sound on button artwork.
- `buttons/ui-button-start-building-source.png` - supplied Start Building button artwork.
- `buttons/ui-button-undo-source.png` - supplied Undo / Restore Previous button artwork.
- `buttons/ui-button-skip-this-step-source.jpg` - supplied Skip This Step button artwork.

These source images are saved for reference. Before wiring them into the app UI, export app-ready raster PNG versions with transparent backgrounds, preferably:

- `buttons/ui-button-back.png`
- `buttons/ui-button-complete-tick.png`
- `buttons/ui-button-ok.png`
- `buttons/ui-button-next.png`
- `buttons/ui-button-no-thanks.png`
- `buttons/ui-button-skip-this-step.png`
- `buttons/ui-button-randomise-square.png`
- `buttons/ui-button-randomise-wide.png`
- `buttons/ui-button-reset.png`
- `buttons/ui-button-save-build-sheet.png`
- `buttons/ui-button-sound-off.png`
- `buttons/ui-button-sound-on.png`
- `buttons/ui-button-start-building.png`
- `buttons/ui-button-undo.png`

Temporary renamed exports are also saved as JPGs:

- `buttons/ui-button-back-export.jpg`
- `buttons/ui-button-complete-tick-export.jpg`
- `buttons/ui-button-next-export.jpg`
- `buttons/ui-button-ok-export.jpg`
- `buttons/ui-button-randomise-square-export.jpg`
- `buttons/ui-button-randomise-wide-export.jpg`
- `buttons/ui-button-reset-export.jpg`
- `buttons/ui-button-save-build-sheet-export.jpg`
- `buttons/ui-button-sound-off-export.jpg`
- `buttons/ui-button-sound-on-export.jpg`
- `buttons/ui-button-start-building-export.jpg`
- `buttons/ui-button-undo-export.jpg`

These JPG exports are useful for layout testing, but final app art should still be transparent PNG so the buttons sit cleanly over the workshop background.

Canva SVG exports are saved as the current app-ready UI button files:

- `buttons/ui-button-back.svg`
- `buttons/ui-button-complete-tick.svg`
- `buttons/ui-button-next.svg`
- `buttons/ui-button-ok.svg`
- `buttons/ui-button-randomise-square.svg`
- `buttons/ui-button-randomise-wide.svg`
- `buttons/ui-button-reset.svg`
- `buttons/ui-button-save-build-sheet.svg`
- `buttons/ui-button-sound-off.svg`
- `buttons/ui-button-sound-on.svg`
- `buttons/ui-button-start-building.svg`
- `buttons/ui-button-undo.svg`

These Canva SVGs contain embedded PNG artwork. That is acceptable for UI buttons because they preserve the removed background and are easy to place in the app. Do not treat them as Rive-ready vector path assets.

Still missing as an app-ready export:

- `buttons/ui-button-skip-this-step.svg` or `buttons/ui-button-skip-this-step.png`

Only create SVG/Rive versions for UI art if the asset needs runtime recolouring, path editing, or animation. Standard navigation/action buttons should remain transparent PNGs.

## Button set status

The main raster UI button source set is complete. Next step is to export or create transparent-background app-ready PNGs, then wire those final PNGs into the React UI.

Optional later additions:

- Small icon-only forward arrow, if the wide Next button feels too large for compact toolbar use.
- Separate small icon-only back arrow, if the wide Back button feels too large for compact toolbar use.
