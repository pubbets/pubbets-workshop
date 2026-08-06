// puppet.js — builds the 3D puppet and swaps parts.
//
// Every category (body, hair, eyes, nose, glasses, outfit, shoes, accessory) is
// a named group on the puppet. Selecting an option rebuilds just that group.
//
// For each option:
//   - If option.model is set AND the .glb loads (local file in assets/models/ OR
//     a full https:// URL), we use your real 3D model.
//   - Otherwise we build a placeholder from basic shapes based on option.shape.
// So the app looks complete today and gets better every time you add a model.

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const modelCache = new Map();
const MODEL_PATH = 'assets/models/';

function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: opts.roughness ?? 0.6,
    metalness: opts.metalness ?? 0.05,
    ...opts
  });
}

async function loadModel(file) {
  if (!file) return null;
  if (modelCache.has(file)) return modelCache.get(file).clone(true);
  // A model can be a local filename (assets/models/foo.glb) OR a full URL
  // (https://cdn.shopify.com/... or a Cloudflare/R2 link). Full URLs are used as-is.
  const url = /^https?:\/\//i.test(file) ? file : MODEL_PATH + file;
  try {
    const gltf = await new Promise((resolve, reject) =>
      loader.load(url, resolve, undefined, reject));
    const scene = gltf.scene;
    scene.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    modelCache.set(file, scene);
    return scene.clone(true);
  } catch (e) {
    console.warn(`[puppet] Model "${file}" not found yet — using placeholder.`, e.message);
    return null;
  }
}

// ---------- Procedural placeholder parts ----------

function buildBody(shape, color) {
  const g = new THREE.Group();
  const m = mat(color);
  // The real Pubbet is a soft two-part (head + body) plush. One "classic" shape.
  const torso = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), m);
  torso.scale.set(1, 1.05, 1);
  torso.position.y = 0.95;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), m);
  head.position.y = 2.0;
  torso.castShadow = head.castShadow = true;
  g.add(torso, head);

  // A friendly mouth.
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.05, 8, 24, Math.PI), mat('#3a2033'));
  mouth.rotation.z = Math.PI;
  mouth.position.set(0, head.position.y - 0.2, 0.62);
  g.add(mouth);

  g.userData.headY = head.position.y;
  g.userData.headR = head.geometry.parameters.radius;
  return g;
}

function buildEyes(shape, color, headY, headR) {
  const g = new THREE.Group();
  const white = mat(color, { roughness: 0.2 });
  const pupil = mat('#1a1a2a', { roughness: 0.2 });
  const z = headR - 0.02;
  for (const sx of [-0.26, 0.26]) {
    const eye = new THREE.Group();
    let ball;
    if (shape === 'beady') {
      ball = new THREE.Mesh(new THREE.SphereGeometry(0.1, 18, 18), white);
    } else if (shape === 'oval') {
      ball = new THREE.Mesh(new THREE.SphereGeometry(0.17, 20, 20), white);
      ball.scale.set(0.8, 1.15, 1);
    } else if (shape === 'dome') {
      ball = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2), white);
      ball.rotation.x = Math.PI / 2;
    } else { // round
      ball = new THREE.Mesh(new THREE.SphereGeometry(0.17, 20, 20), white);
    }
    const p = new THREE.Mesh(new THREE.SphereGeometry(shape === 'beady' ? 0.06 : 0.08, 16, 16), pupil);
    p.position.set(0, 0, 0.11);
    eye.add(ball, p);
    eye.position.set(sx, headY + 0.12, z);
    g.add(eye);
  }
  return g;
}

function buildNose(shape, color, headY, headR, size) {
  const g = new THREE.Group();
  if (shape === 'none') return g;
  const m = mat(color, { roughness: 0.7 });
  const k = size === 'small' ? 0.75 : size === 'large' ? 1.35 : 1;   // size step
  let nose;
  if (shape === 'pointed') {
    nose = new THREE.Mesh(new THREE.ConeGeometry(0.1 * k, 0.24 * k, 16), m);
    nose.rotation.x = Math.PI / 2;
  } else if (shape === 'oblong') {
    nose = new THREE.Mesh(new THREE.SphereGeometry(0.11 * k, 20, 20), m);
    nose.scale.set(0.8, 1.5, 1);
  } else { // round
    nose = new THREE.Mesh(new THREE.SphereGeometry(0.12 * k, 20, 20), m);
  }
  nose.position.set(0, headY - 0.02, headR - 0.01);
  nose.castShadow = true;
  g.add(nose);
  return g;
}

