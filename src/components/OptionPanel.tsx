import { useEffect, useMemo, useState } from 'react';
import { optionColour } from '../data/catalog';
import type { AssetOption, Category } from '../types';
import { UiArtButton, UiArtImage } from './UiArtButton';

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

function OptionCard({ option, selected, onSelect }: { option: AssetOption; selected: boolean; onSelect: () => void }) {
  const isBodyColour = option.category === 'body';
  const swatchStyle = isBodyColour ? ({ '--swatch-colour': optionColour(option) } as React.CSSProperties) : undefined;

  return (
    <button className={`option-card ${selected ? 'is-selected' : ''}`} onClick={onSelect} aria-pressed={selected}>
      {isBodyColour && <span className="option-card__swatch" style={swatchStyle} aria-hidden="true" />}
      <span className="option-card__label">{option.label}</span>
      {option.group && <span className="option-card__meta">{title(option.group)}</span>}
      {Boolean(option.price) && <span className="option-card__price">+${option.price!.toFixed(2)}</span>}
      {selected && <span className="option-card__check" aria-hidden="true">✓</span>}
    </button>
  );
}

function NoThanksCard({ selected, onSelect }: { selected: boolean; onSelect: () => void }) {
  return (
    <button className={`option-card option-card--none ${selected ? 'is-selected' : ''}`} onClick={onSelect} aria-pressed={selected} aria-label="Skip this step">
      <UiArtImage asset="skipThisStep" label="Skip this step" size="wide" className="skip-card-art" />
      {selected && <span className="option-card__check" aria-hidden="true">✓</span>}
    </button>
  );
}

function representativeOption(options: AssetOption[], shape: string) {
  return options.find((option) => option.shape === shape) ?? options[0];
}

function WizardProgress({ labels, active }: { labels: string[]; active: number }) {
  return (
    <ol className="wizard-progress" aria-label="Choice progress">
      {labels.map((label, index) => (
        <li key={label} className={index === active ? 'is-active' : index < active ? 'is-complete' : ''} aria-current={index === active ? 'step' : undefined}>
          <span>{index < active ? '✓' : index + 1}</span>{label}
        </li>
      ))}
    </ol>
  );
}

