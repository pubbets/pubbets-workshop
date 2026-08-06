// audio.js — sound effects for the puppet builder.
//
// v1 generates all sounds in the browser with the Web Audio API, so the app
// makes noise with ZERO sound files. When you have real sound effects, drop
// .mp3/.wav files in assets/sounds/ and set FILES below to use them instead.

const FILES = {
  // Example (uncomment + add files to assets/sounds/ to use real audio):
  // swap:  'assets/sounds/swap.mp3',
  // select:'assets/sounds/select.mp3',
  // order: 'assets/sounds/order.mp3'
};

let ctx = null;
let enabled = true;
const buffers = {};

function ensureCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// Simple synthesized "blip" — a pitched tone with a quick fade.
function blip(freq = 440, dur = 0.12, type = 'sine', gain = 0.15) {
  if (!enabled) return;
  const ac = ensureCtx();
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime);
  g.gain.setValueAtTime(0, ac.currentTime);
  g.gain.linearRampToValueAtTime(gain, ac.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
  osc.connect(g).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + dur);
}

// A quick two-note rise (used for a satisfying "added" chime).
function chime(base = 520) {
  if (!enabled) return;
  blip(base, 0.10, 'triangle', 0.16);
  setTimeout(() => blip(base * 1.5, 0.16, 'triangle', 0.14), 90);
}

async function loadFile(key, url) {
  const ac = ensureCtx();
  const res = await fetch(url);
  const arr = await res.arrayBuffer();
  buffers[key] = await ac.decodeAudioData(arr);
}

function playFile(key, gain = 0.6) {
  if (!enabled || !buffers[key]) return false;
  const ac = ensureCtx();
  const src = ac.createBufferSource();
  const g = ac.createGain();
  g.gain.value = gain;
  src.buffer = buffers[key];
  src.connect(g).connect(ac.destination);
  src.start();
  return true;
}

export const Audio = {
  async init() {
    // Preload any real sound files that were configured.
    for (const [key, url] of Object.entries(FILES)) {
      try { await loadFile(key, url); } catch (e) { /* fall back to synth */ }
    }
  },
  setEnabled(v) { enabled = v; },
  isEnabled() { return enabled; },
  // Called on the first user gesture to unlock audio on mobile/Safari.
  unlock() { ensureCtx(); },

  hover()  { if (!playFile('hover')) blip(660, 0.05, 'sine', 0.05); },
  select() { if (!playFile('select')) blip(500, 0.10, 'triangle', 0.14); },
  swap()   { if (!playFile('swap')) { blip(300, 0.07, 'square', 0.10); setTimeout(() => blip(520, 0.08, 'triangle', 0.10), 60); } },
  order()  { if (!playFile('order')) { chime(523); setTimeout(() => blip(784, 0.25, 'triangle', 0.14), 220); } },
  reset()  { if (!playFile('reset')) blip(360, 0.14, 'sawtooth', 0.08); }
};