function buildHair(shape, color, headY, headR) {
  const g = new THREE.Group();
  if (shape === 'none') return g;
  const m = mat(color, { roughness: 0.9 });
  if (shape === 'afro') {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(headR + 0.22, 24, 24), m);
    puff.position.set(0, headY + 0.15, -0.05);
    g.add(puff);
  } else if (shape === 'dreadlocks') {
    // Cap plus hanging strands.
    const cap = new THREE.Mesh(new THREE.SphereGeometry(headR + 0.05, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2), m);
    cap.position.y = headY + 0.05;
    g.add(cap);
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const strand = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.9, 8), m);
      strand.position.set(Math.cos(a) * (headR - 0.05), headY - 0.35, Math.sin(a) * (headR - 0.05));
      g.add(strand);
    }
  } else { // bob (default for all colored hair)
    const cap = new THREE.Mesh(new THREE.SphereGeometry(headR + 0.06, 24, 24), m);
    cap.scale.set(1, 0.85, 1);
    cap.position.set(0, headY + 0.12, -0.06);
    g.add(cap);
  }
  return g;
}

function buildGlasses(shape, color, headY, headR) {
  const g = new THREE.Group();
  if (shape === 'none') return g;
  const m = mat(color, { roughness: 0.3, metalness: 0.2 });
  const z = headR - 0.01;
  const r = shape === 'buggy' ? 0.22 : 0.19;
  for (const sx of [-0.26, 0.26]) {
    let rim;
    if (shape === 'square') {
      rim = new THREE.Mesh(new THREE.TorusGeometry(r, 0.03, 8, 4), m);
      rim.rotation.z = Math.PI / 4;
    } else {
      rim = new THREE.Mesh(new THREE.TorusGeometry(r, shape === 'buggy' ? 0.04 : 0.03, 10, 24), m);
    }
    rim.position.set(sx, headY + 0.12, z);
    g.add(rim);
  }
  const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.16, 8), m);
  bridge.rotation.z = Math.PI / 2;
  bridge.position.set(0, headY + 0.12, z);
  g.add(bridge);
  return g;
}

function buildOutfit(shape, color, headY) {
  const g = new THREE.Group();
  if (shape === 'none') return g;
  const m = mat(color, { roughness: 0.75 });
  if (shape === 'hoodie') {
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.95, 1.0, 24), m);
    body.position.y = 0.85;
    const hood = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.14, 12, 24), m);
    hood.position.y = headY - 0.5;
    hood.rotation.x = Math.PI / 2;
    g.add(body, hood);
  } else if (shape === 'dress') {
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.85, 0.5, 24), m);
    top.position.y = 1.1;
    const skirt = new THREE.Mesh(new THREE.ConeGeometry(1.05, 0.7, 24, 1, true), m);
    skirt.position.y = 0.55;
    g.add(top, skirt);
  } else if (shape === 'tuxedo') {
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.9, 0.95, 24), m);
    body.position.y = 0.9;
    const lapel = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.6, 0.05), mat('#ffffff'));
    lapel.position.set(0, 1.05, 0.82);
    g.add(body, lapel);
  } else if (shape === 'overalls') {
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.83, 0.92, 0.85, 24), m);
    body.position.y = 0.85;
    for (const sx of [-0.35, 0.35]) {
      const strap = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.05), m);
      strap.position.set(sx, 1.35, 0.78);
      g.add(strap);
    }
    g.add(body);
  } else { // tshirt / generic top
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.84, 0.9, 0.8, 24), m);
    body.position.y = 0.95;
    g.add(body);
  }
  return g;
}

function buildShoes(shape, color) {
  const g = new THREE.Group();
  if (shape === 'none') return g;
  const m = mat(color, { roughness: 0.5 });
  for (const sx of [-0.32, 0.32]) {
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.5), m);
    shoe.position.set(sx, 0.12, 0.12);
    shoe.castShadow = true;
    g.add(shoe);
  }
  return g;
}

function buildAccessory(shape, color, headY, headR) {
  const g = new THREE.Group();
  if (shape === 'none') return g;
  const m = mat(color, { roughness: 0.4, metalness: 0.3 });
  if (shape === 'armrods') {
    // Two thin control rods extending from the puppet's sides.
    for (const sx of [-1, 1]) {
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.4, 8), m);
      rod.position.set(sx * 0.9, 0.6, 0.3);
      rod.rotation.z = sx * 0.5;
      g.add(rod);
    }
  } else if (shape === 'bowtie') {
    const knot = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), m);
    const l = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.24, 4), m);
    const r = l.clone();
    l.rotation.z = Math.PI / 2; r.rotation.z = -Math.PI / 2;
    l.position.x = -0.18; r.position.x = 0.18;
    const grp = new THREE.Group();
    grp.add(knot, l, r);
    grp.position.set(0, headY - 0.65, 0.6);
    g.add(grp);
  }
  return g;
}

// Step-based categories arrive as { dims: {...} } from the wizard, so we map
// those dimension values onto the placeholder shapes.
const EYE_SHAPE   = { 'round-flat': 'round', dome: 'dome', oval: 'oval', beady: 'beady' };
const HAIR_SHAPE  = { afro: 'afro', 'dreadlocks-short': 'dreadlocks', 'dreadlocks-long': 'dreadlocks' };
const GLASS_SHAPE = { classic: 'round', xl: 'square', buggy: 'buggy' };

