import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

class FakeAudio {
  volume = 1;
  currentTime = 0;
  preload = '';
  muted = false;
  src = '';
  addEventListener() {}
  load() {}
  play() {
    return Promise.resolve();
  }
  pause() {}
}

describe('workshop builder layout', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('Audio', FakeAudio);
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })));
    localStorage.clear();
    container = document.createElement('div');
    document.body.append(container);
  });

  afterEach(() => {
    container.remove();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  function startBuilder() {
    const root = createRoot(container);
    act(() => root.render(<App />));

    const door = container.querySelector<HTMLButtonElement>('.entrance-door');
    act(() => door?.click());
    act(() => vi.advanceTimersByTime(80));

    const start = container.querySelector<HTMLButtonElement>('[aria-label="Start building"]');
    act(() => start?.click());
    act(() => vi.advanceTimersByTime(200));

    return root;
  }

  it('uses one confirm, header wood dots, and keeps the price ticket out of the puppet stage', () => {
    const root = startBuilder();

    expect(container.querySelector('.workshop-app')).toBeTruthy();
    expect(container.querySelector('.workshop-entrance')).toBeNull();
    expect(container.querySelectorAll('.header-dot')).toHaveLength(3);
    expect(container.querySelector('[aria-label="Reset build"]')).toBeTruthy();
    expect(container.querySelector('[aria-label="Randomise body"]')).toBeTruthy();
    expect(container.querySelector('[aria-label="Mute sound"], [aria-label="Enable sound"]')).toBeTruthy();

    expect(container.querySelectorAll('.tray-confirm')).toHaveLength(1);
    expect(container.querySelector('[aria-label="Back"]')).toBeNull();
    expect(container.querySelector('.navigation-bar')).toBeNull();

    const ticket = container.querySelector('.price-ticket');
    expect(ticket).toBeTruthy();
    expect(ticket?.closest('.choice-tray')).toBeTruthy();
    expect(ticket?.closest('.preview-column')).toBeNull();
    expect(ticket?.closest('.puppet-stage')).toBeNull();

    expect(container.querySelector('.option-grid [aria-label="Skip this step"]')).toBeNull();
    expect(container.querySelector('.tray-skip')).toBeNull();
    expect(container.querySelectorAll('.option-grid--body .option-card')).toHaveLength(9);
    expect(container.querySelector('.option-card__image')).toBeNull();
    expect(container.querySelector('.puppet-stage')?.getAttribute('data-preview-engine')).toBe('png-base');
    expect(container.querySelector('.workshop-app')?.getAttribute('data-preview-mode')).toBe('full');

    act(() => root.unmount());
  });

  it('moves skip into the tray footer after body colour is chosen', () => {
    const root = startBuilder();
    const firstSwatch = container.querySelector<HTMLButtonElement>('.option-grid--body .option-card');
    act(() => firstSwatch?.click());

    const confirm = container.querySelector<HTMLButtonElement>('.tray-confirm');
    expect(confirm?.disabled).toBe(false);
    act(() => confirm?.click());

    expect(container.querySelector('.workshop-app')?.getAttribute('data-step-id')).toBe('eyes');
    expect(container.querySelector('.workshop-app')?.getAttribute('data-preview-mode')).toBe('close');
    expect(container.querySelector('.puppet-stage')?.classList.contains('is-close')).toBe(true);
    expect(container.querySelector('.option-grid [aria-label="Skip this step"]')).toBeNull();
    expect(container.querySelector('.tray-actions [aria-label="Skip this step"]')).toBeTruthy();
    expect(container.querySelectorAll('.tray-confirm')).toHaveLength(1);

    act(() => root.unmount());
  });

  it('updates the puppet in place when a body colour is tapped', () => {
    const root = startBuilder();
    const canvas = container.querySelector('.puppet-body-base');
    const secondSwatch = container.querySelectorAll<HTMLButtonElement>('.option-grid--body .option-card')[1];

    act(() => secondSwatch?.click());

    expect(container.querySelector('.puppet-body-base')).toBe(canvas);
    expect(container.querySelector('.puppet-motion')?.classList.contains('is-celebrating')).toBe(false);

    act(() => root.unmount());
  });
});
