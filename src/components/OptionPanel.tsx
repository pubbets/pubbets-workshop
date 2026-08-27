import { useEffect, useMemo, useState } from 'react';
import { optionColour, resolveThumbnail } from '../data/catalog';
import type { AssetOption, Category } from '../types';
import { UiArtButton } from './UiArtButton';

type Props = {
  category: Category;
  options: AssetOption[];
  selected: AssetOption | null;
  touched?: boolean;
  onSelect: (option: AssetOption | null) => void;
  onBack?: () => void;
};

const optionalCategories = new Set<Category>(['glasses', 'hair', 'outfit', 'shoes', 'accessory']);

const labels: Record<string, string> = {
  round: 'Round',
  oval: 'Oval',
  beady: 'Black beady',
  dome: 'Dome',
  flat: 'Flat',
  plain: 'Plain',
  oblong: 'Oblong',
  'tear-drop': 'Tear drop',
  human: 'Human',
  triangle: 'Triangle',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
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
  over: 'Layers',
  base: 'Plain colours',
  patterned: 'Patterned',
  loafers: 'Loafers',
  'slip-ons': 'Slip-ons',
  crochet: 'Crochet',
  bows: 'Bows',
  wavy: 'Wavy',
  straight: 'Straight',
  afro: 'Afro'
};

const title = (value: string) =>
  labels[value] ?? value.split('-').map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' ');

const eyeSizeKey = (option: AssetOption) => {
  if (option.sizeMm) return `${option.sizeMm}mm`;
  if (option.widthMm && option.heightMm) return `${option.widthMm}x${option.heightMm}mm`;
  return option.size ?? '';
};

const eyeSizeLabel = (value: string) => value.replace('x', ' x ');

const plainShoeColours = new Set(['black', 'green', 'light-blue', 'red', 'yellow', 'pink', 'beige', 'white', 'brown']);

function optionGroup(option: AssetOption) {
  if (option.group) return option.group;
  if (option.category !== 'shoes') return '';
  if (plainShoeColours.has(option.id)) return 'base';
  if (option.id.startsWith('premium-')) return 'premium';
  if (option.id.includes('loafers')) return 'loafers';
  if (option.id.includes('slip-ons')) return 'slip-ons';
  if (option.id.includes('crochet')) return 'crochet';
  if (option.id.includes('bows')) return 'bows';
  if (option.id.includes('flower')) return 'patterned';
  return 'base';
}

function EyeShapePreview({ shape }: { shape: string }) {
  return (
    <span className={`eye-shape-preview is-${shape}`} aria-hidden="true">
      <i /><i />
    </span>
  );
}

function OptionCard({ option, selected, onSelect, eyeShapePreview }: { option: AssetOption; selected: boolean; onSelect: () => void; eyeShapePreview?: string }) {
  const isBodyColour = option.category === 'body';
  const swatchStyle = isBodyColour ? ({ '--swatch-colour': optionColour(option) } as React.CSSProperties) : undefined;
  const thumbnail = eyeShapePreview ? null : resolveThumbnail(option);
  const hasVisual = Boolean(thumbnail || eyeShapePreview);

  return (
    <button className={`option-card${hasVisual ? ' has-image' : ''}${selected ? ' is-selected' : ''}`} onClick={onSelect} aria-pressed={selected}>
      {isBodyColour && <span className="option-card__swatch" style={swatchStyle} aria-hidden="true" />}
      {eyeShapePreview && <EyeShapePreview shape={eyeShapePreview} />}
      {thumbnail && <span className="option-card__image" aria-hidden="true"><img src={thumbnail} alt="" /></span>}
      <span className="option-card__label">{option.label}</span>
      {option.group && <span className="option-card__meta">{title(option.group)}</span>}
      {Boolean(option.price) && <span className="option-card__price">+${option.price!.toFixed(2)}</span>}
      {selected && <span className="option-card__check" aria-hidden="true">✓</span>}
    </button>
  );
}

function SkipStepButton({ selected, onSelect }: { selected: boolean; onSelect: () => void }) {
  return (
    <div className={`skip-step-row${selected ? ' is-selected' : ''}`}>
      <UiArtButton className="skip-step-button" asset="skipThisStep" label="Skip this step" size="wide" onClick={onSelect} aria-pressed={selected} />
    </div>
  );
}

function representativeOption(options: AssetOption[], shape: string) {
  return options.find((option) => option.shape === shape) ?? options[0];
}

