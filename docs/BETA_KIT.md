# Closed beta kit

This is a look-don't-buy 14-day workshop preview. Testers see this frozen
allowlist, not the full 409-record generated catalog.

The eight JSON files under `src/data/` still hold every generated record.
`src/data/betaKit.ts` is the single allowlist. `src/data/catalog.ts` filters
that list at the app export so `scripts/generate-data.cjs` can keep writing
the full set.

To restore the full in-app catalog later, set `BETA_KIT_ENABLED` to `false`
in `src/data/betaKit.ts` (or remove the filter in `catalog.ts`).

Review is read-only. Totals are estimates. Checkout, save, build-sheet
export, Shopify, and Rive stay off.

## Frozen IDs

| Category | Count | IDs |
| --- | ---: | --- |
| Body | 9 | dark-green, caramel-brown, light-purple, blue, green, yellow, light-orange, pink, beige |
| Eyes | 4 | round-45-flat-plain, round-45-flat-pink-lashes, oval-65x40-flat-plain, beady-big-black |
| Nose | 6 | round-medium-caramel-brown, round-medium-light-pink, triangle-small-brown, triangle-small-pink, human-medium-caramel-brown, human-medium-light-pink |
| Glasses | 4 | round-thin-black, square-thin-tortoiseshell, buggy-yellow, round-thick-black-xl |
| Hair | 6 | round-base-black, round-base-yellow, messy-brown, side-part-pink, afro-black, wavy-blonde |
| Outfit | 6 | blue-gingham-dress, black-t, blue-jeans, pink-pajamas, premium-tuxedo, denim-overalls |
| Shoes | 4 | black, red, brown-loafers, shiny-black-bows |
| Accessory | 2 | arm-rods-2pcs, extendable-arm-rods-2pcs |

App catalog total: **41**. Generated JSON total: **409**.

## Substitutions

- Triangle noses have no medium SKUs (small and large only). Closest triangle
  pair: `triangle-small-brown` and `triangle-small-pink`.
- Medium round and human noses have no `pink` colour. Closest pink:
  `light-pink`. Warm skin/brown uses existing `caramel-brown`.
- Human exists, so oblong was not used as a shape substitute.

No IDs were invented.

## Art still missing

- Overlay PNGs for eyes, nose, glasses, hair, outfits, shoes, and extras are
  still missing. Feature placeholders stay SVG until aligned art lands.
- Option-card thumbnails are shown only when a file exists under
  `assets/thumbnails/`. Body colour keeps felt swatches. Hair, shoes, extras,
  beady eyes, oval eyes, and denim overalls currently have no thumbnail file.
