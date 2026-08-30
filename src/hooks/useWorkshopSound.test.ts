import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { createElement, useEffect } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  useWorkshopSound,
  workshopSoundSources,
  workshopSoundVolumes,
  type WorkshopSound
} from './useWorkshopSound';

class FakeAudio {
  static playImpl: () => Promise<void> = () => Promise.resolve();
  static created: FakeAudio[] = [];

  volume = 1;
  currentTime = 0;
  preload = '';
  muted = false;
  src = '';
  paused = true;

  constructor() {
    FakeAudio.created.push(this);
  }

  addEventListener() {}
  load() {}
  pause() {
    this.paused = true;
  }
  play() {
    this.paused = false;
    return FakeAudio.playImpl();
  }
}

function HookProbe({ onReady }: { onReady: (api: ReturnType<typeof useWorkshopSound>) => void }) {
  const api = useWorkshopSound();
  useEffect(() => {
    onReady(api);
  }, [api, onReady]);
  return null;
}

describe('workshop sound mix', () => {
  it('uses the soft felt select pair under the home tune', () => {
    expect(workshopSoundSources.select).toHaveLength(2);
    expect(workshopSoundSources.select.every((url) => url.includes('select-felt-0'))).toBe(true);
    expect(workshopSoundSources.select.some((url) => url.includes('select-wood'))).toBe(false);
    expect(workshopSoundVolumes.select).toBeGreaterThanOrEqual(0.18);
    expect(workshopSoundVolumes.select).toBeLessThanOrEqual(0.24);
    expect(workshopSoundVolumes.select).toBeLessThan(workshopSoundVolumes.homeTune);
    expect(workshopSoundVolumes.select).toBeLessThan(workshopSoundVolumes.forward);
    expect(workshopSoundVolumes.select).toBeLessThan(workshopSoundVolumes.back);
    expect(workshopSoundVolumes.homeTune).toBe(0.24);
  });
});

describe('workshop sound unlock', () => {
  let container: HTMLDivElement;
  let api: ReturnType<typeof useWorkshopSound> | null;

  beforeEach(() => {
    FakeAudio.created = [];
    FakeAudio.playImpl = () => Promise.resolve();
    vi.stubGlobal('Audio', FakeAudio);
    localStorage.clear();
    container = document.createElement('div');
    document.body.append(container);
    api = null;
    const root = createRoot(container);
    act(() => {
      root.render(createElement(HookProbe, { onReady: (next) => { api = next; } }));
    });
  });

  afterEach(() => {
    container.remove();
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('starts the home tune in the same gesture as unlock and preloads the other cues', async () => {
    await act(async () => {
      api?.unlock();
      api?.play('homeTune');
    });

    const sources = FakeAudio.created.map((audio) => audio.src);
    expect(sources.some((src) => src.includes('puppet-workshop-whimsy'))).toBe(true);
    for (const sound of Object.keys(workshopSoundSources) as WorkshopSound[]) {
      if (sound === 'homeTune') continue;
      expect(sources.some((src) => workshopSoundSources[sound].includes(src))).toBe(true);
    }
  });

  it('retries the next user gesture after play() is rejected', async () => {
    let gestureAllowed = false;
    let attempts = 0;
    FakeAudio.playImpl = () => {
      attempts += 1;
      return gestureAllowed ? Promise.resolve() : Promise.reject(new Error('NotAllowedError'));
    };

    await act(async () => {
      api?.play('homeTune');
    });
    const failedAttempts = attempts;
    expect(failedAttempts).toBeGreaterThan(0);

    gestureAllowed = true;
    await act(async () => {
      api?.unlock();
      api?.play('select');
    });

    expect(attempts).toBeGreaterThan(failedAttempts);
  });
});
