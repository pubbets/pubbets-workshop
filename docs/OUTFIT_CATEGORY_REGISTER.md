# Outfit Structure — FINAL (locked for import) v2

*Locked 13 Sep 2026 by Workshop App Bot. Corrected after discovering the Canva
file grew from 122 → 139 pages (James added a "Dresses" title page at p1 and a
SHORTS section at p123-139, shifting all page numbers). Sources: Canva "2026
THUMBNAILS" (DAHR67pfRQo, 139pp, page layout verified via OCR) + live CPB
config (6860839682083.json, fetched fresh). Thumbnail file = MASTER LIST.*

---

## The structure (locked)

### DRESSES (19) — matches live 19 ✓
| Canva pages | Count | Live labels |
|---|---|---|
| p2-20 | 19 | Gingham Blue, Yellow w/bag, Orange w/bag, Pink w/bag, Apple; Floral Pink, Pink2, Violet, Orange, Lilac, Green Blossom, Pink Blossom, Violet Blossom; Red Teddy, Maroon Teddy; Red Flowers Pinafore, Pink Flowers Pinafore; Sunflower; White & Yellow |

**Q1 answer: NO dress is missing.** Canva 19 = live 19. My earlier "20 vs 19"
was an artifact — I counted the new "Dresses" title page (p1) as a dress.

### OUTFIT SETS (7) — matches live ✓ (p22-28)

### PREMIUM OUTFIT SETS (8 pages p30-37; live shows 7)
**Q2 answer: blue pajamas are out of stock** — that's the 8th premium page.
Canva has it; live just doesn't offer it (OOS). Keep it in the import with an
OOS flag; don't drop it.

### TOPS
| Sub-category | Canva pages | Count | Live ref |
|---|---|---|---|
| Blouses | p39 | 1 | Blouse B&W |
| T-Shirts | p41-60 (p43 skipped) | 19 | T-SHIRTS & JERSEYS (solids+prints) |
| Jerseys | p62-71 | 10 | T-SHIRTS & JERSEYS (jerseys) |
| Polo Shirts | p73-74 | 2 | SHIRTS: Polo Blue/White |
| Button Up Shirts | p76-88 | 13 | SHIRTS: plaids + bow-ties |
| Hoodies | p90-94 | 5 | SHIRTS: hoodie plaids |

### LAYERS
| Sub-category | Canva pages | Count | Live ref |
|---|---|---|---|
| Button Up Shirts | p96-101 | 6 | LAYERS: plaid shirts |
| Hoodies | p103-107 | 5 | LAYERS: plaid hoodies |
| Overalls | p109-111 | 3 | LAYERS: overalls |

### BOTTOMS
| Sub-category | Canva pages | Count | Live ref |
|---|---|---|---|
| Jeans | p113-114 | 2 | JEANS & PANTS: denim jeans |
| Pants | p116-123 | 8 | JEANS & PANTS: pants |
| Shorts | p126-128 | 3 | SHORTS: plain (yellow, green, pink) |
| Athletic Shorts | p130-139 | 10 | SHORTS: athletic 23/65 (blue/yellow/red/black/green) |

*Note: two Canva pages are DISREGARDED by James — NOT to be added to the app:
- p125: orange shorts
- p43: solid blue t-shirt ("T Blue" — not in stock, no blue tee)*

---

## Canva page layout (verified, 139 pages)

```
p1       [TITLE] Dresses
p2-20    Dresses (19)
p21      [TITLE] Outfit Sets
p22-28   Outfit Sets (7)
p29      [TITLE] PREMIUM | Outfit | Sets
p30-37   Premium Outfit Sets (8 — 1 is blue pajamas OOS)
p38      [TITLE] TOPS | Blouses
p39      Blouses (1)
p40      [TITLE] TOPS | T-shirts
p41-42   T-Shirts (Black, White)
p43      (solid blue tee — DISREGARDED, not in app)
p44-60   T-Shirts (17 more)
p61      [TITLE] TOPS | Jerseys
p62-71   Jerseys (10)
p72      [TITLE] TOPS | Polo Shirts
p73-74   Polo Shirts (2)
p75      [TITLE] TOPS | Button Up Shirts
p76-88   Button Up Shirts (13)
p89      [TITLE] TOPS | Hoodies
p90-94   Hoodies (5)
p95      [TITLE] LAYERS | Button Up Shirts
p96-101  Layer Button Ups (6)
p102     [TITLE] LAYERS | Hoodies
p103-107 Layer Hoodies (5)
p108     [TITLE] LAYERS | Overalls
p109-111 Overalls (3)
p112     [TITLE] BOTTOMS | Jeans
p113-114 Jeans (2)
p115     [TITLE] BOTTOMS | Pants
p116-123 Pants (8)
p124     [TITLE] BOTTOMS | Shorts
p125     (orange shorts — DISREGARDED, not in app)
p126-128 Shorts (3: yellow, green, pink)
p129     [TITLE] BOTTOMS | Athletic Shorts
p130-139 Athletic Shorts (10 — 23/65 × blue/yellow/red/black/green)
```

---

## Live config option counts (for import)

| Category (live) | Options |
|---|---|
| 1. PREMIUM OUTFIT SETS | 7 (+1 OOS = 8 in Canva) |
| 2. OUTFIT SETS | 7 |
| 3. DRESSES | 19 |
| 4. T-SHIRTS & JERSEYS | 30 (20 tees + 10 jerseys) |
| 5. SHIRTS | 20 (2 polo + 13 button-up + 5 hoodie) |
| 6. LAYERS | 14 (6 plaid shirts + 5 hoodies + 3 overalls) |
| 7. JEANS & PANTS | 10 (2 jeans + 8 pants) |
| 8. SHORTS | 13 (3 plain + 10 athletic) |
| **Total** | **120** |

---

## SKU questions answered

**Q4/Q5: Where are SKUs from?** The live CPB app config at
`cdn.thecustomproductbuilder.com/28076834851/6860839682083.json` — each option
has a `sku` field (e.g. `dressgingblue`, `tblack`, `jersred23`). NOT from the
Canva file. Two real issues found there:

1. **Jersey SKU collisions** — live config:
   - Blue Jersey 23 → `jersred23`, Blue Jersey 65 → `jersred65` (copied red!)
   - Green Jersey 23 → `jersred23`, Green Jersey 65 → `jersred65` (copied red!)
   These will collide in the new app if SKUs are used as keys. Fix: use
   `jersblue23/65`, `jersgreen23/65`.
2. **JEANS & PANTS have EMPTY sku** — all 10 options have `sku: ""` in the
   live config. New app must assign them.

**Q6: Thumbnail file is master list** — confirmed. All category structure and
page mapping in this register comes from the Canva file; live config used only
for SKU/pricing cross-ref.

---

## Remaining flags (only 2)

1. **Shorts: 4 in Canva vs 3 live** — one extra plain short in Canva (likely
   orange at p125). Keep all 4; flag the extra for James.
2. **Jersey SKU collisions + empty pants SKUs** — fix at import time.

All other earlier flags (dresses 20v19, premium 8v7, shorts missing, pants
7v8) are RESOLVED — they were artifacts of the stale 122-page download.

## Files

- Register (this): `workspace/new-app-draft/OUTFIT_CATEGORY_REGISTER.md`
- Canva thumbnails (139): `workspace/new-app-draft/vector-graphics/page-NN-thumb.png`
- Live config: `/tmp/live-config.json`, extracted: `/tmp/live-outfit-register.json`
- Repo outfit data: `/opt/data/pubbets-workshop/src/data/outfit.json` (to be rebuilt)