function EyeWizard({ options, selected, touched = false, onSelect, onBack }: Props) {
  const [stage, setStage] = useState<'shape' | 'size' | 'style' | 'finish'>('shape');
  const [eyeShape, setEyeShape] = useState(selected?.shape ?? '');
  const [eyeSize, setEyeSize] = useState(selected ? eyeSizeKey(selected) : '');
  const [eyeStyle, setEyeStyle] = useState(selected?.style ?? '');

  useEffect(() => {
    setStage('shape');
    setEyeShape(selected?.shape ?? '');
    setEyeSize(selected ? eyeSizeKey(selected) : '');
    setEyeStyle(selected?.style ?? '');
  }, [options]);

  const eyeShapes = useMemo(() => [...new Set(options.map((option) => option.shape).filter(Boolean))] as string[], [options]);
  const eyeSizes = useMemo(() => [...new Set(options.filter((option) => option.shape === eyeShape).map(eyeSizeKey).filter(Boolean))], [options, eyeShape]);
  const eyeStyles = useMemo(() => [...new Set(options.filter((option) => option.shape === eyeShape && eyeSizeKey(option) === eyeSize).map((option) => option.style).filter(Boolean))] as string[], [options, eyeShape, eyeSize]);
  const finishOptions = useMemo(() => options.filter((option) => option.shape === eyeShape && (eyeShape === 'beady' || (eyeSizeKey(option) === eyeSize && option.style === eyeStyle))), [options, eyeShape, eyeSize, eyeStyle]);

  const chooseShape = (shape: string) => {
    const availableSizes = [...new Set(options.filter((option) => option.shape === shape).map(eyeSizeKey).filter(Boolean))];
    setEyeShape(shape);
    setEyeSize('');
    setEyeStyle('');
    if (shape === 'beady') {
      setStage('finish');
      return;
    }
    if (availableSizes.length === 1) {
      setEyeSize(availableSizes[0]);
      setStage('style');
      return;
    }
    setStage('size');
  };

  const chooseSize = (size: string) => {
    const next = options.find((option) => option.shape === eyeShape && eyeSizeKey(option) === size);
    setEyeSize(size);
    setEyeStyle(next?.style ?? '');
    setStage('style');
  };

  const chooseStyle = (style: string) => {
    setEyeStyle(style);
    setStage('finish');
  };

  const chooseNoThanks = () => {
    onSelect(null);
  };

  const goBack = () => {
    if (stage === 'shape') return onBack?.();
    if (stage === 'finish') return setStage(eyeShape === 'beady' ? 'shape' : 'style');
    if (stage === 'style') return setStage(eyeSizes.length > 1 ? 'size' : 'shape');
    setStage('shape');
  };

  return (
    <section className="option-panel eye-wizard" aria-label="Eye choices">
      {stage !== 'shape' && <button className="wizard-back-link" onClick={goBack}>← Previous eye choice</button>}
      {stage === 'shape' && (
        <>
          <div className="eye-wizard__stage"><span className="filter-label">Eye shape</span></div>
          <div className="option-grid option-grid--eyes">
            {eyeShapes.map((shape) => {
              const option = representativeOption(options, shape);
              return <OptionCard key={shape} option={{ ...option, label: title(shape) }} selected={eyeShape === shape} onSelect={() => chooseShape(shape)} eyeShapePreview={shape} />;
            })}
          </div>
          <SkipStepButton selected={touched && selected === null} onSelect={chooseNoThanks} />
        </>
      )}
      {stage === 'size' && (
        <>
          <div className="eye-wizard__stage"><span className="filter-label">Size</span></div>
          <div className="option-grid option-grid--eyes">
            {eyeSizes.map((size) => {
              const option = options.find((item) => item.shape === eyeShape && eyeSizeKey(item) === size) ?? options[0];
              return <OptionCard key={size} option={{ ...option, label: eyeSizeLabel(size) }} selected={eyeSize === size && Boolean(eyeSize)} onSelect={() => chooseSize(size)} />;
            })}
          </div>
        </>
      )}
      {stage === 'style' && (
        <>
          <div className="eye-wizard__stage"><span className="filter-label">Style</span></div>
          <div className="option-grid option-grid--eyes">
            {eyeStyles.map((style) => {
              const option = options.find((item) => item.shape === eyeShape && eyeSizeKey(item) === eyeSize && item.style === style) ?? options[0];
              return <OptionCard key={style} option={{ ...option, label: title(style) }} selected={eyeStyle === style && Boolean(eyeStyle)} onSelect={() => chooseStyle(style)} />;
            })}
          </div>
        </>
      )}
      {stage === 'finish' && (
        <>
          <div className="eye-wizard__stage"><span className="filter-label">Choose your eye look</span></div>
          <div className="option-grid option-grid--eyes">
            {finishOptions.map((option) => <OptionCard key={option.id} option={option} selected={selected?.id === option.id} onSelect={() => onSelect(option)} />)}
          </div>
        </>
      )}
      <p className="catalog-note">{touched && selected === null ? 'No eyes selected. You can continue or choose an option.' : stage === 'shape' ? 'Start with an eye shape' : [title(eyeShape), eyeSizeLabel(eyeSize), eyeStyle && title(eyeStyle)].filter(Boolean).join(' · ')}</p>
    </section>
  );
}

