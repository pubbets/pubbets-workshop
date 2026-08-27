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

function addBrightNote(buffer, start, pitch, strength = 0.5, duration = 0.28) {
  addTone(buffer, start, duration, pitch * 1.008, pitch, strength, 3.5);
  addTone(buffer, start, duration * 0.92, pitch * 2.015, pitch * 2, strength * 0.24, 4.6);
  addTone(buffer, start, duration * 0.78, pitch * 3.01, pitch * 3, strength * 0.1, 5.4);
  addTone(buffer, start, duration * 0.68, pitch * 4.02, pitch * 4, strength * 0.055, 6.2);
}

function addPluckedString(buffer, start, pitch, strength = 0.42, duration = 0.9) {
  const startSample = Math.floor(start * SAMPLE_RATE);
  const sampleCount = Math.floor(duration * SAMPLE_RATE);
  const delayLength = Math.max(2, Math.round(SAMPLE_RATE / pitch));
  const string = new Float64Array(delayLength);

  for (let index = 0; index < delayLength; index += 1) {
    const position = index / delayLength;
    string[index] = (random() * 2 - 1) * Math.sin(Math.PI * position);
  }

  let stringIndex = 0;
  for (let index = 0; index < sampleCount && startSample + index < buffer.length; index += 1) {
    const current = string[stringIndex];
    const nextIndex = (stringIndex + 1) % delayLength;
    const next = string[nextIndex];
    string[stringIndex] = (current * 0.46 + next * 0.54) * 0.9962;
    stringIndex = nextIndex;

    const time = index / SAMPLE_RATE;
    const release = Math.min(1, (duration - time) / 0.16);
    const naturalDecay = Math.exp(-1.25 * time / duration);
    buffer[startSample + index] += current * strength * naturalDecay * Math.max(0, release);
  }
}

function addGlitter(buffer, start, strength = 0.18) {
  addBrightNote(buffer, start, 1318.51, strength, 0.12);
  addBrightNote(buffer, start + 0.035, 1567.98, strength * 0.82, 0.14);
  addBrightNote(buffer, start + 0.075, 2093, strength * 0.7, 0.16);
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
    const sound = createBuffer(0.18);
    addTone(sound, 0.008, 0.13, 360, 285, 0.26, 6.8);
    addTone(sound, 0.012, 0.1, 720, 560, 0.055, 8.5);
    addEcho(sound, 0.045, 0.035);
    return sound;
  },
  'select-wood-02': () => {
    const sound = createBuffer(0.18);
    addTone(sound, 0.008, 0.13, 400, 315, 0.24, 6.8);
    addTone(sound, 0.012, 0.1, 800, 620, 0.05, 8.5);
    addEcho(sound, 0.045, 0.035);
    return sound;
  },
  'wizard-forward': () => {
    const sound = createBuffer(0.38);
    addBrightNote(sound, 0.005, 659.25, 0.38, 0.22);
    addBrightNote(sound, 0.085, 830.61, 0.46, 0.25);
    addGlitter(sound, 0.13, 0.055);
    addEcho(sound, 0.055, 0.1);
    return sound;
  },
  'wizard-back': () => {
    const sound = createBuffer(0.34);
    addBrightNote(sound, 0.005, 698.46, 0.3, 0.21);
    addBrightNote(sound, 0.075, 523.25, 0.35, 0.24);
    addEcho(sound, 0.055, 0.08);
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
    const sound = createBuffer(0.82);
    addNoise(sound, 0.015, 0.2, 0.28, 0.88);
    addBrightNote(sound, 0.035, 523.25, 0.32, 0.24);
    addBrightNote(sound, 0.14, 659.25, 0.36, 0.26);
    addBrightNote(sound, 0.25, 783.99, 0.4, 0.28);
    addBrightNote(sound, 0.37, 1046.5, 0.46, 0.34);
    addGlitter(sound, 0.47, 0.16);
    addEcho(sound, 0.06, 0.13);
    return sound;
  },
  'restore-rustle': () => {
    const sound = createBuffer(0.42);
    addNoise(sound, 0.01, 0.14, 0.2, 0.84, true);
    addBrightNote(sound, 0.055, 659.25, 0.26, 0.2);
    addBrightNote(sound, 0.125, 523.25, 0.25, 0.2);
    addBrightNote(sound, 0.19, 783.99, 0.34, 0.22);
    addEcho(sound, 0.05, 0.09);
    return sound;
  },
  'reset-tidy': () => {
    const sound = createBuffer(0.56);
    addNoise(sound, 0.01, 0.18, 0.24, 0.9);
    addBrightNote(sound, 0.035, 659.25, 0.25, 0.2);
    addBrightNote(sound, 0.12, 523.25, 0.27, 0.22);
    addBrightNote(sound, 0.21, 392, 0.28, 0.24);
    addBrightNote(sound, 0.31, 523.25, 0.36, 0.25);
    addEcho(sound, 0.06, 0.08);
    return sound;
  },
  'welcome-workshop': () => {
    const sound = createBuffer(1.28);
    addPluckedString(sound, 0.01, 523.25, 0.34, 1.0);
    addPluckedString(sound, 0.075, 659.25, 0.32, 0.98);
    addPluckedString(sound, 0.145, 783.99, 0.33, 0.96);
    addPluckedString(sound, 0.225, 987.77, 0.31, 0.9);
    addPluckedString(sound, 0.33, 1174.66, 0.28, 0.82);
    addPluckedString(sound, 0.45, 1567.98, 0.19, 0.7);
    addEcho(sound, 0.052, 0.08);
    addEcho(sound, 0.091, 0.065);
    return sound;
  },
  'review-celebration': () => {
    const sound = createBuffer(1.22);
    addGlitter(sound, 0.01, 0.1);
    addBrightNote(sound, 0.045, 523.25, 0.34, 0.38);
    addBrightNote(sound, 0.18, 659.25, 0.39, 0.4);
    addBrightNote(sound, 0.33, 783.99, 0.44, 0.44);
    addBrightNote(sound, 0.5, 1046.5, 0.52, 0.52);
    addBrightNote(sound, 0.68, 1318.51, 0.38, 0.48);
    addGlitter(sound, 0.74, 0.14);
    addEcho(sound, 0.08, 0.17);
    return sound;
  },
  'save-stamp': () => {
    const sound = createBuffer(0.72);
    addNoise(sound, 0.015, 0.028, 0.25, 0.5);
    addTone(sound, 0.015, 0.12, 185, 145, 0.25, 7);
    addBrightNote(sound, 0.09, 523.25, 0.29, 0.32);
    addBrightNote(sound, 0.12, 659.25, 0.31, 0.34);
    addBrightNote(sound, 0.15, 783.99, 0.34, 0.38);
    addGlitter(sound, 0.22, 0.08);
    addEcho(sound, 0.065, 0.12);
    return sound;
  }
};

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
for (const [name, build] of Object.entries(sounds)) writeWav(name, finish(build()));
console.log(`Generated ${Object.keys(sounds).length} original workshop sounds in ${OUTPUT_DIR}`);
