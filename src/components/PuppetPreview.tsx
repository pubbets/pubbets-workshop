import type { SelectionState } from '../types';
import { optionColour } from '../data/catalog';

type Props = {
  selections: SelectionState;
  closeUp?: boolean;
  motionKey: number;
};

function Eyes({ selections }: Pick<Props, 'selections'>) {
  const eye = selections.eyes;
  if (!eye) return null;
  const shape = eye?.shape ?? 'round';
  const finish = eye?.finish ?? 'plain';
  const lidColour = finish.includes('blue') ? '#4fb6e7'
    : finish.includes('green') ? '#73a94b'
    : finish.includes('pink') ? '#eb6da5'
    : finish.includes('orange') ? '#ef8725'
    : finish.includes('yellow') ? '#f2c72f'
    : finish.includes('red') ? '#db3b32'
    : '#f9f4e7';

  if (shape === 'beady') {
    const radius = eye?.size === 'big' ? 18 : 12;
    return <g className="puppet-eyes"><circle cx="166" cy="194" r={radius} /><circle cx="234" cy="194" r={radius} /></g>;
  }

  const oval = shape === 'oval';
  const lashes = finish.includes('lashes');
  return (
    <g className="puppet-eyes" strokeLinecap="round">
      <ellipse cx="165" cy="194" rx={oval ? 31 : 26} ry={oval ? 17 : 30} fill={lidColour} />
      <ellipse cx="235" cy="194" rx={oval ? 31 : 26} ry={oval ? 17 : 30} fill={lidColour} />
      {lashes && <g stroke="#191512" strokeWidth="5" fill="none"><path d="M138 176 L128 166" /><path d="M262 176 L272 166" /></g>}
      <circle cx="171" cy="198" r="10" fill="#191512" />
      <circle cx="229" cy="198" r="10" fill="#191512" />
      <circle cx="175" cy="193" r="3" fill="#fff" />
      <circle cx="233" cy="193" r="3" fill="#fff" />
    </g>
  );
}

function Nose({ selections }: Pick<Props, 'selections'>) {
  const nose = selections.nose;
  if (!nose) return null;
  const size = nose?.size === 'small' ? 0.72 : nose?.size === 'large' ? 1.25 : 1;
  const fill = optionColour(nose, '#e7b37f');
  const transform = `translate(200 244) scale(${size})`;

  if (nose?.shape === 'triangle') {
    return <path className="puppet-nose" transform={transform} d="M 0 -22 L 25 20 L -25 20 Z" fill={fill} />;
  }
  if (nose?.shape === 'oblong') {
    return <ellipse className="puppet-nose" transform={transform} rx="19" ry="32" fill={fill} />;
  }
  if (nose?.shape === 'tear-drop') {
    return <path className="puppet-nose" transform={transform} d="M0-28 C25 0 25 27 0 28 C-25 27-25 0 0-28Z" fill={fill} />;
  }
  if (nose?.shape === 'human') {
    return <path className="puppet-nose" transform={transform} d="M-5-24 C-1-9-13 9-11 17 C-7 28 12 28 16 16 C18 8 8-8 5-24Z" fill={fill} />;
  }
  return <circle className="puppet-nose" transform={transform} r="24" fill={fill} />;
}

function Glasses({ selections }: Pick<Props, 'selections'>) {
  if (!selections.glasses) return null;
  const colour = optionColour(selections.glasses, selections.glasses.id.includes('white') ? '#f8f0de' : '#2b211b');
  const rounded = selections.glasses.id.includes('round') || selections.glasses.id.includes('buggy');
  return (
    <g className="puppet-glasses" fill="none" stroke={colour} strokeWidth="10">
      {rounded ? <><circle cx="163" cy="196" r="42" /><circle cx="237" cy="196" r="42" /></>
        : <><rect x="121" y="156" width="82" height="76" rx="12" /><rect x="197" y="156" width="82" height="76" rx="12" /></>}
      <path d="M200 190h0 M200 190 C190 181 210 181 200 190" />
      <path d="M119 183L91 174 M281 183L309 174" />
    </g>
  );
}

