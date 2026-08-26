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

const sources: Record<WorkshopSound, string[]> = {
  select: [
    new URL('../../assets/audio/select-wood-01.wav', import.meta.url).href,
    new URL('../../assets/audio/select-wood-02.wav', import.meta.url).href
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

const volumes: Record<WorkshopSound, number> = {
  select: 0.38,
  forward: 0.42,
  back: 0.35,
  blocked: 0.28,
  randomise: 0.46,
  restore: 0.38,
  reset: 0.38,
  homeTune: 0.24,
  welcome: 0.46,
  finish: 0.5
};

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
  const selectionVariantRef = useRef(0);

  const setSoundPlaying = useCallback((sound: WorkshopSound, playing: boolean) => {
    setPlayingSounds((current) => {
      const next = new Set(current);
      if (playing) next.add(sound);
      else next.delete(sound);
      return next;
    });
  }, []);

  const stopAll = useCallback(() => {
    for (const audio of activeRef.current.values()) {
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

  const play = useCallback((sound: WorkshopSound) => {
    if (!enabledRef.current) return;

    const options = sources[sound];
    const optionIndex = sound === 'select' ? selectionVariantRef.current++ % options.length : 0;
    const current = activeRef.current.get(sound);
    if (current) {
      current.pause();
      current.currentTime = 0;
    }

    const audio = new Audio(options[optionIndex]);
    audio.preload = 'auto';
    audio.volume = volumes[sound];
    activeRef.current.set(sound, audio);
    const clear = () => {
      if (activeRef.current.get(sound) === audio) {
        activeRef.current.delete(sound);
        setSoundPlaying(sound, false);
      }
    };
    audio.addEventListener('ended', clear, { once: true });
    audio.addEventListener('error', clear, { once: true });
    void audio.play().then(() => setSoundPlaying(sound, true)).catch(clear);
  }, [setSoundPlaying]);

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
      if (document.hidden) stopAll();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      stopAll();
    };
  }, [stopAll]);

  return { enabled, setEnabled, play, stop, isPlaying };
}
