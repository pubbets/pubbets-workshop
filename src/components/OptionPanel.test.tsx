import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { catalog } from '../data/catalog';
import { OptionPanel } from './OptionPanel';

describe('OptionPanel', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('keeps skip out of the body colour grid', () => {
    const root = createRoot(container);

    act(() => {
      root.render(
        <OptionPanel
          category="body"
          options={catalog.body}
          selected={null}
          onSelect={vi.fn()}
        />
      );
    });

    expect(container.querySelectorAll('.option-grid--body .option-card')).toHaveLength(catalog.body.length);
    expect(container.querySelector('[aria-label="Skip this step"]')).toBeNull();
    expect(container.textContent).not.toContain('Skip this step');

    act(() => root.unmount());
  });

  it('shows three featured eye-shape cards and no skip card in the grid', () => {
    const root = createRoot(container);

    act(() => {
      root.render(
        <OptionPanel
          category="eyes"
          options={catalog.eyes}
          selected={null}
          onSelect={vi.fn()}
        />
      );
    });

    const cards = [...container.querySelectorAll('.option-grid--eyes .option-card')];
    expect(cards).toHaveLength(3);
    expect(cards.map((card) => card.querySelector('.option-card__label')?.textContent)).toEqual(['Black beady', 'Round', 'Oval']);
    expect(container.querySelector('.option-grid [aria-label="Skip this step"]')).toBeNull();
    expect(container.querySelector('.wizard-previous')).toBeNull();

    act(() => root.unmount());
  });
});