function Hair({ selections }: Pick<Props, 'selections'>) {
  const hair = selections.hair;
  if (!hair) return null;
  const fill = optionColour(hair);
  const group = hair.group ?? '';
  if (group.includes('dreadlocks')) {
    return (
      <g fill={fill} stroke="#3a2419" strokeWidth="4">
        <path d="M110 150 Q122 66 200 66 Q278 66 290 150 Q259 112 200 110 Q141 112 110 150Z" />
        {[122, 143, 164, 236, 257, 278].map((x) => <rect key={x} x={x} y="118" width="15" height="100" rx="8" />)}
      </g>
    );
  }
  if (group === 'afro') return <circle cx="200" cy="112" r="102" fill={fill} stroke="#3a2419" strokeWidth="5" />;
  if (group === 'messy') {
    return <path d="M104 155 L124 78 L150 98 L172 49 L201 91 L230 50 L249 98 L283 77 L294 157 Q238 111 104 155Z" fill={fill} stroke="#3a2419" strokeWidth="5" />;
  }
  return <path d="M103 157 Q109 62 200 57 Q291 62 297 157 Q256 112 200 111 Q144 112 103 157Z" fill={fill} stroke="#3a2419" strokeWidth="5" />;
}

function outfitFill(id = '') {
  if (id.includes('blue')) return '#197cb5';
  if (id.includes('pink')) return '#e76c9f';
  if (id.includes('red')) return '#c84737';
  if (id.includes('yellow')) return '#e1b62f';
  if (id.includes('green')) return '#628f3b';
  if (id.includes('black')) return '#27231f';
  if (id.includes('white')) return '#f2e7d2';
  if (id.includes('denim') || id.includes('jeans')) return '#356a94';
  return '#784a9e';
}

export function PuppetPreview({ selections, closeUp = false, motionKey }: Props) {
  const body = optionColour(selections.body, '#36a9e0');
  const outfit = selections.outfit;
  const shoes = selections.shoes;
  const hasRods = Boolean(selections.accessory?.id.includes('rod'));
  return (
    <div className={`puppet-stage ${closeUp ? 'is-close' : ''}`} data-preview-engine="svg-fallback">
      <div className="preview-note"><span className="status-dot" /> Live preview</div>
      <svg key={motionKey} className="puppet-svg" viewBox="0 0 400 610" role="img" aria-label="Your customized Pubbet preview">
        <ellipse cx="200" cy="570" rx="150" ry="30" fill="#8d572f" opacity=".32" />
        {hasRods && <g stroke="#5b4031" strokeWidth="8" strokeLinecap="round"><path d="M73 364L25 545" /><path d="M327 364L375 545" /></g>}
        <g className="puppet-body" fill={body} stroke="#3b261e" strokeWidth="5" strokeLinejoin="round">
          <path d="M133 344 Q94 350 74 410 L45 461 Q34 482 53 494 Q72 507 88 486 L117 448 L151 388Z" />
          <path d="M267 344 Q306 350 326 410 L355 461 Q366 482 347 494 Q328 507 312 486 L283 448 L249 388Z" />
          <path d="M144 470 L140 550 Q139 575 165 578 Q190 579 193 553 L197 474Z" />
          <path d="M256 470 L260 550 Q261 575 235 578 Q210 579 207 553 L203 474Z" />
          <ellipse cx="200" cy="397" rx="91" ry="116" />
          <circle cx="200" cy="202" r="123" />
          <circle cx="79" cy="205" r="30" />
          <circle cx="321" cy="205" r="30" />
        </g>
        {outfit && <path d="M128 345 Q200 317 272 345 L283 444 Q245 485 200 486 Q155 485 117 444Z" fill={outfitFill(outfit.id)} stroke="#3b261e" strokeWidth="5" />}
        {outfit?.id.includes('gingham') && <g opacity=".45" stroke="#fff" strokeWidth="8"><path d="M145 350V468 M180 336V482 M220 336V482 M255 350V468" /><path d="M123 380H277 M119 420H281 M125 458H275" /></g>}
        <Hair selections={selections} />
        <Eyes selections={selections} />
        <Nose selections={selections} />
        <Glasses selections={selections} />
        <path d="M147 282 Q200 331 253 282 Q245 347 200 350 Q155 347 147 282Z" fill="#b7192e" stroke="#3b261e" strokeWidth="5" />
        <path d="M181 321 Q200 300 219 321 Q216 342 200 345 Q184 342 181 321Z" fill="#f4859d" />
        {shoes && <g fill={outfitFill(shoes.id)} stroke="#3b261e" strokeWidth="5"><path d="M126 548 Q159 536 194 556 L192 585 Q152 602 112 581Z" /><path d="M274 548 Q241 536 206 556 L208 585 Q248 602 288 581Z" /></g>}
      </svg>
      <div className="wooden-plinth" aria-hidden="true" />
    </div>
  );
}
