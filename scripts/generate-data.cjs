// generate-data.js
// Builds v1.0 category data files matching DECISIONS.md schema.
// Source: legacy Pubbets Lab config structure (body/eyes/nose/glasses/hair/
// outfit/shoes/accessory), reshaped — gender/subgroup dropped, riveArtboardRef
// + colourBindable + tier fields added.
// Run: node scripts/generate-data.js  →  outputs src/data/*.json (402 assets)

const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'src', 'data');
fs.mkdirSync(OUT, { recursive: true });

function write(name, data) {
  fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify(data, null, 2));
  console.log(`${name}.json — ${Array.isArray(data) ? data.length : Object.keys(data).length} entries`);
}

const titleCase = (s) => s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

// ── BODY ─────────────────────────────────────────────────────────────
const bodyColours = ['dark-green','caramel-brown','light-purple','blue','green','yellow','light-orange','pink','beige'];
const body = bodyColours.map(id => ({
  id, label: titleCase(id), category: 'body',
  riveArtboardRef: 'Puppet/Body', colourBindable: true,
  thumbnailPath: `thumbnails/body_${id}-tn.webp`,
}));
write('body', body);

// ── EYES (nested: shape family -> style -> colour variant) ────────────
const eyes = [
  { id: 'round-flat',          label: 'Plain',            group: 'round-flat',      riveArtboardRef: 'Puppet/Eyes/RoundFlat' },
  { id: 'round-blue',          label: 'Blue Eyelids',     group: 'round-flat',      riveArtboardRef: 'Puppet/Eyes/RoundFlat' },
  { id: 'round-green',         label: 'Green Eyelids',    group: 'round-flat',      riveArtboardRef: 'Puppet/Eyes/RoundFlat' },
  { id: 'round-orange-lashes', label: 'Orange + Lashes',  group: 'round-flat',      riveArtboardRef: 'Puppet/Eyes/RoundFlat' },
  { id: 'round-pink-lashes',   label: 'Pink + Lashes',    group: 'round-flat',      riveArtboardRef: 'Puppet/Eyes/RoundFlat' },
  { id: 'round-half-dome',     label: 'Dome',             group: 'round-half-dome', riveArtboardRef: 'Puppet/Eyes/Dome', autoSelect: true },
  { id: 'flat-oval',           label: 'Plain',            group: 'oval',            riveArtboardRef: 'Puppet/Eyes/Oval' },
  { id: 'oval-yellow',         label: 'Yellow Eyelids',   group: 'oval',            riveArtboardRef: 'Puppet/Eyes/Oval' },
  { id: 'oval-red',            label: 'Red Eyelids',      group: 'oval',            riveArtboardRef: 'Puppet/Eyes/Oval' },
  { id: 'oval-blue-lashes',    label: 'Blue + Lashes',    group: 'oval',            riveArtboardRef: 'Puppet/Eyes/Oval' },
  { id: 'oval-pink-lashes',    label: 'Pink + Lashes',    group: 'oval',            riveArtboardRef: 'Puppet/Eyes/Oval' },
  { id: 'small-beady',         label: 'Small Beady',      group: 'beady',           riveArtboardRef: 'Puppet/Eyes/Beady' },
  { id: 'large-beady',         label: 'Large Beady',      group: 'beady',           riveArtboardRef: 'Puppet/Eyes/Beady' },
].map(o => ({ ...o, category: 'eyes', colourBindable: false, thumbnailPath: `thumbnails/eyes_${o.id}-tn.png` }));
write('eyes', eyes);

// ── NOSE (procedural: shape x size x colour, matches legacy pattern) ──
const noseShapes = ['round','oblong','tear-drop','human','triangle'];
const noseSizes = ['small','medium','large'];
const noseColours = ['beige','caramel-brown','dark-blue','dark-brown','dark-green','dark-orange','dark-pink','dark-purple','light-blue','light-brown','light-green','light-orange','light-pink','light-purple','red','yellow'];
const triangleColours = ['blue','brown','green','pink','red','yellow'];
const nose = [];
for (const shape of noseShapes) {
  const sizes = shape === 'triangle' ? ['small','large'] : noseSizes;
  const colours = shape === 'triangle' ? triangleColours : noseColours;
  for (const size of sizes) {
    for (const colour of colours) {
      const id = `${shape}-${size}-${colour}`;
      nose.push({
        id, label: `${titleCase(shape)} ${titleCase(size)} ${titleCase(colour)}`,
        category: 'nose', shape, size, colour,
        riveArtboardRef: 'Puppet/Nose', colourBindable: true,
        thumbnailPath: `thumbnails/nose_${id}-tn.png`,
      });
    }
  }
}
write('nose', nose);

// ── GLASSES ─────────────────────────────────────────────────────────
const glasses = [
  ...['round-thin-black','round-thin-red','retro-black','retro-red','square-thin-black','square-thin-white','square-thin-tortoiseshell'].map(id => ({ id, group: 'classic' })),
  ...['square-thick-black-xl','square-thick-white-xl','square-thick-red-xl','round-thick-black-xl','round-thick-white-xl','hexagonal-thick-black-xl','hexagonal-thick-white-xl'].map(id => ({ id, group: 'xl' })),
  ...['buggy-yellow','buggy-purple','buggy-red','buggy-green','buggy-black'].map(id => ({ id, group: 'buggy' })),
].map(o => ({
  id: o.id, label: titleCase(o.id.replace(/-xl$/, '')), category: 'glasses', group: o.group,
  price: 14.95, riveArtboardRef: 'Puppet/Glasses', colourBindable: false,
  thumbnailPath: `thumbnails/glasses_${o.id}-tn.png`,
}));
write('glasses', glasses);

