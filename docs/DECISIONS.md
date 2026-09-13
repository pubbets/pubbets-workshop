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

## 2026-09-02 — Nine-step flow confirmed; glasses & arm-rods pricing locked

James confirmed the customer flow includes Hair as its own step, so the build is
**9 steps**: Body → Eyes → Nose → Glasses → Hair → Outfit → Shoes → Accessories
→ Checkout.

- Supersedes: the 8-step list in the handoff brief (HERMES.md), which predates
  this decision.
- Checkout is a new step (the live CPB ends at Add-to-Cart; there is no
  Checkout step to copy).

Pricing locked for the new app:
- **Glasses: $14.95 flat** (all styles, including the Bling XL).
- **Arm rods: $13.00 each** (regular and extendable).
- Supersedes the live CPB prices (glasses $12.50/$17.50, arm rods $9.95/$11.95)
  and the repo's earlier values (glasses $14.95, arm rods $10.00). James's
  explicit instruction wins per the source-of-truth hierarchy.

Status: recorded in draft catalog (`workspace/new-app-draft/`) — not yet applied
to the live store or shipped anywhere.

## 2026-09-02 — New app splits combined outfit sets into separate mix-and-match items

For the new Workshop app, the Outfit step no longer uses the combined "outfit
sets" the live CPB sells as single options. Combined sets decompose into
separate **top** and **bottom** items that customers mix and match within the
step.

James's examples:
- **Suspenders Red/Blue Shirt** (CPB combined set: striped shirt + bow tie +
  suspenders + shorts) → splits into **shirt with bow tie** (top; new graphics
  created, pages 104–110 of `DAHRnSvPYPE`) and **shorts with suspenders**
  (bottom; graphics NOT yet created — pending).
- **Teddy Overalls 1/2** (CPB combined set: striped tee + teddy overalls) →
  splits into **striped t-shirt** (top) and **teddy bear overalls** (bottom).

This matches the repo's existing outfit `group` layering (`top`/`bottom`/`over`/
`looks`/`premium`) and the PRODUCT_SPEC "Mix & Match" direction.

