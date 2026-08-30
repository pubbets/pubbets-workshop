import type { Category } from '../types';

/**
 * Closed 14-day workshop-preview allowlist.
 * Full generated records stay in src/data/*.json. Flip BETA_KIT_ENABLED in
 * catalog.ts (or remove the filter) to restore the 409-record in-app catalog.
 */
export const BETA_KIT_ENABLED = true;

export const BETA_KIT_IDS: Record<Category, readonly string[]> = {
  body: [
    'dark-green',
    'caramel-brown',
    'light-purple',
    'blue',
    'green',
    'yellow',
    'light-orange',
    'pink',
    'beige'
  ],
  eyes: [
    'round-45-flat-plain',
    'round-45-flat-pink-lashes',
    'oval-65x40-flat-plain',
    'beady-big-black'
  ],
  nose: [
    'round-medium-caramel-brown',
    'round-medium-light-pink',
    'triangle-small-brown',
    'triangle-small-pink',
    'human-medium-caramel-brown',
    'human-medium-light-pink'
  ],
  glasses: [
    'round-thin-black',
    'square-thin-tortoiseshell',
    'buggy-yellow',
    'round-thick-black-xl'
  ],
  hair: [
    'round-base-black',
    'round-base-yellow',
    'messy-brown',
    'side-part-pink',
    'afro-black',
    'wavy-blonde'
  ],
  outfit: [
    'blue-gingham-dress',
    'black-t',
    'blue-jeans',
    'pink-pajamas',
    'premium-tuxedo',
    'denim-overalls'
  ],
  shoes: [
    'black',
    'red',
    'brown-loafers',
    'shiny-black-bows'
  ],
  accessory: [
    'arm-rods-2pcs',
    'extendable-arm-rods-2pcs'
  ]
};

export const BETA_KIT_COUNT = Object.values(BETA_KIT_IDS).reduce((total, ids) => total + ids.length, 0);
