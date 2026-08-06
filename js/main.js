// main.js — app entry point. 3D scene, camera framing, panel wiring, checkout.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Puppet } from './puppet.js';
import { PanelUI } from './ui.js';
import { Audio } from './audio.js';
import { checkout } from './shopify.js';

let scene, camera, renderer, controls, puppet, config, ui;
let audioUnlocked = false;

// Camera framing: "face" = head close-up (eyes/nose/hair/glasses),
// "full" = whole puppet (outfit/shoes). Mirrors the old app's CU/full views.
const VIEWS = {
  face: { pos: new THREE.Vector3(0, 2.25, 3.0), target: new THREE.Vector3(0, 2.0, 0) },
  full: { pos: new THREE.Vector3(0, 1.9, 6.5), target: new THREE.Vector3(0, 1.4, 0) }
};
let camAnim = null;   // { fromPos, toPos, fromTgt, toTgt, t, dur }

init();

async function init() {
  setupScene();
  Audio.init();

  try {
    // Cache-bust so edits to options.json always show up on reload.
    const res = await fetch('data/options.json?t=' + Date.now(), { cache: 'no-store' });
    config = await res.json();
  } catch (e) {
    document.getElementById('loading').textContent = 'Could not load options.json';
    console.error(e);
    return;
  }

  puppet = new Puppet();
  scene.add(puppet.root);

  ui = new PanelUI(config, {
    onChange: async (cat, resolved) => {
      unlockAudioOnce();
      await puppet.setPart(cat.id, resolved);
      // A choice can hide another category (oval eyes hide glasses) —
      // take that part off the puppet too.
      for (const other of config.categories) {
        if (other.id !== cat.id && ui.isConditionallyHidden(other) && puppet.groups[other.id]) {
          await puppet.setPart(other.id, null);
        }
      }
      Audio.swap();
      updatePrice();
    },
    onTabChange: (cat) => { flyTo(cat.view === 'face' ? 'face' : 'full'); },
    onHover: () => Audio.hover()
  });

  ui.mount(document.getElementById('tabs'), document.getElementById('panel-body'));

  // Apply defaults to the 3D puppet.
  for (const [cat, opt] of ui.defaults()) await puppet.setPart(cat.id, opt);
  ui.renderTabs();
  ui.renderPanel();
  updatePrice();

  document.getElementById('loading').style.display = 'none';
  animate();
  wireGlobalUI();
}

function setupScene() {
  const stage = document.getElementById('stage');
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(42, stage.clientWidth / stage.clientHeight, 0.1, 100);
  camera.position.copy(VIEWS.full.pos);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(stage.clientWidth, stage.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  stage.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x443366, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(4, 8, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xff7ec4, 0.6);
  rim.position.set(-6, 3, -4);
  scene.add(rim);

  const floor = new THREE.Mesh(new THREE.CircleGeometry(6, 48), new THREE.ShadowMaterial({ opacity: 0.25 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(VIEWS.full.target);
  // Camera is LOCKED to the two framings (close-up / full body).
  // Zoom and pan are off — scrolling over the canvas used to wreck the framing.
  // Drag still turns the puppet, but always at the current view's distance.
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.minPolarAngle = 0.75;
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.enableDamping = true;
  controls.update();

  window.addEventListener('resize', onResize);
}

function onResize() {
  const stage = document.getElementById('stage');
  if (!stage.clientWidth || !stage.clientHeight) return;
  camera.aspect = stage.clientWidth / stage.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(stage.clientWidth, stage.clientHeight);
}

// Smoothly glide the camera to a named view ("face" or "full").
function flyTo(viewName) {
  const name = VIEWS[viewName] ? viewName : 'full';
  const v = VIEWS[name];
  // Preserve how far the customer has turned the puppet: keep the current
  // horizontal angle, just change distance/height.
  const offset = camera.position.clone().sub(controls.target);
  const angle = Math.atan2(offset.x, offset.z);
  const targetOffset = v.pos.clone().sub(v.target);
  const radius = Math.hypot(targetOffset.x, targetOffset.z);
  const toPos = new THREE.Vector3(
    v.target.x + Math.sin(angle) * radius,
    v.pos.y,
    v.target.z + Math.cos(angle) * radius
  );

  camAnim = {
    fromPos: camera.position.clone(), toPos,
    fromTgt: controls.target.clone(), toTgt: v.target.clone(),
    t: 0, dur: 0.7
  };
  document.querySelectorAll('.view-btn').forEach(b =>
    b.classList.toggle('is-active', b.dataset.view === name));
}

function updatePrice() {
  const total = ui.totalPrice();
  document.getElementById('price').textContent =
    '$' + total.toFixed(2).replace(/\.00$/, '');
  return total;
}

// ---------- Animation loop ----------

let t = 0;
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  t += dt;

  if (puppet) {
    puppet.root.position.y = Math.sin(t * 1.6) * 0.05;
    puppet.root.rotation.z = Math.sin(t * 0.9) * 0.02;
  }

  if (camAnim) {
    camAnim.t += dt;
    const k = Math.min(camAnim.t / camAnim.dur, 1);
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;  // ease in/out
    camera.position.lerpVectors(camAnim.fromPos, camAnim.toPos, e);
    controls.target.lerpVectors(camAnim.fromTgt, camAnim.toTgt, e);
    if (k >= 1) camAnim = null;
  }

  controls.update();
  renderer.render(scene, camera);
}

// ---------- Global UI ----------

function wireGlobalUI() {
  document.getElementById('recenterBtn').addEventListener('click', () => {
    unlockAudioOnce();
    const cat = ui.cat(ui.activeTab);
    flyTo(cat && cat.view === 'face' ? 'face' : 'full');
    Audio.select();
  });

  // Manual view switch — always available, and kept in sync when tabs change view.
  document.querySelectorAll('.view-btn').forEach(b => b.addEventListener('click', () => {
    unlockAudioOnce();
    flyTo(b.dataset.view);
    Audio.select();
  }));

  const soundBtn = document.getElementById('soundToggle');
  soundBtn.addEventListener('click', () => {
    const on = !Audio.isEnabled();
    Audio.setEnabled(on);
    soundBtn.textContent = on ? '🔊' : '🔇';
    if (on) Audio.select();
  });

  document.getElementById('resetBtn').addEventListener('click', async () => {
    unlockAudioOnce();
    for (const c of config.categories) {
      ui.sel[c.id] = null;
      ui.dimSel[c.id] = {};
      ui.stepIndex[c.id] = 0;
      await puppet.setPart(c.id, null);
    }
    for (const [cat, opt] of ui.defaults()) await puppet.setPart(cat.id, opt);
    ui.activeTab = config.categories[0].id;
    ui.renderTabs();
    ui.renderPanel();
    flyTo('full');
    updatePrice();
    Audio.reset();
  });

  document.getElementById('orderBtn').addEventListener('click', () => {
    unlockAudioOnce();
    Audio.order();
    const total = updatePrice();
    const selection = {};
    for (const c of config.categories) if (ui.sel[c.id]) selection[c.id] = ui.sel[c.id];
    const result = checkout(config.shopify, selection, total.toFixed(2));
    if (!result.configured) {
      alert('Design captured! ✅\n\nShopify isn’t connected yet — open admin.html and fill in ' +
            'your store domain and Custom Puppet variant ID to enable checkout.\n\n' +
            'Your selections were logged to the browser console.');
    }
  });
}

function unlockAudioOnce() {
  if (audioUnlocked) return;
  Audio.unlock();
  audioUnlocked = true;
}
