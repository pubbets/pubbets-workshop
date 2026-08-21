import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import hair from '../data/hair.json';
import outfit from '../data/outfit.json';
import type { AssetOption } from '../types';
import { OptionPanel } from './OptionPanel';

let container: HTMLDivElement;
let root: Root;

function renderPanel(category: 'hair' | 'outfit', options: AssetOption[], onSelect = vi.fn()) {
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  act(() => root.render(<OptionPanel category={category} options={options} selected={null} onSelect={onSelect} />));
  return onSelect;
}

function clickLabel(label: string) {
  const button = [...container.querySelectorAll('button')].find((item) => item.textContent?.includes(label));
  expect(button).toBeTruthy();
  act(() => button!.click());
}

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
});

describe('guided choice panels', () => {
  it('guides hair from style to colour without completing the step early', () => {
    const onSelect = renderPanel('hair', hair as AssetOption[]);
    expect(container.textContent).toContain('Hair style');

    clickLabel('Round base');

    expect(container.textContent).toContain('Hair colour');
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('guides outfits from type to the choices in that type', () => {
    const onSelect = renderPanel('outfit', outfit as AssetOption[]);
    expect(container.textContent).toContain('What are you looking for?');

    clickLabel('Complete looks');

    expect(container.textContent).toContain('Blue Gingham Dress');
    expect(container.textContent).not.toContain('Black T-Shirt');
    expect(onSelect).not.toHaveBeenCalled();
  });
});