Open scope questions (not yet answered):
- Which sets decompose? James named Suspenders + Teddy sets. Whether Pink
  Pajamas, B&W Jumpsuit, B&W Fashionista, and the PREMIUM sets (Tuxedo, suits,
  elf, Lil' Red) also split is unconfirmed — ask James.
- Whether the Outfit step collects one top + one bottom (two selections) or
  allows a top + bottom + over is unconfirmed — design decision for the new app.

Status: recorded in draft docs (`workspace/new-app-draft/`) — not applied to the
repo, live store, or any shipped code.

## 2026-09-02 — Outfit: all sets stay as sets; only Suspenders & Teddy split; skip = discount

James confirmed the outfit structure for the new app:

1. **Premium sets stay as complete sets** (Tuxedo, Blue/Grey Suit & Tie, Boy/Girl
   Elf, Lil' Red Set) — offered as one-tap Express sets.
2. **All other combined sets also stay as sets** (B&W Fashionista, B&W Jumpsuit,
   Pink Pajamas) — no decomposition.
3. **Only two sets decompose** into mix-and-match components (per the earlier
   decision): Suspenders Red/Blue → shirt+bow tie (top) + shorts+suspenders
   (bottom); Teddy Overalls 1/2 → striped tee (top) + blue-fabric teddy overalls
   (bottom, p113).
4. **Skip = discount.** Users can skip a step and the app deducts from the total:
   - Skip **Outfit**: −$14.95
   - Skip **Hair**: −$9.95
   - James's copy: "Don't need an outfit? Skip this step and save $14.95."
   (same pattern for hair)

Pricing-model implication (needs James's confirmation when the price engine is
built): the $199.95 base now effectively includes a standard outfit ($14.95
value) and standard hair ($9.95 value); skipping removes them and lowers the
total. Selecting standard options keeps the base; premium add-ons still add
their surcharge on top.

Status: recorded in draft docs (`workspace/new-app-draft/`) — not applied to the
repo, live store, or any shipped code.

## 2026-09-02 — In-app graphics: clearly cartoon style, not photorealistic; Rive reconsidered

James confirmed the **in-app graphics direction** for the new Workshop app:

1. **Cartoon style is REQUIRED for the app**, even though some master-file
   pages (Canva `DAHRnSvPYPE`) are currently near-photorealistic. The
   photorealistic look "looks great but creates unrealistic expectations" —
   customers should see the app art as a fun reference, not a promise of exact
   appearance.
2. **Why cartoon:**
   - Fun, and clearly a reference (avoids expectation mismatch).
   - **Easy to convert to vector art later** — flat cel colour + bold black
     outlines vectorize cleanly.
   - **Rive readiness** — James wants Rive for the app eventually (outfit
     pieces locked to the puppet skeleton/frame, fun animations). Cartoon/flat
     layers are the right input for Rive's skeletal animation.
3. **Rive was abandoned for v1 as "too difficult" but is back on the table.**
   Not blocking v1; treat as: design the data model + layer contract so a Rive
   swap is a render-layer change, not a data-model change. Pilot Rive on one
   asset (base + one garment) before committing.

Consequences for the graphic-artist plan (James asked to train/assemble a
graphic-artist bot):
- The bot's style guide = cartoon, flat cel, bold outlines (already the
  garment-overlay skill's acceptance criteria — reinforced).
- AI generation (LoRA on Flux, Recraft) works BEST on flat cartoon styles →
  this direction makes the bot plan easier, not harder.
- New art must be judged against the cartoon criteria, not the current
  photorealistic master pages.

Status: recorded in draft docs (`workspace/new-app-draft/`) — not applied to the
repo, live store, or any shipped code.

## 2026-09-02 — Campaign tier structure approved (Shopify relaunch, $10k target)

James approved the supporter tier stack for the Pubbets Workshop relaunch campaign
(direct on Shopify, $10k target, launch gated on a working new-app build for the
teaser). The $200 → $250 gift card remains the hero offer.

| Tier | Price | Contents |
|---|---|---|
| Rod + Sticker Fan | $19.95 | Extendable rods (20–54.5cm, closed 20cm) + limited-edition stickers, shipped flat in one bubble mailer |
| Elroy Supporter | $59.95 | Elroy puppet + extendable rods + stickers |
| Starter | $100 | $125 store credit |
| Hero | $200 | $250 store credit (headline deal) |
| Super Supporter | $400 | $500 store credit |

Two distinct rod + sticker packages (do not merge):
- **Retail Fan bundle** ($19.95): extendable rods + stickers — sold on the store.
- **Classic bonus pack**: 43cm traditional stainless rods (James's workshop stock,
  ~$0.80/pair, NOT sold at retail) + stickers — only attachable to custom puppet
  orders, never standalone retail. Free for the **first 50 gift-card custom
  orders** ($19.95 value).

Gift card tiers all give a flat 25% bonus credit ($100→$125, $200→$250, $400→$500).
Bonus cap (first 50) chosen over unlimited to protect fulfilment, cost ≈ $2.80–4.80
per redemption.

Open items before publishing (not decisions): sticker COGS + 20cm sheet size from
CJ (pending James's quote), and the sticker product doesn't exist in Shopify yet.

## 2026-09-02 — Regional pricing: Option B (lean) approved; gift card images get 20% OFF + bonus graphics

James approved regional pricing for the gift card tiers:
- **Option B (lean)**: keep the 3 gift card products; use Shopify Markets per-market
  presentment pricing (confirmed enabled: shop `enabledPresentmentCurrencies` includes
  AUD, CAD, EUR, GBP + more; storefront already returns localized prices, e.g. the
  existing gift card shows £151.21 from a UK context).
- **One 20%-off discount code** scoped to the gift card collection replaces the three
  fixed-amount codes (PUBBETS100/200/400) — all tiers are exactly 20% off the credit
  amount, and 20% works in every currency (verified GBP/EUR math). Main bot to implement.
- **Gift card main images**: add a big **"20% OFF" graphic** to each gift card main
  image (not just campaign-page styling), plus **bonus gift graphics** — classic 43cm
  arm rods + limited-edition stickers — for the first 50 gift card orders.
- Arm rod graphic sourced from Drive ACCESSORIES folder (classic crossed stainless rods
  with black grips; `arm-rods-2pcs.png` / `arm-rods-2pcs-body.png`). Sticker artwork is
  pending James's design (on his list for tonight, 2026-09-02).

## 2026-09-02 — Bonus structure corrected: TWO separate bonuses

Supersedes the 2026-09-02 "Bonus rods correction" entry (which wrongly said the first-50
bonus was the extendable rods). The actual structure James confirmed:

1. **Custom puppet orders** — EVERY custom puppet ordered during the campaign gets a FREE
   **traditional 43cm rod set + sticker set** (no cap).
2. **Gift card orders** — the **first 50 gift card orders** get a FREE **extendable arm
   rod set + stickers** ($19.95 value).

Implications:
- Gift card main-image bonus graphics: use the **extendable** rod graphic
  (Drive: `ACC extendable arm rod set.png`) for the first-50 gift card bonus.
- The custom-puppet freebie (traditional 43cm rods + stickers) is a fulfilment/order
  note, not a product-image graphic. 43cm rods = workshop stock (~$0.80/pair).
- Sticker artwork still pending James's design (2026-09-02).

## 2026-09-02 — Bonus simplified: ONE bonus only (custom puppet orders)

Supersedes the 2026-09-02 "Bonus structure corrected: TWO separate bonuses" entry.
Final confirmed structure:

- **Custom puppet orders** — EVERY custom puppet ordered during the campaign gets a FREE
  **traditional 43cm rod set + sticker set** (fulfilment note; no cap; no gift card required).
- **Gift cards — NO rods/sticker bonus.** The earlier "first 50 gift card orders get
  extendable rods + stickers" idea is dropped.
- **Gift card main images**: big **20% OFF** graphic only — do NOT add rod/sticker bonus
  graphics.
- Retail **Rod + Sticker Fan bundle ($19.95)** unchanged: extendable rods + stickers sold
  on the store.

