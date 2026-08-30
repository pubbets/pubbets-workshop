import { describe, expect, it } from 'vitest';
import { BETA_KIT_IDS } from './betaKit';
import { bodyColourHex, catalog, fullCatalog, optionColour, resolveThumbnail } from './catalog';
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

describe('closed beta kit catalog', () => {
  it('keeps every allowlisted id in the generated JSON', () => {
    for (const [category, ids] of Object.entries(BETA_KIT_IDS)) {
      const available = new Set(fullCatalog[category as AssetOption['category']].map((item) => item.id));
      for (const id of ids) {
        expect(available.has(id), `${category}/${id} missing from JSON`).toBe(true);
      }
    }
  });

  it('exports only the allowlisted records to the app', () => {
    for (const [category, ids] of Object.entries(BETA_KIT_IDS)) {
      expect(catalog[category as AssetOption['category']].map((item) => item.id)).toEqual([...ids]);
    }
  });
});

describe('option-card thumbnails', () => {
  it('maps kit items to bundled files and never uses public /thumbnails/ paths', () => {
    const tuxedo = catalog.outfit.find((item) => item.id === 'premium-tuxedo');
    const glasses = catalog.glasses.find((item) => item.id === 'round-thick-black-xl');
    const pinkLashes = catalog.eyes.find((item) => item.id === 'round-45-flat-pink-lashes');
    const nose = catalog.nose.find((item) => item.id === 'round-medium-caramel-brown');

    expect(tuxedo && resolveThumbnail(tuxedo)).toMatch(/outfit_premium-tuxedo\.webp/);
    expect(glasses && resolveThumbnail(glasses)).toMatch(/glasses_round-thick-black\.webp/);
    expect(pinkLashes && resolveThumbnail(pinkLashes)).toMatch(/eyes_round-flat-pink-lashes\.webp/);
    expect(nose && resolveThumbnail(nose)).toMatch(/nose_round\.webp/);
    expect(resolveThumbnail(tuxedo!)).not.toContain('/thumbnails/');
  });

  it('skips body swatches and missing disk files instead of inventing paths', () => {
    const body = catalog.body[0];
    const beady = catalog.eyes.find((item) => item.id === 'beady-big-black');
    const overalls = catalog.outfit.find((item) => item.id === 'denim-overalls');
    const hair = catalog.hair.find((item) => item.id === 'messy-brown');

    expect(resolveThumbnail(body)).toBeNull();
    expect(beady && resolveThumbnail(beady)).toBeNull();
    expect(overalls && resolveThumbnail(overalls)).toBeNull();
    expect(hair && resolveThumbnail(hair)).toBeNull();
  });
});
