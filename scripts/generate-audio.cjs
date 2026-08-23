const fs = require('node:fs');
const path = require('node:path');

const SAMPLE_RATE = 44_100;
const OUTPUT_DIR = path.resolve(__dirname, '../assets/audio');

let randomState = 0x50554242;
function random() {
  randomState = (1664525 * randomState + 1013904223) >>> 0;
  return randomState / 0x1_0000_0000;
}

function createBuffer(seconds) {
  return new Float64Array(Math.ceil(seconds * SAMPLE_RATE));
}

function envelope(time, duration, attack = 0.004, release = 0.04) {
  const fadeIn = Math.min(1, time / attack);
  const fadeOut = Math.min(1, (duration - time) / release);
  return Math.max(0, Math.min(fadeIn, fadeOut));
}

function addTone(buffer, start, duration, startFrequency, endFrequency, amplitude, decay = 4) {
  const startSample = Math.floor(start * SAMPLE_RATE);
  const sampleCount = Math.floor(duration * SAMPLE_RATE);
  let phase = 0;
  for (let index = 0; index < sampleCount && startSample + index < buffer.length; index += 1) {
    const progress = index / Math.max(1, sampleCount - 1);
    const frequency = startFrequency + (endFrequency - startFrequency) * progress;
    phase += (Math.PI * 2 * frequency) / SAMPLE_RATE;
    const time = index / SAMPLE_RATE;
    const shape = envelope(time, duration) * Math.exp(-decay * progress);
    buffer[startSample + index] += Math.sin(phase) * amplitude * shape;
  }
}

function addNoise(buffer, start, duration, amplitude, smoothing = 0.72, reverse = false) {
  const startSample = Math.floor(start * SAMPLE_RATE);
  const sampleCount = Math.floor(duration * SAMPLE_RATE);
  let filtered = 0;
  let previous = 0;
  for (let index = 0; index < sampleCount && startSample + index < buffer.length; index += 1) {
    filtered = filtered * smoothing + (random() * 2 - 1) * (1 - smoothing);
    const textured = filtered - previous * 0.28;
    previous = filtered;
    const progress = index / Math.max(1, sampleCount - 1);
    const motion = reverse ? progress : 1 - progress;
    const time = index / SAMPLE_RATE;
    buffer[startSample + index] += textured * amplitude * envelope(time, duration, 0.01, 0.025) * (0.3 + 0.7 * motion);
  }
}

function addWood(buffer, start, pitch = 410, strength = 0.75) {
  addTone(buffer, start, 0.09, pitch * 1.12, pitch * 0.72, 0.48 * strength, 7);
  addTone(buffer, start, 0.065, pitch * 2.3, pitch * 1.7, 0.18 * strength, 10);
  addNoise(buffer, start, 0.028, 0.38 * strength, 0.5);
}

function addToyNote(buffer, start, pitch, strength = 0.55, duration = 0.22) {
  addTone(buffer, start, duration, pitch, pitch * 0.995, strength, 4.5);
  addTone(buffer, start, duration * 0.86, pitch * 2.01, pitch * 2, strength * 0.2, 5.5);
  addTone(buffer, start, duration * 0.75, pitch * 3.98, pitch * 4, strength * 0.07, 6.5);
}

function addEcho(buffer, delaySeconds = 0.045, amount = 0.13) {
  const delay = Math.floor(delaySeconds * SAMPLE_RATE);
  for (let index = delay; index < buffer.length; index += 1) {
    buffer[index] += buffer[index - delay] * amount;
  }
}

function finish(buffer) {
  const fadeSamples = Math.floor(0.008 * SAMPLE_RATE);
  let peak = 0;
  for (let index = 0; index < buffer.length; index += 1) peak = Math.max(peak, Math.abs(buffer[index]));
  const scale = peak > 0 ? 0.82 / peak : 1;
  for (let index = 0; index < buffer.length; index += 1) {
    const edgeFade = Math.min(1, index / fadeSamples, (buffer.length - 1 - index) / fadeSamples);
    buffer[index] *= scale * Math.max(0, edgeFade);
  }
  return buffer;
}

function writeWav(name, buffer) {
  const dataSize = buffer.length * 2;
  const wav = Buffer.alloc(44 + dataSize);
  wav.write('RIFF', 0);
  wav.writeUInt32LE(36 + dataSize, 4);
  wav.write('WAVE', 8);
  wav.write('fmt ', 12);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(SAMPLE_RATE, 24);
  wav.writeUInt32LE(SAMPLE_RATE * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write('data', 36);
  wav.writeUInt32LE(dataSize, 40);
  for (let index = 0; index < buffer.length; index += 1) {
    wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, buffer[index])) * 32767), 44 + index * 2);
  }
  fs.writeFileSync(path.join(OUTPUT_DIR, `${name}.wav`), wav);
}