const BUILDERS = {
  body:      (o, ctx) => buildBody(o.shape, ctx.bodyColor || o.color),
  eyes:      (o, ctx) => buildEyes(EYE_SHAPE[o.dims?.family] || o.shape || 'round', o.color, ctx.headY, ctx.headR),
  nose:      (o, ctx) => buildNose(noseShape(o), o.color, ctx.headY, ctx.headR, o.dims?.size),
  hair:      (o, ctx) => buildHair(HAIR_SHAPE[o.dims?.style] || o.shape || 'bob', o.color, ctx.headY, ctx.headR),
  glasses:   (o, ctx) => buildGlasses(GLASS_SHAPE[o.dims?.group] || o.shape || 'round', o.color, ctx.headY, ctx.headR),
  outfit:    (o, ctx) => buildOutfit(o.shape || 'tshirt', o.color, ctx.headY),
  shoes:     (o)      => buildShoes(o.shape, o.color),
  accessory: (o, ctx) => buildAccessory(o.shape, o.color, ctx.headY, ctx.headR)
};

// Where a real .glb for each category should sit, relative to the head.
// y = offset from head centre, z = fraction of head radius (forward).
const ANCHORS = {
  nose:    { y: -0.02, z: 1.0 },
  eyes:    { y: 0.12,  z: 1.0 },
  glasses: { y: 0.12,  z: 1.02 },
  hair:    { y: 0.30,  z: 0 }
};

function noseShape(o) {
  const s = o.dims?.shape || o.shape || 'round';
  return (s === 'tear-drop' || s === 'triangle' || s === 'human') ? 'pointed' : s;
}

export class Puppet {
  constructor() {
    this.root = new THREE.Group();
    this.groups = {};       // categoryId -> THREE.Group
    this.ctx = { headY: 2.0, headR: 0.7, bodyColor: null };
  }

  async setPart(categoryId, option) {
    // null / "None" — remove whatever is there and stop.
    if (!option) {
      if (this.groups[categoryId]) {
        this.root.remove(this.groups[categoryId]);
        this.groups[categoryId] = null;
      }
      return;
    }

    // Body color is a modifier, not its own mesh — recolor the body's torso+head.
    if (categoryId === 'bodyColor') {
      this.ctx.bodyColor = option.color;
      const bodyGroup = this.groups['body'];
      if (bodyGroup) {
        const meshes = [];
        bodyGroup.traverse(o => { if (o.isMesh) meshes.push(o); });
        // The first two meshes built in buildBody() are the torso and head.
        meshes.slice(0, 2).forEach(mesh => mesh.material.color.set(option.color));
      }
      return;
    }

    // Remove old group for this category.
    if (this.groups[categoryId]) {
      this.root.remove(this.groups[categoryId]);
      this.groups[categoryId] = null;
    }

    let group = null;
    const modeled = await loadModel(option.model);
    if (modeled) {
      group = new THREE.Group();

      // Auto-fit the model, then apply the option's own size multiplier.
      // This is how ONE nose model covers Small / Medium / Large: the Size step
      // carries a `scale` value (0.75 / 1 / 1.35) instead of needing 3 models.
      const box = new THREE.Box3().setFromObject(modeled);
      const size = new THREE.Vector3(); box.getSize(size);
      const fit = (option.baseScale || 1.6) / (Math.max(size.x, size.y, size.z) || 1);
      modeled.scale.setScalar(fit * (option.scale || 1));

      // Recolour the model to the chosen colour, so one model covers every
      // colour option too (works when the part is a single solid colour).
      if (option.tint && option.color) {
        const c = new THREE.Color(option.color);
        modeled.traverse(o => {
          if (o.isMesh && o.material) {
            const mats = Array.isArray(o.material) ? o.material : [o.material];
            o.material = mats.map(m => { const n = m.clone(); if (n.color) n.color.copy(c); return n; });
            if (o.material.length === 1) o.material = o.material[0];
          }
        });
      }

      // Anchor face parts to the head so they sit in the right place.
      const anchor = ANCHORS[categoryId];
      if (anchor) group.position.set(0, this.ctx.headY + anchor.y, anchor.z * this.ctx.headR);

      group.add(modeled);
    } else if (BUILDERS[categoryId]) {
      group = BUILDERS[categoryId](option, this.ctx);
    } else {
      group = new THREE.Group();
    }

    this.groups[categoryId] = group;
    this.root.add(group);

    if (categoryId === 'body') {
      this.ctx.headY = group.userData.headY ?? 2.0;
      this.ctx.headR = group.userData.headR ?? 0.7;
      if (this.ctx.bodyColor) this.setPart('bodyColor', { color: this.ctx.bodyColor });
    }
  }
}
