import accessoryData from './accessory.json';
import bodyData from './body.json';
import eyesData from './eyes.json';
import glassesData from './glasses.json';
import hairData from './hair.json';
import noseData from './nose.json';
import outfitData from './outfit.json';
import shoesData from './shoes.json';
import type { AssetOption, Category, SelectionState, StepDefinition } from '../types';

const asOptions = (items: unknown) => items as AssetOption[];

export const catalog: Record<Category, AssetOption[]> = {
  body: asOptions(bodyData),
  eyes: asOptions(eyesData),
  nose: asOptions(noseData),
  glasses: asOptions(glassesData),
  hair: asOptions(hairData),
  outfit: asOptions(outfitData),
  shoes: asOptions(shoesData),
  accessory: asOptions(accessoryData)
};

export const steps: StepDefinition[] = [
  { id: 'body', shortLabel: 'Body', title: 'Body colour', prompt: 'Choose your Pubbet colour', icon: '🧸' },
  { id: 'eyes', shortLabel: 'Eyes', title: 'Eye Studio', prompt: 'Choose your eye shape and style', icon: '👀' },
  { id: 'nose', shortLabel: 'Nose', title: 'Nose', prompt: 'Shape it, size it, colour it', icon: '👃' },
  { id: 'glasses', shortLabel: 'Glasses', title: 'Glasses', prompt: 'Add a little extra character', icon: '👓' },
  { id: 'hair', shortLabel: 'Hair', title: 'Hair', prompt: 'Pick a style and colour', icon: '💇' },
  { id: 'outfit', shortLabel: 'Outfit', title: 'Mix & Match', prompt: 'Dress your Pubbet for the occasion', icon: '👕' },
  { id: 'shoes', shortLabel: 'Shoes', title: 'Shoes', prompt: 'Finish the look from the feet up', icon: '👟' },
  { id: 'accessory', shortLabel: 'Extras', title: 'Extras', prompt: 'Add the finishing touches', icon: '⭐' },
  { id: 'review', shortLabel: 'Finish', title: 'Your Pubbet', prompt: 'Review your one-of-a-kind creation', icon: '🎁' }
];

export const basePrice = 199.95;

const find = (category: Category, id: string) =>
  catalog[category].find((option) => option.id === id) ?? catalog[category][0] ?? null;

export const defaultSelections = (): SelectionState => ({
  body: find('body', 'blue'),
  eyes: find('eyes', 'round-flat'),
  nose: find('nose', 'round-medium-beige'),
  glasses: null,
  hair: find('hair', 'round-base-brown'),
  outfit: null,
  shoes: null,
  accessory: null
});

export const categoryCount = Object.values(catalog).reduce((total, options) => total + options.length, 0);

export function resolveThumbnail(option: AssetOption): string | null {
  const id = option.id;
  switch (option.category) {
    case 'body': {
      const fileId = id === 'caramel-brown' ? 'caramel' : id;
      return `/thumbnails/body_${fileId}.webp`;
    }
    case 'eyes': {
      const eyeMap: Record<string, string> = {
        'round-flat': 'eyes_round-flat-plain.webp',
        'round-blue': 'eyes_round-flat-blue-lids.webp',
        'round-green': 'eyes_round-flat-green-lids.webp',
        'round-orange-lashes': 'eyes_round-flat-orange-lashes.webp',
        'round-pink-lashes': 'eyes_round-flat-pink-lashes.webp'
      };
      return eyeMap[id] ? `/thumbnails/${eyeMap[id]}` : null;
    }
    case 'nose':
      return option.shape ? `/thumbnails/nose_${option.shape.replaceAll('-', '-')}.webp` : null;
    case 'glasses': {
      const fileId = id.replace(/-xl$/, '');
      return `/thumbnails/glasses_${fileId}.webp`;
    }
    case 'outfit': {
      const outfitMap: Record<string, string> = {
        'blue-gingham-dress': 'outfit_blue-gingham-dress.webp',
        'apple-gingham-dress': 'outfit_apple-gingham-dress.webp',
        'pink-floral-dress-with-bag': 'outfit_pink-floral-dress.webp',
        'pink-pajamas': 'outfit_pink-pajamas.webp',
        'red-teddy-dress': 'outfit_red-teddy-dress.webp',
        'premium-boy-elf': 'outfit_premium-boy-elf.webp',
        'premium-girl-elf': 'outfit_premium-girl-elf.webp',
        'premium-bw-fashionista': 'outfit_premium-bw-fashionista.webp',
        'premium-tuxedo': 'outfit_premium-tuxedo.webp',
        'black-t': 'outfit_black-t.webp',
        'blue-t': 'outfit_blue-t.webp',
        'white-t': 'outfit_white-t.webp',
        'blue-jeans': 'outfit_blue-jeans.webp'
      };
      return outfitMap[id] ? `/thumbnails/${outfitMap[id]}` : null;
    }
    default:
      return null;
  }
}

export const colourHex: Record<string, string> = {
  beige: '#e9c596',
  black: '#27231f',
  blonde: '#e3b44d',
  blue: '#27a7df',
  brown: '#8b4b24',
  'caramel-brown': '#a85c2b',
  'dark-blue': '#2355a5',
  'dark-brown': '#5c331f',
  'dark-green': '#17694a',
  'dark-orange': '#d8661f',
  'dark-pink': '#ca3d78',
  'dark-purple': '#6f3f9c',
  green: '#6eae28',
  grey: '#8a8b8d',
  'light-blue': '#64c7ea',
  'light-brown': '#b9784f',
  'light-green': '#9fcb56',
  'light-orange': '#f08b24',
  'light-pink': '#f48fb1',
  'light-purple': '#a874d1',
  lilac: '#ae7fd2',
  orange: '#ec781c',
  pink: '#ef6eaa',
  purple: '#7546a8',
  red: '#db3b32',
  white: '#f8f0de',
  yellow: '#f2c72f'
};

export function optionColour(option: AssetOption | null, fallback = '#79513b'): string {
  if (!option) return fallback;
  return colourHex[option.colour ?? ''] ?? colourHex[option.id] ??
    Object.entries(colourHex).find(([name]) => option.id.endsWith(`-${name}`))?.[1] ?? fallback;
}