function NoseWizard({ options, selected, touched = false, onSelect, onBack }: Props) {
  const [stage, setStage] = useState<'shape' | 'size' | 'colour'>('shape');
  const [noseShape, setNoseShape] = useState(selected?.shape ?? '');
  const [noseSize, setNoseSize] = useState(selected?.size ?? '');

  useEffect(() => {
    setStage('shape');
    setNoseShape(selected?.shape ?? '');
    setNoseSize(selected?.size ?? '');
  }, [options]);

  const shapes = useMemo(() => [...new Set(options.map((option) => option.shape).filter(Boolean))] as string[], [options]);
  const sizes = useMemo(() => [...new Set(options.filter((option) => option.shape === noseShape).map((option) => option.size).filter(Boolean))] as string[], [options, noseShape]);
  const colourOptions = useMemo(() => options.filter((option) => option.shape === noseShape && option.size === noseSize), [options, noseShape, noseSize]);

  const chooseShape = (shape: string) => {
    setNoseShape(shape);
    setNoseSize('');
    setStage('size');
  };

  const chooseNoThanks = () => {
    onSelect(null);
  };

  const goBack = () => {
    if (stage === 'shape') return onBack?.();
    if (stage === 'colour') return setStage('size');
    setStage('shape');
  };

  return (
    <section className="option-panel eye-wizard" aria-label="Nose choices">
      {stage !== 'shape' && <button className="wizard-back-link" onClick={goBack}>← Previous nose choice</button>}
      {stage === 'shape' && (
        <>
          <div className="eye-wizard__stage"><span className="filter-label">Nose shape</span></div>
          <div className="option-grid option-grid--nose">
            {shapes.map((shape) => {
              const option = representativeOption(options, shape);
              return <OptionCard key={shape} option={{ ...option, label: title(shape) }} selected={noseShape === shape} onSelect={() => chooseShape(shape)} />;
            })}
          </div>
          <SkipStepButton selected={touched && selected === null} onSelect={chooseNoThanks} />
        </>
      )}
      {stage === 'size' && (
        <>
          <div className="eye-wizard__stage"><span className="filter-label">Size</span></div>
          <div className="option-grid option-grid--nose">
            {sizes.map((size) => {
              const option = options.find((item) => item.shape === noseShape && item.size === size) ?? options[0];
              return <OptionCard key={size} option={{ ...option, label: title(size) }} selected={noseSize === size && Boolean(noseSize)} onSelect={() => { setNoseSize(size); setStage('colour'); }} />;
            })}
          </div>
        </>
      )}
      {stage === 'colour' && (
        <>
          <div className="eye-wizard__stage"><span className="filter-label">Colour</span></div>
          <div className="option-grid option-grid--nose">
            {colourOptions.map((option) => <OptionCard key={option.id} option={{ ...option, label: title(option.colour ?? option.label) }} selected={selected?.id === option.id} onSelect={() => onSelect(option)} />)}
          </div>
        </>
      )}
      <p className="catalog-note">{touched && selected === null ? 'No nose selected. You can continue or choose an option.' : stage === 'shape' ? 'Start with a nose shape' : [title(noseShape), noseSize && title(noseSize)].filter(Boolean).join(' · ')}</p>
    </section>
  );
}

export function OptionPanel({ category, options, selected, touched = false, onSelect, onBack }: Props) {
  const firstGrouped = options.find((option) => optionGroup(option));
  const initialGroup = selected ? optionGroup(selected) : firstGrouped ? optionGroup(firstGrouped) : '';
  const [group, setGroup] = useState(initialGroup);

  useEffect(() => {
    const firstGrouped = options.find((option) => optionGroup(option));
    setGroup(selected ? optionGroup(selected) : firstGrouped ? optionGroup(firstGrouped) : '');
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  if (category === 'eyes') return <EyeWizard category={category} options={options} selected={selected} touched={touched} onSelect={onSelect} onBack={onBack} />;
  if (category === 'nose') return <NoseWizard category={category} options={options} selected={selected} touched={touched} onSelect={onSelect} onBack={onBack} />;

  const groups = [...new Set(options.map(optionGroup).filter(Boolean))] as string[];
  const visible = group && groups.length > 1 ? options.filter((option) => optionGroup(option) === group) : options;

  return (
    <section className="option-panel" aria-label={`${category} choices`}>
      {groups.length > 1 && (
        <div className="filter-row group-filter" aria-label={`${category} groups`}>
          {groups.map((item) => <button className={group === item ? 'is-active' : ''} onClick={() => setGroup(item)} key={item}>{title(item)}</button>)}
        </div>
      )}
      <div className={`option-grid option-grid--${category}`}>
        {visible.map((option) => <OptionCard key={option.id} option={option} selected={selected?.id === option.id} onSelect={() => onSelect(option)} />)}
      </div>
      <p className="catalog-note">Showing {visible.length} of {options.length} {category} choices</p>
      {optionalCategories.has(category) && <SkipStepButton selected={touched && selected === null} onSelect={() => onSelect(null)} />}
    </section>
  );
}
