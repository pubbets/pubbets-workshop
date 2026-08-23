import { useCallback, useEffect, useRef, useState } from 'react';

export type WorkshopSound =
  | 'select'
  | 'forward'
  | 'back'
  | 'blocked'
  | 'randomise'
  | 'restore'
  | 'reset'
  | 'welcome'
  | 'finish'
  | 'save';

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
  welcome: [new URL('../../assets/audio/welcome-workshop.wav', import.meta.url).href],
  finish: [new URL('../../assets/audio/review-celebration.wav', import.meta.url).href],
  save: [new URL('../../assets/audio/save-stamp.wav', import.meta.url).href]
};

const volumes: Record<WorkshopSound, number> = {
  select: 0.32,
  forward: 0.34,
  back: 0.3,
  blocked: 0.28,
  randomise: 0.38,
  restore: 0.32,
  reset: 0.34,
  welcome: 0.36,
  finish: 0.4,
  save: 0.36
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
  const activeRef = useRef(new Map<WorkshopSound, HTMLAudioElement>());
  const selectionVariantRef = useRef(0);

  const stopAll = useCallback(() => {
    for (const audio of activeRef.current.values()) {
      audio.pause();
      audio.currentTime = 0;
    }
    activeRef.current.clear();
  }, []);

  const setEnabled = useCallback((nextEnabled: boolean) => {
    setEnabledState(nextEnabled);
    try {
      localStorage.setItem(preferenceKey, String(nextEnabled));
    } catch {
      // Sound still works when storage is unavailable.
    }
    if (!nextEnabled) stopAll();
  }, [stopAll]);

  const play = useCallback((sound: WorkshopSound) => {
    if (!enabled) return;

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
      if (activeRef.current.get(sound) === audio) activeRef.current.delete(sound);
    };
    audio.addEventListener('ended', clear, { once: true });
    audio.addEventListener('error', clear, { once: true });
    void audio.play().catch(clear);
  }, [enabled]);

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

  return { enabled, setEnabled, play };
}
