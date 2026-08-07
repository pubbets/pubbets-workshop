import { describe, expect, it } from 'vitest';
import { defaultSelections, categoryCount } from '../data/catalog';
import { calculateTotal } from './pricing';

describe('v1 catalog and pricing', () => {
  it('contains the generated launch records', () => {
    expect(categoryCount).toBe(409);
  });

  it('starts at the base price with free defaults', () => {
    expect(calculateTotal(199.95, defaultSelections())).toBe(199.95);
  });

  it('adds metadata surcharges', () => {
    const selections = defaultSelections();
    selections.accessory = {
      id: 'arm-rods', label: 'Arm rods', category: 'accessory', price: 10,
      riveArtboardRef: 'Puppet/Accessory', colourBindable: false, thumbnailPath: ''
    };
    expect(calculateTotal(199.95, selections)).toBe(209.95);
  });
});
