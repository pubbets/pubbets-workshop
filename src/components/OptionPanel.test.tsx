import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { catalog } from '../data/catalog';
import { OptionPanel } from './OptionPanel';

describe('OptionPanel eye wizard', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
  });

  afterEach(() => container.remove());

  const buttonNamed = (name: string) =>
    [...container.querySelectorAll('button')].find((button) => button.textContent?.includes(name));

  it('does not preselect choices and skips the redundant Round size stage', () => {
    const onSelect = vi.fn();
    const root = createRoot(container);

    act(() => root.render(
      <OptionPanel category="eyes" options={catalog.eyes} selected={null} touched={false} onSelect={onSelect} />
    ));

    expect(container.querySelector('.option-card.is-selected')).toBeNull();
    act(() => buttonNamed('Round')?.click());

    expect(container.textContent).toContain('Style');
    expect(container.textContent).not.toContain('Size');
    expect(container.querySelector('.option-card.is-selected')).toBeNull();

    act(() => buttonNamed('Dome')?.click());
    expect(container.textContent).toContain('Confirm');
    expect(container.querySelector('.option-card.is-selected')).toBeNull();
    expect(onSelect).not.toHaveBeenCalled();

    act(() => buttonNamed('Plain')?.click());
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'round-45-dome-plain' }));

    act(() => root.unmount());
  });

  it('keeps Skip this step outside the eye option grid', () => {
    const root = createRoot(container);
    act(() => root.render(
      <OptionPanel category="eyes" options={catalog.eyes} selected={null} touched={false} onSelect={vi.fn()} />
    ));

    const skip = container.querySelector('.skip-step-row');
    expect(skip).not.toBeNull();
    expect(skip?.closest('.option-grid')).toBeNull();

    act(() => root.unmount());
  });
});
