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

  it('shows the closed outfit kit as one honest menu with real thumbnails where files exist', () => {
    const root = createRoot(container);

    act(() => {
      root.render(
        <OptionPanel
          category="outfit"
          options={catalog.outfit}
          selected={null}
          onSelect={vi.fn()}
        />
      );
    });

    const cards = [...container.querySelectorAll('.option-grid--outfit .option-card')];
    expect(cards).toHaveLength(6);
    expect(container.querySelector('.group-filter')).toBeNull();
    expect(container.querySelectorAll('.option-card__image img')).toHaveLength(5);
    expect(container.querySelector('img[src*="outfit_blue-gingham-dress"]')).toBeTruthy();
    expect(container.querySelector('img[src*="outfit_denim-overalls"]')).toBeNull();

    act(() => root.unmount());
  });

  it('keeps felt swatches for body colour and still walks the smaller eye set', () => {
    const onSelect = vi.fn();
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

    expect(container.querySelectorAll('.option-card__swatch')).toHaveLength(catalog.body.length);
    expect(container.querySelector('.option-card__image')).toBeNull();

    act(() => {
      root.render(
        <OptionPanel
          category="eyes"
          options={catalog.eyes}
          selected={null}
          onSelect={onSelect}
        />
      );
    });

    const round = [...container.querySelectorAll('button')].find((button) => button.textContent?.includes('Round'));
    act(() => round?.click());
    expect(container.querySelector('.wizard-previous')).toBeTruthy();

    const fortyFive = [...container.querySelectorAll('button')].find((button) => button.textContent?.includes('45'));
    act(() => fortyFive?.click());

    const flat = [...container.querySelectorAll('button')].find((button) => button.textContent?.includes('Flat'));
    act(() => flat?.click());

    const labels = [...container.querySelectorAll('.option-card__label')].map((node) => node.textContent);
    expect(labels).toEqual(expect.arrayContaining(['Plain', 'Pink + Lashes']));
    expect(container.querySelector('img[src*="eyes_round-flat-pink-lashes"]')).toBeTruthy();

    act(() => root.unmount());
  });

  it('walks the smaller nose kit through shape, size, and colour', () => {
    const onSelect = vi.fn();
    const root = createRoot(container);

    act(() => {
      root.render(
        <OptionPanel
          category="nose"
          options={catalog.nose}
          selected={null}
          onSelect={onSelect}
        />
      );
    });

    const labels = [...container.querySelectorAll('.option-card__label')].map((node) => node.textContent);
    expect(labels).toEqual(['Round', 'Triangle', 'Human']);
    expect(container.querySelector('img[src*="nose_round"]')).toBeTruthy();
    expect(container.querySelector('img[src*="nose_triangle"]')).toBeTruthy();
    expect(container.querySelector('img[src*="nose_human"]')).toBeTruthy();

    const triangle = [...container.querySelectorAll('button')].find((button) => button.textContent?.includes('Triangle'));
    act(() => triangle?.click());

    const small = [...container.querySelectorAll('button')].find((button) => button.textContent?.includes('Small'));
    act(() => small?.click());

    const colours = [...container.querySelectorAll('.option-card__label')].map((node) => node.textContent);
    expect(colours).toEqual(['Brown', 'Pink']);
    act(() => {
      [...container.querySelectorAll('button')].find((button) => button.textContent?.includes('Pink'))?.click();
    });
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'triangle-small-pink' }));

    act(() => root.unmount());
  });
});
