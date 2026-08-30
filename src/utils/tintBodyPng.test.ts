import { describe, expect, it } from 'vitest';
import { bodyColourHex } from '../data/catalog';
import { isTintableBodyPixel, parseHexColour, tintBodyImageData } from './tintBodyPng';

function pixel(data: ImageData, offset = 0) {
  return [data.data[offset], data.data[offset + 1], data.data[offset + 2], data.data[offset + 3]];
}

describe('body PNG tint', () => {
  it('tints only the near-white body fill', () => {
    const data = new ImageData(2, 2);
    data.data.set([
      252, 252, 252, 255,
      16, 16, 16, 255,
      214, 2, 1, 255,
      251, 158, 236, 255
    ]);

    tintBodyImageData(data, '#006553');

    expect(pixel(data, 0)).toEqual([0x00, 0x65, 0x53, 255]);
    expect(pixel(data, 4)).toEqual([16, 16, 16, 255]);
    expect(pixel(data, 8)).toEqual([214, 2, 1, 255]);
    expect(pixel(data, 12)).toEqual([251, 158, 236, 255]);
  });

  it('leaves fully transparent pixels unchanged', () => {
    const data = new ImageData(1, 1);
    data.data.set([252, 252, 252, 0]);
    tintBodyImageData(data, '#B9843C');
    expect(pixel(data)).toEqual([252, 252, 252, 0]);
  });

  it('applies every customer body colour exactly', () => {
    for (const hex of Object.values(bodyColourHex)) {
      const data = new ImageData(1, 1);
      data.data.set([253, 253, 253, 255]);
      tintBodyImageData(data, hex);
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
