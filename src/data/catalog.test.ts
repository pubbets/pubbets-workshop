import { describe, expect, it } from 'vitest';
import { bodyColourHex, optionColour } from './catalog';
import type { AssetOption } from '../types';

function option(category: AssetOption['category'], id: string, colour?: string): AssetOption {
  return {
    id,
    label: id,
    category,
    colour,
    riveArtboardRef: 'Puppet/Test',
    colourBindable: true,
    thumbnailPath: ''
  };
}

describe('approved body colours', () => {
  it('contains all nine customer body colours', () => {
    expect(Object.keys(bodyColourHex)).toHaveLength(9);
  });

  it('uses the supplied body palette exactly', () => {
    expect(optionColour(option('body', 'dark-green'))).toBe('#006553');
    expect(optionColour(option('body', 'caramel-brown'))).toBe('#B9843C');
    expect(optionColour(option('body', 'light-orange'))).toBe('#E6B327');
    expect(optionColour(option('body', 'green'))).toBe('#7BAA37');
    expect(optionColour(option('body', 'blue'))).toBe('#58AAD6');
    expect(optionColour(option('body', 'light-purple'))).toBe('#BCAFD2');
  });

  it('does not replace the shared hair and nose colour palette', () => {
    expect(optionColour(option('nose', 'round-medium-green', 'green'))).toBe('#6eae28');
  });
});
