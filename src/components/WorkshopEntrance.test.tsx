import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WorkshopEntrance } from './WorkshopEntrance';

describe('WorkshopEntrance', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })));
    container = document.createElement('div');
    document.body.append(container);
  });

  afterEach(() => {
    container.remove();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('starts audio immediately and enters after the door transition', () => {
    const onEnter = vi.fn();
    const onEntered = vi.fn();
    const root = createRoot(container);

    act(() => root.render(<WorkshopEntrance onEnter={onEnter} onEntered={onEntered} />));

    const door = container.querySelector<HTMLButtonElement>('.entrance-door');
    act(() => door?.click());

    expect(onEnter).toHaveBeenCalledOnce();
    expect(onEntered).not.toHaveBeenCalled();
    expect(container.querySelector('.workshop-entrance')?.classList.contains('is-opening')).toBe(true);

    act(() => vi.advanceTimersByTime(80));
    expect(onEntered).toHaveBeenCalledOnce();

    act(() => root.unmount());
  });
});
