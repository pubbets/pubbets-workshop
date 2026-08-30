import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { catalog, defaultSelections } from '../data/catalog';
import { PuppetPreview } from './PuppetPreview';

describe('PuppetPreview', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('renders the Canva PNG base on the wooden plinth instead of the SVG body', () => {
    const selections = defaultSelections();
    selections.body = catalog.body.find((option) => option.id === 'dark-green') ?? catalog.body[0];
    const root = createRoot(container);

    act(() => {
      root.render(<PuppetPreview selections={selections} motionKey={1} bodyOnly />);
    });

    const stage = container.querySelector('.puppet-stage');
    expect(stage?.getAttribute('data-preview-engine')).toBe('png-base');
    expect(stage?.querySelector('.puppet-body-base')).toBeTruthy();
    expect(stage?.querySelector('.wooden-plinth')).toBeTruthy();
    expect(stage?.querySelector('.puppet-feature-overlays')).toBeNull();
    expect(container.querySelector('g.puppet-body')).toBeNull();

    act(() => root.unmount());
  });

  it('keeps instant close-up framing for face steps and full-body otherwise', () => {
    const selections = defaultSelections();
    selections.body = catalog.body[0];
    selections.eyes = catalog.eyes[0];
    const root = createRoot(container);

    act(() => {
      root.render(<PuppetPreview selections={selections} closeUp motionKey={2} />);
    });
    expect(container.querySelector('.puppet-stage')?.classList.contains('is-close')).toBe(true);
    expect(container.querySelector('.puppet-feature-overlays')).toBeTruthy();

    act(() => {
      root.render(<PuppetPreview selections={selections} closeUp={false} motionKey={3} />);
    });
    expect(container.querySelector('.puppet-stage')?.classList.contains('is-close')).toBe(false);

    act(() => root.unmount());
  });
});
