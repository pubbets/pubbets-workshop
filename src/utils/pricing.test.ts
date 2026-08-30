import { describe, expect, it } from 'vitest';
import { defaultSelections, categoryCount, fullCategoryCount } from '../data/catalog';
import { BETA_KIT_COUNT } from '../data/betaKit';
import { calculateTotal } from './pricing';

describe('v1 catalog and pricing', () => {
  it('exposes the closed beta kit in the app catalog while JSON keeps all 409 records', () => {
    expect(fullCategoryCount).toBe(409);
    expect(categoryCount).toBe(BETA_KIT_COUNT);
    expect(categoryCount).toBe(41);
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