function EyeWizard({ options, selected, touched = false, onSelect, onBack }: Props) {
  const initialShape = selected?.shape ?? representativeOption(options, 'round')?.shape ?? 'round';
  const [stage, setStage] = useState<'shape' | 'size' | 'style' | 'finish'>('shape');
  const [eyeShape, setEyeShape] = useState(initialShape);
  const [eyeSize, setEyeSize] = useState(selected ? eyeSizeKey(selected) : eyeSizeKey(representativeOption(options, initialShape)));
  const [eyeStyle, setEyeStyle] = useState(selected?.style ?? representativeOption(options, initialShape)?.style ?? '');

  useEffect(() => {
    const shape = selected?.shape ?? representativeOption(options, 'round')?.shape ?? 'round';
    const next = selected ?? representativeOption(options, shape);
    setStage('shape');
    setEyeShape(shape);
    setEyeSize(next ? eyeSizeKey(next) : '');
    setEyeStyle(next?.style ?? '');
  }, [options]);

  const eyeShapes = useMemo(() => [...new Set(options.map((option) => option.shape).filter(Boolean))] as string[], [options]);
  const eyeSizes = useMemo(() => [...new Set(options.filter((option) => option.shape === eyeShape).map(eyeSizeKey).filter(Boolean))], [options, eyeShape]);
  const eyeStyles = useMemo(() => [...new Set(options.filter((option) => option.shape === eyeShape && eyeSizeKey(option) === eyeSize).map((option) => option.style).filter(Boolean))] as string[], [options, eyeShape, eyeSize]);
  const finishOptions = useMemo(() => options.filter((option) => option.shape === eyeShape && (eyeShape === 'beady' || (eyeSizeKey(option) === eyeSize && option.style === eyeStyle))), [options, eyeShape, eyeSize, eyeStyle]);

  const chooseShape = (shape: string) => {
    const next = representativeOption(options, shape);
    setEyeShape(shape);
    setEyeSize(next ? eyeSizeKey(next) : '');
    setEyeStyle(next?.style ?? '');
    if (shape === 'beady' && next) {
      onSelect(next);
      setStage('finish');
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
    const next = options.find((option) => option.shape === eyeShape && eyeSizeKey(option) === eyeSize && option.style === style);
    setEyeStyle(style);
    if (next) onSelect(next);
    setStage('finish');
  };

  const chooseNoThanks = () => {
    onSelect(null);
    setStage('finish');
  };

  const goBack = () => {
    if (stage === 'shape') return onBack?.();
    if (stage === 'finish') return setStage(selected === null || eyeShape === 'beady' ? 'shape' : 'style');
    if (stage === 'style') return setStage('size');
    setStage('shape');
  };

  return (
    <section className="option-panel eye-wizard" aria-label="Eye choices">
      <WizardProgress labels={['Shape', 'Size', 'Style', 'Finish']} active={stage === 'shape' ? 0 : stage === 'size' ? 1 : stage === 'style' ? 2 : 3} />
      {stage === 'shape' && (
        <>
          <div className="eye-wizard__stage"><span className="filter-label">Eye shape</span></div>
          <div className="option-grid option-grid--eyes">
            <NoThanksCard selected={touched && selected === null} onSelect={chooseNoThanks} />
            {eyeShapes.map((shape) => {
              const option = representativeOption(options, shape);
              return <OptionCard key={shape} option={{ ...option, label: title(shape) }} selected={eyeShape === shape && selected !== null} onSelect={() => chooseShape(shape)} />;
            })}
          </div>
        </>
      )}
      {stage === 'size' && (
        <>
          <div className="eye-wizard__stage"><span className="filter-label">Size</span></div>
          <div className="option-grid option-grid--eyes">
            {eyeSizes.map((size) => {
              const option = options.find((item) => item.shape === eyeShape && eyeSizeKey(item) === size) ?? options[0];
              return <OptionCard key={size} option={{ ...option, label: eyeSizeLabel(size) }} selected={eyeSize === size} onSelect={() => chooseSize(size)} />;
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
              return <OptionCard key={style} option={{ ...option, label: title(style) }} selected={eyeStyle === style} onSelect={() => chooseStyle(style)} />;
            })}
          </div>
        </>
      )}
      {stage === 'finish' && (
        <>
          <div className="eye-wizard__stage"><span className="filter-label">Confirm</span></div>
          <div className="option-grid option-grid--eyes">
            {touched && selected === null ? <NoThanksCard selected onSelect={chooseNoThanks} /> : finishOptions.map((option) => <OptionCard key={option.id} option={option} selected={selected?.id === option.id} onSelect={() => onSelect(option)} />)}
          </div>
        </>
      )}
      <p className="catalog-note">{touched && selected === null ? 'Eye step skipped' : stage === 'shape' ? 'Choose the eye family first' : `Choosing ${title(eyeShape)} eyes`}</p>
      {stage !== 'shape' && <div className="eye-wizard__nav">
        <UiArtButton asset="back" label="Previous eye choice" size="wide" onClick={goBack} />
      </div>}
    </section>
  );
}

function NoseWizard({ options, selected, touched = false, onSelect, onBack }: Props) {
  const initialShape = selected?.shape ?? representativeOption(options, 'round')?.shape ?? 'round';
  const initialOption = selected ?? representativeOption(options, initialShape);
  const [stage, setStage] = useState<'shape' | 'size' | 'colour' | 'finish'>('shape');
  const [noseShape, setNoseShape] = useState(initialShape);
  const [noseSize, setNoseSize] = useState(initialOption?.size ?? '');

  useEffect(() => {
    const shape = selected?.shape ?? representativeOption(options, 'round')?.shape ?? 'round';
    const next = selected ?? representativeOption(options, shape);
    setStage('shape');
    setNoseShape(shape);
    setNoseSize(next?.size ?? '');
  }, [options]);

  const shapes = useMemo(() => [...new Set(options.map((option) => option.shape).filter(Boolean))] as string[], [options]);
  const sizes = useMemo(() => [...new Set(options.filter((option) => option.shape === noseShape).map((option) => option.size).filter(Boolean))] as string[], [options, noseShape]);
  const colourOptions = useMemo(() => options.filter((option) => option.shape === noseShape && option.size === noseSize), [options, noseShape, noseSize]);

  const chooseShape = (shape: string) => {
    const next = representativeOption(options, shape);
    setNoseShape(shape);
    setNoseSize(next?.size ?? '');
    setStage('size');
  };

  const chooseNoThanks = () => {
    onSelect(null);
    setStage('finish');
  };

  const goBack = () => {
    if (stage === 'shape') return onBack?.();
    if (stage === 'finish') return setStage(selected === null ? 'shape' : 'colour');
    if (stage === 'colour') return setStage('size');
    setStage('shape');
  };

  return (
    <section className="option-panel eye-wizard" aria-label="Nose choices">
      <WizardProgress labels={['Shape', 'Size', 'Colour', 'Finish']} active={stage === 'shape' ? 0 : stage === 'size' ? 1 : stage === 'colour' ? 2 : 3} />
      {stage === 'shape' && (
        <>
          <div className="eye-wizard__stage"><span className="filter-label">Nose shape</span></div>
          <div className="option-grid option-grid--nose">
            <NoThanksCard selected={touched && selected === null} onSelect={chooseNoThanks} />
            {shapes.map((shape) => {
              const option = representativeOption(options, shape);
              return <OptionCard key={shape} option={{ ...option, label: title(shape) }} selected={noseShape === shape && selected !== null} onSelect={() => chooseShape(shape)} />;
            })}
          </div>
        </>
      )}
      {stage === 'size' && (
        <>
          <div className="eye-wizard__stage"><span className="filter-label">Size</span></div>
          <div className="option-grid option-grid--nose">
            {sizes.map((size) => {
              const option = options.find((item) => item.shape === noseShape && item.size === size) ?? options[0];
              return <OptionCard key={size} option={{ ...option, label: title(size) }} selected={noseSize === size} onSelect={() => { setNoseSize(size); setStage('colour'); }} />;
            })}
          </div>
        </>
      )}
      {stage === 'colour' && (
        <>
          <div className="eye-wizard__stage"><span className="filter-label">Colour</span></div>
          <div className="option-grid option-grid--nose">
            {colourOptions.map((option) => <OptionCard key={option.id} option={{ ...option, label: title(option.colour ?? option.label) }} selected={selected?.id === option.id} onSelect={() => { onSelect(option); setStage('finish'); }} />)}
          </div>
        </>
      )}
      {stage === 'finish' && (
        <>
          <div className="eye-wizard__stage"><span className="filter-label">Confirm</span></div>
          <div className="option-grid option-grid--nose">
            {touched && selected === null ? <NoThanksCard selected onSelect={chooseNoThanks} /> : selected && <OptionCard option={selected} selected onSelect={() => setStage('colour')} />}
          </div>
        </>
      )}
      <p className="catalog-note">{touched && selected === null ? 'Nose step skipped' : stage === 'shape' ? 'Choose the nose shape first' : `Choosing ${title(noseShape)} nose`}</p>
      {stage !== 'shape' && <div className="eye-wizard__nav">
        <UiArtButton asset="back" label="Previous nose choice" size="wide" onClick={goBack} />
      </div>}
    </section>
  );
}

function HairWizard({ options, selected, touched = false, onSelect, onBack }: Props) {
  const firstGroup = selected?.group ?? options[0]?.group ?? '';
  const [stage, setStage] = useState<'style' | 'colour' | 'finish'>('style');
  const [hairGroup, setHairGroup] = useState(firstGroup);
  const styles = useMemo(() => [...new Set(options.map((option) => option.group).filter(Boolean))] as string[], [options]);
  const colours = useMemo(() => options.filter((option) => option.group === hairGroup), [options, hairGroup]);

  const chooseStyle = (nextGroup: string) => {
    setHairGroup(nextGroup);
    setStage('colour');
  };
  const skip = () => { onSelect(null); setStage('finish'); };
  const back = () => {
    if (stage === 'style') return onBack?.();
    if (stage === 'finish' && selected === null) return setStage('style');
    setStage(stage === 'finish' ? 'colour' : 'style');
  };

  return (
    <section className="option-panel choice-wizard" aria-label="Hair choices">
      <WizardProgress labels={['Style', 'Colour', 'Finish']} active={stage === 'style' ? 0 : stage === 'colour' ? 1 : 2} />
      {stage === 'style' && <><div className="eye-wizard__stage"><span className="filter-label">Hair style</span></div><div className="option-grid option-grid--hair"><NoThanksCard selected={touched && selected === null} onSelect={skip} />{styles.map((style) => { const option = options.find((item) => item.group === style) ?? options[0]; return <OptionCard key={style} option={{ ...option, label: title(style) }} selected={selected !== null && hairGroup === style} onSelect={() => chooseStyle(style)} />; })}</div></>}
      {stage === 'colour' && <><div className="eye-wizard__stage"><span className="filter-label">Hair colour</span></div><div className="option-grid option-grid--hair">{colours.map((option) => <OptionCard key={option.id} option={option} selected={selected?.id === option.id} onSelect={() => { onSelect(option); setStage('finish'); }} />)}</div></>}
      {stage === 'finish' && <><div className="eye-wizard__stage"><span className="filter-label">Selection ready</span></div><div className="option-grid option-grid--hair">{selected ? <OptionCard option={selected} selected onSelect={() => setStage('colour')} /> : <NoThanksCard selected onSelect={skip} />}</div></>}
      <p className="catalog-note">{selected ? `${title(selected.group ?? '')} • ${selected.label}` : 'Hair is optional'}</p>
      {stage !== 'style' && <div className="eye-wizard__nav"><UiArtButton asset="back" label="Previous hair choice" size="wide" onClick={back} /></div>}
    </section>
  );
}

function OutfitWizard({ options, selected, touched = false, onSelect, onBack }: Props) {
  const firstGroup = selected?.group ?? options[0]?.group ?? '';
  const [stage, setStage] = useState<'type' | 'item' | 'finish'>('type');
  const [outfitGroup, setOutfitGroup] = useState(firstGroup);
  const groups = useMemo(() => [...new Set(options.map((option) => option.group).filter(Boolean))] as string[], [options]);
  const items = useMemo(() => options.filter((option) => option.group === outfitGroup), [options, outfitGroup]);
  const skip = () => { onSelect(null); setStage('finish'); };
  const back = () => {
    if (stage === 'type') return onBack?.();
    if (stage === 'finish' && selected === null) return setStage('type');
    setStage(stage === 'finish' ? 'item' : 'type');
  };

  return (
    <section className="option-panel choice-wizard" aria-label="Outfit choices">
      <WizardProgress labels={['Type', 'Outfit', 'Finish']} active={stage === 'type' ? 0 : stage === 'item' ? 1 : 2} />
      {stage === 'type' && <><div className="eye-wizard__stage"><span className="filter-label">What are you looking for?</span></div><div className="option-grid option-grid--outfit"><NoThanksCard selected={touched && selected === null} onSelect={skip} />{groups.map((group) => { const option = options.find((item) => item.group === group) ?? options[0]; const count = options.filter((item) => item.group === group).length; return <OptionCard key={group} option={{ ...option, label: title(group), group: `${count} choices` }} selected={selected !== null && outfitGroup === group} onSelect={() => { setOutfitGroup(group); setStage('item'); }} />; })}</div></>}
      {stage === 'item' && <><div className="eye-wizard__stage"><span className="filter-label">{title(outfitGroup)}</span></div><div className="option-grid option-grid--outfit">{items.map((option) => <OptionCard key={option.id} option={option} selected={selected?.id === option.id} onSelect={() => { onSelect(option); setStage('finish'); }} />)}</div></>}
      {stage === 'finish' && <><div className="eye-wizard__stage"><span className="filter-label">Selection ready</span></div><div className="option-grid option-grid--outfit">{selected ? <OptionCard option={selected} selected onSelect={() => setStage('item')} /> : <NoThanksCard selected onSelect={skip} />}</div></>}
      <p className="catalog-note">{selected ? selected.label : 'Outfit is optional'}</p>
      {stage !== 'type' && <div className="eye-wizard__nav"><UiArtButton asset="back" label="Previous outfit choice" size="wide" onClick={back} /></div>}
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
  if (category === 'hair') return <HairWizard category={category} options={options} selected={selected} touched={touched} onSelect={onSelect} onBack={onBack} />;
  if (category === 'outfit') return <OutfitWizard category={category} options={options} selected={selected} touched={touched} onSelect={onSelect} onBack={onBack} />;

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
        {optionalCategories.has(category) && <NoThanksCard selected={touched && selected === null} onSelect={() => onSelect(null)} />}
        {visible.map((option) => <OptionCard key={option.id} option={option} selected={selected?.id === option.id} onSelect={() => onSelect(option)} />)}
      </div>
      <p className="catalog-note">Showing {visible.length} of {options.length} {category} choices</p>
    </section>
  );
}
