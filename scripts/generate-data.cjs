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
const labelOverrides = {
  'premium-bw-fashionista': 'Premium Black & White Fashionista',
  'premium-lil-red': 'Premium Little Red',
  'blouse-black-white-striped': 'Black & White Striped Blouse',
  'tshirt-blue-yellow-collar': 'Blue T-Shirt with Yellow Collar',
  'tshirt-yellow-green-collar': 'Yellow T-Shirt with Green Collar',
  'black-t': 'Black T-Shirt',
  'white-t': 'White T-Shirt',
  'blue-t': 'Blue T-Shirt',
  'yellow-t': 'Yellow T-Shirt',
  'red-t': 'Red T-Shirt',
  'green-t': 'Green T-Shirt',
  'rainbow-t': 'Rainbow T-Shirt',
  'retro-t-1': 'Retro T-Shirt 1',
  'retro-t-2': 'Retro T-Shirt 2',
  'retro-t-3': 'Retro T-Shirt 3',
  'polo-white-crowns': 'White Crown Polo',
  'polo-dark-blue-crowns': 'Dark Blue Crown Polo',
  'blue-3-4-pants': 'Blue 3/4 Pants',
  'athletic-shorts-red': 'Red Athletic Shorts',
  'athletic-shorts-blue': 'Blue Athletic Shorts',
  'athletic-shorts-black': 'Black Athletic Shorts',
  'athletic-shorts-green': 'Green Athletic Shorts',
  'athletic-shorts-yellow': 'Yellow Athletic Shorts',
  'overalls-blue-teddy': 'Blue Teddy Overalls',
  'overalls-girls-black': 'Black Girls Overalls',
  'blue-check-shirt': 'Blue Check Shirt',
  'orange-check-shirt': 'Orange Check Shirt',
  'red-check-shirt': 'Red Check Shirt',
  'overshirt-blue-plaid': 'Blue Plaid Overshirt',
  'overshirt-orange-plaid': 'Orange Plaid Overshirt',
  'overshirt-red-plaid': 'Red Plaid Overshirt',
  'black-white-hoodie': 'Black & White Hoodie',
  'black-white-button-up': 'Black & White Button-Up',
  'brown-blue-button-up': 'Brown & Blue Button-Up',
  'pink-plaid-button-up': 'Pink Plaid Button-Up',
  'blue-plaid-button-up': 'Blue Plaid Button-Up',
  'premium-blue-denim': 'Premium Blue Denim Shoes',
  'premium-blue-space-print': 'Premium Blue Space Print Shoes',
  'premium-green-garden-print': 'Premium Green Garden Print Shoes',
  'blue-flower': 'Blue Flower Shoes',
  'white-flower': 'White Flower Shoes',
  'black-loafers': 'Black Loafers',
  'black-loafers-2': 'Black Loafers 2',
  'brown-loafers': 'Brown Loafers',
  'black-slip-ons': 'Black Slip-Ons',
  'brown-slip-ons': 'Brown Slip-Ons',
  'crochet-pink-flowers': 'Pink Flower Crochet Shoes',
  'crochet-white-flowers': 'White Flower Crochet Shoes',
  'crochet-yellow-flowers': 'Yellow Flower Crochet Shoes',
  'shiny-black-bows': 'Shiny Black Bow Shoes',
  'shiny-pink-bows': 'Shiny Pink Bow Shoes',
  'shiny-red-bows': 'Shiny Red Bow Shoes',
  'shiny-white-bows': 'Shiny White Bow Shoes',
  'lace-white-bows': 'White Lace Bow Shoes',
  'lace-black-bows': 'Black Lace Bow Shoes',
  'lace-red-bows': 'Red Lace Bow Shoes',
  'lace-pink-bows': 'Pink Lace Bow Shoes',
  'square-thick-black-xl': 'Square Thick Black XL',
  'square-thick-white-xl': 'Square Thick White XL',
  'square-thick-red-xl': 'Square Thick Red XL',
  'new-square-thick-bling-xl': 'NEW! Square Thick Bling',
  'square-thin-black-xl': 'Square Thin Black XL',
  'round-thick-black-xl': 'Round Thick Black XL',
  'round-thick-white-xl': 'Round Thick White XL',
  'round-thick-clear-pink-xl': 'Round Thick Clear Pink XL',
  'round-thick-clear-blue-xl': 'Round Thick Clear Blue XL',
  'round-thick-clear-green-xl': 'Round Thick Clear Green XL',
  'hexagonal-thick-black-xl': 'Hexagonal Thick Black XL',
  'hexagonal-thick-white-xl': 'Hexagonal Thick White XL',
  'square-thin-white-2': 'Square Thin White 2',
};

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
  { id: 'round-30-dome-plain', label: 'Plain', group: 'round', shape: 'round', sizeMm: 30, style: 'dome', finish: 'plain', riveArtboardRef: 'Puppet/Eyes/Round/30mm/Dome/Plain' },
  { id: 'round-45-dome-plain', label: 'Plain', group: 'round', shape: 'round', sizeMm: 45, style: 'dome', finish: 'plain', riveArtboardRef: 'Puppet/Eyes/Round/45mm/Dome/Plain' },
  { id: 'round-45-flat-plain', label: 'Plain', group: 'round', shape: 'round', sizeMm: 45, style: 'flat', finish: 'plain', riveArtboardRef: 'Puppet/Eyes/Round/45mm/Flat/Plain' },
  { id: 'round-45-flat-blue-eyelids', label: 'Blue Eyelids', group: 'round', shape: 'round', sizeMm: 45, style: 'flat', finish: 'blue-eyelids', riveArtboardRef: 'Puppet/Eyes/Round/45mm/Flat/BlueEyelids' },
  { id: 'round-45-flat-green-eyelids', label: 'Green Eyelids', group: 'round', shape: 'round', sizeMm: 45, style: 'flat', finish: 'green-eyelids', riveArtboardRef: 'Puppet/Eyes/Round/45mm/Flat/GreenEyelids' },
  { id: 'round-45-flat-orange-lashes', label: 'Orange + Lashes', group: 'round', shape: 'round', sizeMm: 45, style: 'flat', finish: 'orange-lashes', riveArtboardRef: 'Puppet/Eyes/Round/45mm/Flat/OrangeLashes' },
  { id: 'round-45-flat-pink-lashes', label: 'Pink + Lashes', group: 'round', shape: 'round', sizeMm: 45, style: 'flat', finish: 'pink-lashes', riveArtboardRef: 'Puppet/Eyes/Round/45mm/Flat/PinkLashes' },
  { id: 'oval-65x40-flat-plain', label: 'Plain', group: 'oval', shape: 'oval', widthMm: 65, heightMm: 40, style: 'flat', finish: 'plain', riveArtboardRef: 'Puppet/Eyes/Oval/65x40mm/Flat/Plain' },
  { id: 'oval-65x40-flat-yellow-eyelids', label: 'Yellow Eyelids', group: 'oval', shape: 'oval', widthMm: 65, heightMm: 40, style: 'flat', finish: 'yellow-eyelids', riveArtboardRef: 'Puppet/Eyes/Oval/65x40mm/Flat/YellowEyelids' },
  { id: 'oval-65x40-flat-red-eyelids', label: 'Red Eyelids', group: 'oval', shape: 'oval', widthMm: 65, heightMm: 40, style: 'flat', finish: 'red-eyelids', riveArtboardRef: 'Puppet/Eyes/Oval/65x40mm/Flat/RedEyelids' },
  { id: 'oval-65x40-flat-blue-lashes', label: 'Blue + Lashes', group: 'oval', shape: 'oval', widthMm: 65, heightMm: 40, style: 'flat', finish: 'blue-lashes', riveArtboardRef: 'Puppet/Eyes/Oval/65x40mm/Flat/BlueLashes' },
  { id: 'oval-65x40-flat-pink-lashes', label: 'Pink + Lashes', group: 'oval', shape: 'oval', widthMm: 65, heightMm: 40, style: 'flat', finish: 'pink-lashes', riveArtboardRef: 'Puppet/Eyes/Oval/65x40mm/Flat/PinkLashes' },
  { id: 'beady-small-black', label: 'Small Beady', group: 'beady', shape: 'beady', size: 'small', style: 'beady', finish: 'black', riveArtboardRef: 'Puppet/Eyes/Beady/SmallBlack' },
  { id: 'beady-big-black', label: 'Big Beady', group: 'beady', shape: 'beady', size: 'big', style: 'beady', finish: 'black', riveArtboardRef: 'Puppet/Eyes/Beady/BigBlack' },
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
  ...['round-thin-black','round-thin-red','retro-black','retro-red','square-thin-black','square-thin-white','square-thin-tortoiseshell','square-thin-white-2'].map(id => ({ id, group: 'classic' })),
  ...['square-thick-black-xl','square-thick-white-xl','square-thick-red-xl','new-square-thick-bling-xl','square-thin-black-xl','round-thick-black-xl','round-thick-white-xl','round-thick-clear-pink-xl','round-thick-clear-blue-xl','round-thick-clear-green-xl','hexagonal-thick-black-xl','hexagonal-thick-white-xl'].map(id => ({ id, group: 'xl' })),
  ...['buggy-yellow','buggy-purple','buggy-red','buggy-green','buggy-black'].map(id => ({ id, group: 'buggy' })),
].map(o => ({
  id: o.id, label: labelOverrides[o.id] ?? titleCase(o.id.replace(/-xl$/, '')), category: 'glasses', group: o.group,
  price: 14.95, riveArtboardRef: 'Puppet/Glasses', colourBindable: false,
  vectorAssetPath: `rive/glasses/${o.id}.svg`,
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
  id: o.id, label: labelOverrides[o.id] ?? titleCase(o.id), category: 'outfit', group: o.group,
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
  id: o.id, label: labelOverrides[o.id] ?? titleCase(o.id), category: 'shoes',
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