// ── HAIR ────────────────────────────────────────────────────────────
const hairGroups = [
  { group: 'round-base',  colours: ['black','brown','grey','yellow','pink','lilac','red','orange','light-blue','dark-blue','dark-green','purple'] },
  { group: 'v-hairline',  colours: ['black','brown','grey','pink','sandy-yellow','white'] },
  { group: 'side-part',   colours: ['black','brown','grey','sandy-yellow','white','yellow','pink','lilac','red','orange','light-blue','dark-blue','purple','dark-green'] },
  { group: 'messy',       colours: ['black','blonde','brown','red'] },
  { group: 'wavy',        colours: ['black','blonde','grey','light-brown','red'] },
  { group: 'straight',    colours: ['black','blonde','light-brown','dark-brown','grey','red'] },
  { group: 'dreadlocks-short', colours: ['black','blonde','brown','red'], price: 5 },
  { group: 'dreadlocks-medium', colours: ['black','blonde','brown','grey'], price: 5 },
  { group: 'afro',        colours: ['black','dark-brown','grey','light-brown'], price: 5 },
];
const hair = [];
for (const g of hairGroups) {
  for (const c of g.colours) {
    const id = `${g.group}-${c}`;
    hair.push({
      id, label: titleCase(c), category: 'hair', group: g.group,
      ...(g.price ? { price: g.price } : {}),
      riveArtboardRef: 'Puppet/Hair', colourBindable: true,
      thumbnailPath: `thumbnails/hair_${id}-tn.png`,
    });
  }
}
write('hair', hair);

// ── OUTFIT (layered: top/bottom/over/looks/premium) ───────────────────
const outfitDefs = [
  ...['blue-gingham-dress','apple-gingham-dress','pink-floral-dress-with-bag','violet-floral-dress-with-bag','red-teddy-dress','maroon-teddy-dress','sunflower-2-dress','sunflower-1-dress-with-bag','pink-pajamas'].map(id => ({ id, group: 'looks' })),
  ...['premium-bw-fashionista','premium-boy-elf','premium-girl-elf','premium-tuxedo','premium-suit-and-tie','premium-lil-red'].map(id => ({ id, group: 'premium', price: 12.95 })),
  ...['blouse-black-white-striped','tshirt-blue-yellow-collar','tshirt-yellow-green-collar','black-t','white-t','blue-t','yellow-t','red-t','green-t','rainbow-t','retro-t-1','retro-t-2','retro-t-3','polo-white-crowns','polo-dark-blue-crowns','jersey-blue','jersey-black','jersey-yellow','jersey-green','jersey-red'].map(id => ({ id, group: 'top' })),
  ...['black-pants','blue-pants','blue-3-4-pants','blue-jeans','athletic-shorts-red','athletic-shorts-blue','athletic-shorts-black','athletic-shorts-green','athletic-shorts-yellow'].map(id => ({ id, group: 'bottom' })),
  ...['overalls-blue-teddy','overalls-girls-black','blue-check-shirt','orange-check-shirt','red-check-shirt','overshirt-blue-plaid','overshirt-orange-plaid','overshirt-red-plaid','red-plaid-hoodie','yellow-plaid-hoodie','black-white-hoodie','blue-plaid-hoodie','pink-plaid-hoodie','tan-plaid-hoodie','black-white-button-up','brown-blue-button-up','pink-plaid-button-up','blue-plaid-button-up','pale-yellow-jacket','denim-overalls'].map(id => ({ id, group: 'over', price: 5 })),
];
const outfit = outfitDefs.map(o => ({
  id: o.id, label: titleCase(o.id), category: 'outfit', group: o.group,
  ...(o.price ? { price: o.price } : {}),
  riveArtboardRef: `Puppet/Outfit/${titleCase(o.group).replace(/\s/g,'')}`, colourBindable: false,
  textureAssetPath: `outfit_${o.id}-body.webp`,
  thumbnailPath: `thumbnails/outfit_${o.id}-tn.png`,
}));
write('outfit', outfit);

// ── SHOES ───────────────────────────────────────────────────────────
const shoeDefs = [
  ...['black','green','light-blue','red','yellow','pink','beige','white','brown'].map(id => ({ id })),
  ...['premium-blue-denim','premium-silver','premium-gold','premium-blue-space-print','premium-green-garden-print'].map(id => ({ id, price: 5 })),
  ...['blue-flower','white-flower','black-loafers','black-loafers-2','brown-loafers','black-slip-ons','brown-slip-ons','crochet-pink-flowers','crochet-white-flowers','crochet-yellow-flowers','shiny-black-bows','shiny-pink-bows','shiny-red-bows','shiny-white-bows','lace-white-bows','lace-black-bows','lace-red-bows','lace-pink-bows'].map(id => ({ id })),
];
const shoes = shoeDefs.map(o => ({
  id: o.id, label: titleCase(o.id), category: 'shoes',
  ...(o.price ? { price: o.price } : {}),
  riveArtboardRef: 'Puppet/Shoes', colourBindable: false,
  thumbnailPath: `thumbnails/shoes_${o.id}-tn.png`,
}));
write('shoes', shoes);

// ── ACCESSORY ───────────────────────────────────────────────────────
const accessory = [
  { id: 'arm-rods-2pcs', label: 'Arm Rods 2Pcs', price: 10 },
  { id: 'extendable-arm-rods-2pcs', label: 'Extendable Arm Rods 2Pcs', price: 10 },
].map(o => ({ ...o, category: 'accessory', riveArtboardRef: 'Puppet/Accessory', colourBindable: false, thumbnailPath: `thumbnails/accessories_${o.id}-tn.png` }));
write('accessory', accessory);

console.log('\nDone. Total assets:', body.length + eyes.length + nose.length + glasses.length + hair.length + outfit.length + shoes.length + accessory.length);
