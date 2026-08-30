import { useCallback, useEffect, useRef, useState } from 'react';

export type WorkshopSound =
  | 'select'
  | 'forward'
  | 'back'
  | 'blocked'
  | 'randomise'
  | 'restore'
  | 'reset'
  | 'homeTune'
  | 'welcome'
  | 'finish';

const preferenceKey = 'pubbets-workshop-sound-enabled';

export const workshopSoundSources: Record<WorkshopSound, string[]> = {
  select: [
    new URL('../../assets/audio/select-felt-01.wav', import.meta.url).href,
    new URL('../../assets/audio/select-felt-02.wav', import.meta.url).href
  ],
  forward: [new URL('../../assets/audio/wizard-forward.wav', import.meta.url).href],
  back: [new URL('../../assets/audio/wizard-back.wav', import.meta.url).href],
  blocked: [new URL('../../assets/audio/blocked-soft.wav', import.meta.url).href],
  randomise: [new URL('../../assets/audio/randomise-costume-box.wav', import.meta.url).href],
  restore: [new URL('../../assets/audio/restore-rustle.wav', import.meta.url).href],
  reset: [new URL('../../assets/audio/reset-tidy.wav', import.meta.url).href],
  homeTune: [new URL('../../assets/audio/puppet-workshop-whimsy.mp3', import.meta.url).href],
  welcome: [new URL('../../assets/audio/welcome-workshop.wav', import.meta.url).href],
  finish: [new URL('../../assets/audio/review-celebration.wav', import.meta.url).href]
};

export const workshopSoundVolumes: Record<WorkshopSound, number> = {
  select: 0.2,
  forward: 0.32,
  back: 0.28,
  blocked: 0.28,
  randomise: 0.46,
  restore: 0.38,
  reset: 0.38,
  homeTune: 0.24,
  welcome: 0.46,
  finish: 0.5
};

const silentUnlockUrl = (() => {
  const sampleRate = 44_100;
  const samples = 441;
  const dataSize = samples * 2;
  const bytes = new Uint8Array(44 + dataSize);
  const view = new DataView(bytes.buffer);
  const writeString = (offset: number, value: string) => {
    for (let index = 0; index < value.length; index += 1) bytes[offset + index] = value.charCodeAt(index);
  };
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return `data:audio/wav;base64,${btoa(binary)}`;
})();

function savedPreference() {
  try {
    return localStorage.getItem(preferenceKey) !== 'false';
  } catch {
    return true;
  }
}

export function useWorkshopSound() {
  const [enabled, setEnabledState] = useState(savedPreference);
  const [playingSounds, setPlayingSounds] = useState<Set<WorkshopSound>>(() => new Set());
  const enabledRef = useRef(enabled);
  const activeRef = useRef(new Map<WorkshopSound, HTMLAudioElement>());
  const poolRef = useRef(new Map<string, HTMLAudioElement>());
  const unlockedRef = useRef(false);
  const preloadedRef = useRef(false);
  const selectionVariantRef = useRef(0);

  const setSoundPlaying = useCallback((sound: WorkshopSound, playing: boolean) => {
    setPlayingSounds((current) => {
      const next = new Set(current);
      if (playing) next.add(sound);
      else next.delete(sound);
      return next;
    });
  }, []);

  const audioFor = useCallback((url: string) => {
    const existing = poolRef.current.get(url);
    if (existing) return existing;
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = url;
    poolRef.current.set(url, audio);
    return audio;
  }, []);

  const stopAll = useCallback(() => {
    for (const audio of poolRef.current.values()) {
      audio.pause();
      audio.currentTime = 0;
    }
    activeRef.current.clear();
    setPlayingSounds(new Set());
  }, []);

  const setEnabled = useCallback((nextEnabled: boolean) => {
    enabledRef.current = nextEnabled;
    setEnabledState(nextEnabled);
    try {
      localStorage.setItem(preferenceKey, String(nextEnabled));
    } catch {
      // Sound still works when storage is unavailable.
    }
    if (!nextEnabled) stopAll();
  }, [stopAll]);

  const preloadSfx = useCallback(() => {
    for (const urls of Object.values(workshopSoundSources)) {
      for (const url of urls) audioFor(url);
    }
    preloadedRef.current = true;
  }, [audioFor]);

  const unlock = useCallback(() => {
    if (!enabledRef.current) return;

    const silence = audioFor(silentUnlockUrl);
    silence.muted = true;
    silence.volume = 0;
    void silence.play().then(() => {
      unlockedRef.current = true;
      silence.pause();
      silence.currentTime = 0;
    }).catch(() => {
      unlockedRef.current = false;
    });

    if (!preloadedRef.current) preloadSfx();
  }, [audioFor, preloadSfx]);

  const play = useCallback((sound: WorkshopSound) => {
    if (!enabledRef.current) return;

    if (!unlockedRef.current) unlock();

    const options = workshopSoundSources[sound];
    const optionIndex = sound === 'select' ? selectionVariantRef.current++ % options.length : 0;
    const url = options[optionIndex];
    const audio = audioFor(url);

    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
    audio.volume = workshopSoundVolumes[sound];
    activeRef.current.set(sound, audio);

    void audio.play().then(() => {
      unlockedRef.current = true;
      setSoundPlaying(sound, true);
      if (!preloadedRef.current) preloadSfx();
    }).catch(() => {
      unlockedRef.current = false;
      if (activeRef.current.get(sound) === audio) {
        activeRef.current.delete(sound);
        setSoundPlaying(sound, false);
      }
    });
  }, [audioFor, preloadSfx, setSoundPlaying, unlock]);

  const stop = useCallback((sound: WorkshopSound, fadeMilliseconds = 0) => {
    const audio = activeRef.current.get(sound);
    if (!audio) return;

    if (fadeMilliseconds <= 0) {
      audio.pause();
      audio.currentTime = 0;
      activeRef.current.delete(sound);
      setSoundPlaying(sound, false);
      return;
    }

    const startingVolume = audio.volume;
    const startedAt = performance.now();
    const fade = (now: number) => {
      if (activeRef.current.get(sound) !== audio) return;
      const progress = Math.min(1, (now - startedAt) / fadeMilliseconds);
      audio.volume = startingVolume * (1 - progress);
      if (progress < 1) {
        requestAnimationFrame(fade);
      } else {
        audio.pause();
        audio.currentTime = 0;
        activeRef.current.delete(sound);
        setSoundPlaying(sound, false);
      }
    };
    requestAnimationFrame(fade);
  }, [setSoundPlaying]);

  const isPlaying = useCallback((sound: WorkshopSound) => playingSounds.has(sound), [playingSounds]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        stopAll();
        unlockedRef.current = false;
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      stopAll();
    };
  }, [stopAll]);

  return { enabled, setEnabled, play, stop, isPlaying, unlock };
}