const sounds = {
  'select-wood-01': () => {
    const sound = createBuffer(0.12);
    addWood(sound, 0.004, 520, 0.7);
    return sound;
  },
  'select-wood-02': () => {
    const sound = createBuffer(0.12);
    addWood(sound, 0.004, 470, 0.68);
    return sound;
  },
  'wizard-forward': () => {
    const sound = createBuffer(0.25);
    addWood(sound, 0.005, 430, 0.48);
    addToyNote(sound, 0.065, 620, 0.42, 0.17);
    return sound;
  },
  'wizard-back': () => {
    const sound = createBuffer(0.23);
    addToyNote(sound, 0.005, 520, 0.36, 0.16);
    addWood(sound, 0.075, 350, 0.45);
    return sound;
  },
  'blocked-soft': () => {
    const sound = createBuffer(0.18);
    addTone(sound, 0.005, 0.16, 230, 165, 0.55, 5.8);
    addTone(sound, 0.008, 0.12, 365, 260, 0.18, 7);
    addNoise(sound, 0.005, 0.025, 0.2, 0.62);
    return sound;
  },
  'randomise-costume-box': () => {
    const sound = createBuffer(0.72);
    addNoise(sound, 0.015, 0.36, 0.62, 0.86);
    addNoise(sound, 0.18, 0.31, 0.52, 0.78, true);
    addWood(sound, 0.08, 390, 0.45);
    addWood(sound, 0.21, 475, 0.4);
    addWood(sound, 0.34, 430, 0.38);
    addToyNote(sound, 0.47, 660, 0.36, 0.2);
    addToyNote(sound, 0.55, 830, 0.38, 0.16);
    addEcho(sound, 0.052, 0.08);
    return sound;
  },
  'restore-rustle': () => {
    const sound = createBuffer(0.3);
    addNoise(sound, 0.01, 0.2, 0.55, 0.8, true);
    addToyNote(sound, 0.08, 410, 0.28, 0.14);
    addToyNote(sound, 0.14, 520, 0.3, 0.14);
    return sound;
  },
  'reset-tidy': () => {
    const sound = createBuffer(0.46);
    addNoise(sound, 0.01, 0.31, 0.58, 0.9);
    addWood(sound, 0.08, 430, 0.32);
    addWood(sound, 0.17, 350, 0.34);
    addWood(sound, 0.29, 280, 0.52);
    return sound;
  },
  'welcome-workshop': () => {
    const sound = createBuffer(0.6);
    addToyNote(sound, 0.01, 440, 0.34, 0.25);
    addToyNote(sound, 0.11, 554, 0.38, 0.25);
    addToyNote(sound, 0.22, 659, 0.43, 0.3);
    addWood(sound, 0.34, 520, 0.24);
    addEcho(sound, 0.07, 0.11);
    return sound;
  },
  'review-celebration': () => {
    const sound = createBuffer(1.08);
    addNoise(sound, 0.01, 0.18, 0.22, 0.7, true);
    addToyNote(sound, 0.04, 392, 0.34, 0.32);
    addToyNote(sound, 0.18, 494, 0.39, 0.34);
    addToyNote(sound, 0.34, 587, 0.44, 0.38);
    addToyNote(sound, 0.5, 784, 0.5, 0.46);
    addWood(sound, 0.68, 520, 0.28);
    addNoise(sound, 0.72, 0.22, 0.2, 0.55);
    addEcho(sound, 0.075, 0.14);
    return sound;
  },
  'save-stamp': () => {
    const sound = createBuffer(0.52);
    addNoise(sound, 0.015, 0.035, 0.6, 0.48);
    addTone(sound, 0.015, 0.16, 145, 105, 0.5, 7);
    addToyNote(sound, 0.12, 523, 0.25, 0.22);
    addToyNote(sound, 0.15, 659, 0.26, 0.22);
    addToyNote(sound, 0.18, 784, 0.28, 0.22);
    return sound;
  }
};

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
for (const [name, build] of Object.entries(sounds)) writeWav(name, finish(build()));
console.log(`Generated ${Object.keys(sounds).length} original workshop sounds in ${OUTPUT_DIR}`);
