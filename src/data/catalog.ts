import accessoryData from './accessory.json';
import bodyData from './body.json';
import eyesData from './eyes.json';
import glassesData from './glasses.json';
import hairData from './hair.json';
import noseData from './nose.json';
import outfitData from './outfit.json';
import shoesData from './shoes.json';
import type { AssetOption, Category, SelectionState, StepDefinition } from '../types';
import { BETA_KIT_ENABLED, BETA_KIT_IDS } from './betaKit';

const asOptions = (items: unknown) => items as AssetOption[];

const thumbnailModules = import.meta.glob('../../assets/thumbnails/*.{png,webp}', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>;

const thumbnailUrls = Object.fromEntries(
  Object.entries(thumbnailModules).map(([path, url]) => [path.split('/').pop() ?? path, url])
) as Record<string, string>;

const thumbnailUrl = (filename: string | undefined) => (filename ? thumbnailUrls[filename] ?? null : null);

const eyeThumbnailById: Record<string, string> = {
  'round-45-dome-plain': 'eyes_round-flat-plain.webp',
  'round-45-flat-plain': 'eyes_round-flat-plain.webp',
  'round-45-flat-blue-eyelids': 'eyes_round-flat-blue-lids.webp',
  'round-45-flat-green-eyelids': 'eyes_round-flat-green-lids.webp',
  'round-45-flat-orange-lashes': 'eyes_round-flat-orange-lashes.webp',
  'round-45-flat-pink-lashes': 'eyes_round-flat-pink-lashes.webp'
};

const outfitThumbnailById: Record<string, string> = {
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

function thumbnailCandidates(option: AssetOption): string[] {
  const { category, id } = option;
  const names: string[] = [];

  if (category === 'eyes' && eyeThumbnailById[id]) names.push(eyeThumbnailById[id]);
  if (category === 'nose' && option.shape) names.push(`nose_${option.shape}.webp`);
  if (category === 'glasses') {
    names.push(`glasses_${id}.webp`);
    names.push(`glasses_${id.replace(/-xl$/, '')}.webp`);
  }
  if (category === 'outfit' && outfitThumbnailById[id]) names.push(outfitThumbnailById[id]);

  names.push(`${category}_${id}.webp`);
  names.push(`${category}_${id}.png`);
  return names;
}

export const fullCatalog: Record<Category, AssetOption[]> = {
  body: asOptions(bodyData),
  eyes: asOptions(eyesData),
  nose: asOptions(noseData),
  glasses: asOptions(glassesData),
  hair: asOptions(hairData),
  outfit: asOptions(outfitData),
  shoes: asOptions(shoesData),
  accessory: asOptions(accessoryData)
};

function applyBetaKit(category: Category, options: AssetOption[]) {
  if (!BETA_KIT_ENABLED) return options;
  const byId = new Map(options.map((option) => [option.id, option]));
  return BETA_KIT_IDS[category].flatMap((id) => {
    const option = byId.get(id);
    return option ? [option] : [];
  });
}

export const catalog: Record<Category, AssetOption[]> = {
  body: applyBetaKit('body', fullCatalog.body),
  eyes: applyBetaKit('eyes', fullCatalog.eyes),
  nose: applyBetaKit('nose', fullCatalog.nose),
  glasses: applyBetaKit('glasses', fullCatalog.glasses),
  hair: applyBetaKit('hair', fullCatalog.hair),
  outfit: applyBetaKit('outfit', fullCatalog.outfit),
  shoes: applyBetaKit('shoes', fullCatalog.shoes),
  accessory: applyBetaKit('accessory', fullCatalog.accessory)
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

export const defaultSelections = (): SelectionState => ({
  body: null,
  eyes: null,
  nose: null,
  glasses: null,
  hair: null,
  outfit: null,
  shoes: null,
  accessory: null
});

export const categoryCount = Object.values(catalog).reduce((total, options) => total + options.length, 0);
export const fullCategoryCount = Object.values(fullCatalog).reduce((total, options) => total + options.length, 0);

export function resolveThumbnail(option: AssetOption): string | null {
  if (option.category === 'body') return null;

  for (const filename of thumbnailCandidates(option)) {
    const url = thumbnailUrl(filename);
    if (url) return url;
  }
  return null;
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

export const bodyColourHex: Record<string, string> = {
  'dark-green': '#006553',
  'caramel-brown': '#B9843C',
  yellow: '#FBEE01',
  'light-orange': '#E6B327',
  blue: '#58AAD6',
  'light-purple': '#BCAFD2',
  pink: '#EF9DC3',
  beige: '#F3DABB',
  green: '#7BAA37'
};

export function optionColour(option: AssetOption | null, fallback = '#79513b'): string {
  if (!option) return fallback;
  if (option.category === 'body') return bodyColourHex[option.id] ?? fallback;
  return colourHex[option.colour ?? ''] ?? colourHex[option.id] ??
    Object.entries(colourHex).find(([name]) => option.id.endsWith(`-${name}`))?.[1] ?? fallback;
}
