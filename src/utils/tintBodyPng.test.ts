import { describe, expect, it } from 'vitest';
import { bodyColourHex } from '../data/catalog';
import { isTintableBodyPixel, parseHexColour, tintBodyPixels } from './tintBodyPng';

function pixel(data: Uint8ClampedArray, offset = 0) {
  return [data[offset], data[offset + 1], data[offset + 2], data[offset + 3]];
}

describe('body PNG tint', () => {
  it('tints only the near-white body fill', () => {
    const data = Uint8ClampedArray.from([
      252, 252, 252, 255,
      16, 16, 16, 255,
      214, 2, 1, 255,
      251, 158, 236, 255
    ]);

    tintBodyPixels(data, '#006553');

    expect(pixel(data, 0)).toEqual([0x00, 0x65, 0x53, 255]);
    expect(pixel(data, 4)).toEqual([16, 16, 16, 255]);
    expect(pixel(data, 8)).toEqual([214, 2, 1, 255]);
    expect(pixel(data, 12)).toEqual([251, 158, 236, 255]);
  });

  it('leaves fully transparent pixels unchanged', () => {
    const data = Uint8ClampedArray.from([252, 252, 252, 0]);
    tintBodyPixels(data, '#B9843C');
    expect(pixel(data)).toEqual([252, 252, 252, 0]);
  });

  it('applies every customer body colour exactly', () => {
    for (const hex of Object.values(bodyColourHex)) {
      const data = Uint8ClampedArray.from([253, 253, 253, 255]);
      tintBodyPixels(data, hex);
      expect(pixel(data)).toEqual([...parseHexColour(hex), 255]);
    }
  });

  it('does not treat outlines or the mouth as tintable', () => {
    expect(isTintableBodyPixel(252, 252, 252)).toBe(true);
    expect(isTintableBodyPixel(8, 8, 8)).toBe(false);
    expect(isTintableBodyPixel(214, 2, 1)).toBe(false);
    expect(isTintableBodyPixel(251, 158, 236)).toBe(false);
  });
});
