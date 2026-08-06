import { useEffect, useMemo, useState } from 'react';
import { colourHex, optionColour, resolveThumbnail } from '../data/catalog';
import type { AssetOption, Category } from '../types';

type Props = {
  category: Category;
  options: AssetOption[];
  selected: AssetOption | null;
  onSelect: (option: AssetOption | null) => void;
};

const optionalCategories = new Set<Category>(['glasses', 'outfit', 'shoes', 'accessory']);

const labels: Record<string, string> = {
  'round-flat': 'Round',
  'round-half-dome': 'Dome',
  oval: 'Oval',
  beady: 'Beady',
  classic: 'Classic',
  xl: 'Extra large',
  buggy: 'Buggy',
  'round-base': 'Round base',
  'v-hairline': 'V hairline',
  'side-part': 'Side part',
  'dreadlocks-short': 'Short locks',
  'dreadlocks-medium': 'Medium locks',
  looks: 'Complete looks',
  premium: 'Premium looks',
  top: 'Tops',
  bottom: 'Bottoms',
  over: 'Layers'
};

const title = (value: string) => labels[value] ?? value.split('-').map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' ');

function optionEmoji(option: AssetOption) {
  if (option.category === 'eyes') return option.group === 'beady' ? '••' : option.group === 'oval' ? '◉ ◉' : '● ●';
  if (option.category === 'nose') return option.shape === 'triangle' ? '▲' : option.shape === 'oblong' ? '⬭' : '●';
  if (option.category === 'glasses') return '👓';
  if (option.category === 'hair') return '〰';
  if (option.category === 'outfit') return '👕';
  if (option.category === 'shoes') return '👟';
  if (option.category === 'accessory') return '⭐';
  return '●';
}

function OptionCard({ option, selected, onSelect }: { option: AssetOption; selected: boolean; onSelect: () => void }) {
  const thumbnail = resolveThumbnail(option);
  const artColour = optionColour(option, colourHex[option.id] ?? '#d59b56');
  return (
    <button className={`option-card ${selected ? 'is-selected' : ''}`} onClick={onSelect} aria-pressed={selected}>
      <span className="option-card__art" style={{ '--option-colour': artColour } as React.CSSProperties}>
        <span className="option-card__fallback">{optionEmoji(option)}</span>
        {thumbnail && <img src={thumbnail} alt="" onError={(event) => { event.currentTarget.style.display = 'none'; }} />}
      </span>
      <span className="option-card__label">{option.label}</span>
      {Boolean(option.price) && <span className="option-card__price">+${option.price!.toFixed(2)}</span>}
      {selected && <span className="option-card__check" aria-hidden="true">✓</span>}
    </button>
  );
}

export function OptionPanel({ category, options, selected, onSelect }: Props) {
  const initialGroup = selected?.group ?? options.find((option) => option.group)?.group ?? '';
  const [group, setGroup] = useState(initialGroup);
  const [noseShape, setNoseShape] = useState(selected?.shape ?? 'round');
  const [noseSize, setNoseSize] = useState(selected?.size ?? 'medium');

  useEffect(() => {
    setGroup(selected?.group ?? options.find((option) => option.group)?.group ?? '');
    setNoseShape(selected?.shape ?? 'round');
    setNoseSize(selected?.size ?? 'medium');
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  const groups = useMemo(() => [...new Set(options.map((option) => option.group).filter(Boolean))] as string[], [options]);
  const shapes = useMemo(() => [...new Set(options.map((option) => option.shape).filter(Boolean))] as string[], [options]);
  const sizes = useMemo(() => [...new Set(options.filter((option) => option.shape === noseShape).map((option) => option.size).filter(Boolean))] as string[], [options, noseShape]);

  let visible = options;
  if (category === 'nose') visible = options.filter((option) => option.shape === noseShape && option.size === noseSize);
  else if (group && groups.length > 1) visible = options.filter((option) => option.group === group);

  return (
    <section className="option-panel" aria-label={`${category} choices`}>
      {category === 'nose' && (
        <div className="choice-filters">
          <div><span className="filter-label">Shape</span><div className="filter-row">{shapes.map((shape) => <button className={noseShape === shape ? 'is-active' : ''} onClick={() => { setNoseShape(shape); const nextSize = options.find((item) => item.shape === shape)?.size; if (nextSize) setNoseSize(nextSize); }} key={shape}>{title(shape)}</button>)}</div></div>
          <div><span className="filter-label">Size</span><div className="filter-row">{sizes.map((size) => <button className={noseSize === size ? 'is-active' : ''} onClick={() => setNoseSize(size)} key={size}>{title(size)}</button>)}</div></div>
          <span className="filter-label">Colour</span>
        </div>
      )}
      {category !== 'nose' && groups.length > 1 && (
        <div className="filter-row group-filter" aria-label={`${category} groups`}>
          {groups.map((item) => <button className={group === item ? 'is-active' : ''} onClick={() => setGroup(item)} key={item}>{title(item)}</button>)}
        </div>
      )}
      <div className={`option-grid option-grid--${category}`}>
        {optionalCategories.has(category) && (
          <button className={`option-card option-card--none ${selected === null ? 'is-selected' : ''}`} onClick={() => onSelect(null)} aria-pressed={selected === null}>
            <span className="option-card__art"><span className="option-card__fallback">—</span></span>
            <span className="option-card__label">None</span>
            {selected === null && <span className="option-card__check" aria-hidden="true">✓</span>}
          </button>
        )}
        {visible.map((option) => <OptionCard key={option.id} option={option} selected={selected?.id === option.id} onSelect={() => onSelect(option)} />)}
      </div>
      <p className="catalog-note">Showing {visible.length} of {options.length} {category} choices</p>
    </section>
  );
}
