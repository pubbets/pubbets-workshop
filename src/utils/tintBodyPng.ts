/** Replace only the near-white body fill; outlines and mouth stay as-drawn. */

const TINTABLE_SATURATION = 0.12;
const TINTABLE_LUMINANCE = 200;

export function parseHexColour(hex: string): [number, number, number] {
  const value = hex.startsWith('#') ? hex.slice(1) : hex;
  if (!/^[0-9a-fA-F]{6}$/.test(value)) {
    throw new Error(`Invalid body colour ${hex}`);
  }
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16)
  ];
}

export function isTintableBodyPixel(r: number, g: number, b: number): boolean {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return saturation < TINTABLE_SATURATION && luminance > TINTABLE_LUMINANCE;
}

export function tintBodyPixels(pixels: Uint8ClampedArray | Uint8Array, hex: string): void {
  const [tintR, tintG, tintB] = parseHexColour(hex);
  for (let index = 0; index < pixels.length; index += 4) {
    const alpha = pixels[index + 3];
    if (alpha === 0) continue;
    const red = pixels[index];
    const green = pixels[index + 1];
    const blue = pixels[index + 2];
    if (!isTintableBodyPixel(red, green, blue)) continue;
    pixels[index] = tintR;
    pixels[index + 1] = tintG;
    pixels[index + 2] = tintB;
  }
}

export function tintBodyImageData(imageData: ImageData, hex: string): ImageData {
  tintBodyPixels(imageData.data, hex);
  return imageData;
}
