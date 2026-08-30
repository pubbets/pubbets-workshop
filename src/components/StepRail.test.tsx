import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { steps } from '../data/catalog';
import { StepRail } from './StepRail';

describe('StepRail', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('renders icon badges instead of step numbers', () => {
    const onStepChange = vi.fn();
    const root = createRoot(container);

    act(() => {
      root.render(<StepRail steps={steps} activeStep={1} completedThrough={0} onStepChange={onStepChange} />);
    });

    const tokens = [...container.querySelectorAll('.step-token')];
    expect(tokens).toHaveLength(9);
    expect(tokens[0]?.classList.contains('is-complete')).toBe(true);
    expect(tokens[1]?.getAttribute('aria-current')).toBe('step');
    expect(tokens[0]?.querySelector('.step-token__icon')?.textContent).toBe(steps[0].icon);
    expect(tokens[0]?.querySelector('.step-token__icon')?.textContent).not.toBe('1');
    expect(tokens[8]?.querySelector('.step-token__icon')?.textContent).toBe(steps[8].icon);

    act(() => root.unmount());
  });
});
