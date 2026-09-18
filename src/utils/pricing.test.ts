import { describe, expect, it } from 'vitest';
import { defaultSelections, categoryCount } from '../data/catalog';
import { calculateTotal } from './pricing';

describe('v1 catalog and pricing', () => {
  it('contains the generated launch records', () => {
    // 472 = 409 (old) - 64 (old outfits) + 121 (new outfit catalog) + 6 (body 9→15)
    expect(categoryCount).toBe(472);
  });

  it('applies skip discounts when outfit and hair are unselected', () => {
    // Base 199.95, no outfit (-14.95) and no hair (-9.95) = 175.05
    expect(calculateTotal(199.95, defaultSelections())).toBe(175.05);
  });

  it('adds metadata surcharges', () => {
    const selections = defaultSelections();
    selections.accessory = {
      id: 'arm-rods', label: 'Arm rods', category: 'accessory', price: 10,
      riveArtboardRef: 'Puppet/Accessory', colourBindable: false, thumbnailPath: ''
    };
    // 199.95 + 10 (arm rods) - 14.95 (no outfit) - 9.95 (no hair) = 185.05
    expect(calculateTotal(199.95, selections)).toBe(185.05);
  });
});
