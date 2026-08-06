# Pubbets Workshop — Custom Puppet Builder

A fully 3D, animated, sound-enabled puppet configurator. Customers build a puppet
by picking parts and colors, watch it come together in 3D, and send the finished
design to your Shopify store for payment.

This is **version 0.1** — the working foundation for the Pubbets Workshop relaunch.

---

## Run it (30 seconds)

**Double-click `start.bat`.**

A small black window opens (that's the local server — leave it open) and the
builder appears in your browser at `http://localhost:8000`. Close the black
window when you're done.

> Why not just double-click `index.html`? Modern 3D apps have to be *served* by a
> mini web server or the browser blocks them. `start.bat` handles that for you.
> It uses Python if you have it, otherwise Node. If you have neither, install
> Python from python.org (tick **"Add Python to PATH"**) and run `start.bat` again.

The **admin panel** is at `http://localhost:8000/admin.html`.

---

## What's in the box

| File / folder | What it is |
|---|---|
| `index.html` | The builder (what customers see) |
| `admin.html` | Your control panel to add/edit options — no coding |
| `data/options.json` | The brain: every part, color, price, and your Shopify settings |
| `js/` | The app code (3D scene, sound, checkout) |
| `assets/models/` | **Drop your `.glb` 3D models here** |
| `assets/sounds/` | Drop real sound-effect files here (optional) |
| `assets/thumbnails/` | Option thumbnail images (optional, future) |
| `start.bat` / `server.js` | One-click launcher |

---

## Adding your own 3D models (the main job ahead)

The app works today with built-in placeholder shapes. As you build real models,
you swap them in one at a time — nothing breaks in between.

1. Export your model from your 3D tool as a **`.glb`** file (glTF Binary).
   Keep it small and centered. Blender exports `.glb` for free.
2. Put the file in **`assets/models/`**.
3. Open **`admin.html`**, find the option, and type the filename (e.g.
   `dragon-body.glb`) into its **Model file** box.
4. Click **Save options.json**, replace `data/options.json` with the downloaded
   file, and reload the builder.

That option now shows your real model instead of the placeholder. The
`sample-hoodie.glb` "Hoodie" outfit already demonstrates this.

**Local file _or_ web link.** The **Model file** box accepts either a filename
(`dragon-body.glb`, served from `assets/models/`) **or a full URL**
(`https://cdn.shopify.com/...` or a Cloudflare link). So you can host models
wherever you like — see "Where to host your 3D models" below.

### One model, many variants (important — saves you a LOT of work)

You do **not** need a model for every combination. Size and colour are handled by
the app:

- **Size** — a step can carry a `scale`, so one nose model covers Small / Medium /
  Large (0.75× / 1× / 1.35×).
- **Colour** — categories marked `tintable` get recoloured automatically, so one
  model covers every colour.

For the nose that means **5 models instead of 150**:

| You make | App generates |
|---|---|
| `nose_round.glb` | Round × 3 sizes × 10 colours = 30 options |
| `nose_oblong.glb` | 30 options |
| `nose_tear-drop.glb` | 30 options |
| `nose_human.glb` | 30 options |
| `nose_triangle.glb` | 30 options |

Same trick for **hair** (one model per style, tinted by colour) and **glasses**
(one model per frame, tinted by colour).

> Tinting works when the part is a single solid colour. If a part needs two
> colours that change independently, make separate models and turn tinting off
> for that category.

### File naming — what to call each .glb

Name files to match the pattern shown for each category in `admin.html`:

| Category | Pattern | Example |
|---|---|---|
| Base puppet | (set in admin) | `classic-pubbet.glb` |
| Nose | `nose_{shape}.glb` | `nose_tear-drop.glb` |
| Hair | `hair_{style}.glb` | `hair_messy.glb` |
| Eyes | `eyes_{family}-{style}.glb` | `eyes_oval-pink-lashes.glb` |
| Glasses | `glasses_{group}-{style}.glb` | `glasses_xl-square-thick-red.glb` |
| Outfit | `outfit_{item}.glb` | `outfit_premium-tuxedo.glb` |
| Shoes / Extras | (type filename in admin) | `shoes-white-sneakers.glb` |

Drop a correctly-named file into `assets/models/` and it appears in the builder
automatically — no config editing needed.

### Where to host your 3D models

You have three good options:

| Option | Best for | Watch out for |
|---|---|---|
| **In the app code** (`assets/models/`) | Getting started, small model sets | Models ship with the app; update = redeploy |
| **Shopify Files** (Settings → Files) | One place to manage products **and** their 3D files | Confirm the file loads cross-origin (Shopify's CDN usually allows it) |
| **Cloudflare R2 / CDN** | Lots of models, frequent updates, best speed/control | A little setup; you manage the bucket |

Since you're already creating a **Shopify product per item** (t-shirts, sneakers,
glasses), hosting each item's `.glb` in **Shopify Files** keeps the product and
its 3D model together — one dashboard, one source of truth. Upload the `.glb`
under Settings → Files, copy its CDN URL, and paste that URL into the option's
Model file box. If you ever host many large models or want faster iteration,
Cloudflare R2 is the natural upgrade — and because the app takes a URL, moving is
just swapping the links, no code changes.

**Tips for models:** one model per part (body, hair, eyes, outfit, accessory),
real-world-ish scale (the app auto-fits size), and apply materials/textures in
your 3D tool before export.

---

## Adding options & setting prices (no coding)

Open **`admin.html`**:

- **Add option** adds a new choice to a category (a new hair style, a color…).
- **Price +$** is what that choice adds on top of the base price.
- **Base price** and your **Shopify details** are at the top.
- Click **Save options.json**, then replace `data/options.json` with the file it
  downloads, and reload.

That's the whole "backend" for now: one settings file you edit through a friendly
screen. When you outgrow it, this same file can be served from a real server or
database without changing the builder.

---

## Connecting Shopify (for payment)

1. In Shopify, create one product called **"Custom Puppet"** (a single variant,
   priced however you like — the builder can pass the estimated total).
2. Find that variant's **ID** (Shopify admin → the product → the variant; the ID
   is the long number in the URL).
3. In `admin.html`, fill in **Shopify store domain** (`your-store.myshopify.com`)
   and **Custom Puppet variant ID**, then save + replace the file.

Now the **Add to cart** button opens Shopify's cart with the puppet added, and
the customer's full design (every part they picked) rides along as order notes —
so you know exactly what to build. Until you set this up, the button still works
and shows the captured design.

---

## Going to the App Store / Google Play (later)

Because this is a web app, you don't rebuild it for phones. When you're ready, a
tool called **Capacitor** wraps this same folder into real iOS and Android apps
you can submit to both stores. Nothing here needs to change to make that possible
— it's built mobile-friendly from day one. Flag it when you're ready and it's a
separate, well-trodden step.

---

## Roadmap ideas (when you are ready)

- Real `.glb` models replacing each placeholder part
- Real recorded sound effects in `assets/sounds/`
- Save/share a design by link
- A gallery of pre-made puppets to start from
- Move `options.json` to a hosted backend so you can edit options from anywhere

---

*Pubbets Workshop — handmade to order.*
