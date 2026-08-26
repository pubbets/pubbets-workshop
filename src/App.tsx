import { useEffect, useMemo, useState } from 'react';
import { catalog, basePrice, defaultSelections, steps } from './data/catalog';
import { OptionPanel } from './components/OptionPanel';
import { PuppetPreview } from './components/PuppetPreview';
import { ReviewPanel } from './components/ReviewPanel';
import { StepRail } from './components/StepRail';
import { UiArtButton } from './components/UiArtButton';
import { WelcomeScreen } from './components/WelcomeScreen';
import { useWorkshopSound } from './hooks/useWorkshopSound';
import type { AssetOption, Category, SelectionState } from './types';
import { calculateTotal, formatMoney } from './utils/pricing';
import pubbetsWorkshopLogo from '../assets/ui/logo/pubbets-workshop-logo.png';

const storageKey = 'pubbets-workshop-v1.3-selection';
const optionalCategories = new Set<Category>(['eyes', 'nose', 'glasses', 'hair', 'outfit', 'shoes', 'accessory']);
const allCategories = Object.keys(catalog) as Category[];

type TouchedState = Record<Category, boolean>;
type UndoSnapshot = {
  selections: SelectionState;
  touched: TouchedState;
};

function blankTouched(): TouchedState {
  return {
    body: false,
    eyes: false,
    nose: false,
    glasses: false,
    hair: false,
    outfit: false,
    shoes: false,
    accessory: false
  };
}

function allTouched(): TouchedState {
  return Object.fromEntries(allCategories.map((category) => [category, true])) as TouchedState;
}

function touchedFromSelections(selections: SelectionState): TouchedState {
  return Object.fromEntries(
    allCategories.map((category) => [category, selections[category] !== null])
  ) as TouchedState;
}

function restoreSelections(): SelectionState {
  const defaults = defaultSelections();
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? '{}') as Partial<Record<Category, string | null>>;
    for (const category of allCategories) {
      if (!(category in saved)) continue;
      defaults[category] = saved[category] === null ? null : catalog[category].find((item) => item.id === saved[category]) ?? defaults[category];
    }
  } catch {
    localStorage.removeItem(storageKey);
  }
  return defaults;
}

export function App() {
  const [started, setStarted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completedThrough, setCompletedThrough] = useState(-1);
  const [selections, setSelections] = useState<SelectionState>(restoreSelections);
  const [undoSnapshot, setUndoSnapshot] = useState<UndoSnapshot | null>(null);
  const [touchedCategories, setTouchedCategories] = useState<TouchedState>(() => touchedFromSelections(restoreSelections()));
  const [motionKey, setMotionKey] = useState(0);
  const { enabled: soundEnabled, setEnabled: setSoundEnabled, play, stop } = useWorkshopSound();
  const step = steps[activeStep];
  const category = step.id === 'review' ? null : step.id;
  const total = useMemo(() => calculateTotal(basePrice, selections), [selections]);
  const currentStepTouched = category ? touchedCategories[category] : true;
  const canContinue = !category
    ? true
    : category === 'body'
      ? currentStepTouched && Boolean(selections.body)
      : currentStepTouched || activeStep <= completedThrough;
  const stepHeading = category === 'body' ? step.title : step.prompt;

  useEffect(() => {
    const ids = Object.fromEntries(Object.entries(selections).map(([category, option]) => [category, option?.id ?? null]));
    localStorage.setItem(storageKey, JSON.stringify(ids));
  }, [selections]);

  const select = (category: Category, option: AssetOption | null) => {
    setSelections((current) => ({ ...current, [category]: option }));
    setTouchedCategories((current) => ({ ...current, [category]: true }));
    setMotionKey((key) => key + 1);
    play('select');
  };

  const moveTo = (index: number) => {
    const target = Math.max(0, Math.min(steps.length - 1, index));
    if (target > completedThrough + 1) {
      play('blocked');
      return;
    }
    setActiveStep(target);
    play(target < activeStep ? 'back' : target === steps.length - 1 ? 'finish' : 'forward');
  };

  const next = () => {
    if (!canContinue) {
      play('blocked');
      return;
    }
    setCompletedThrough((current) => Math.max(current, activeStep));
    const target = Math.min(steps.length - 1, activeStep + 1);
    setActiveStep(target);
    play(target === steps.length - 1 ? 'finish' : 'forward');
  };

  const randomOption = (category: Category): AssetOption | null => {
    const options = catalog[category];
    if (optionalCategories.has(category) && Math.random() < 0.18) return null;
    return options[Math.floor(Math.random() * options.length)] ?? null;
  };

  const randomizeAll = () => {
    const nextSelections = defaultSelections();
    for (const category of allCategories) {
      nextSelections[category] = randomOption(category);
    }
    setUndoSnapshot({ selections, touched: touchedCategories });
    setSelections(nextSelections);
    setTouchedCategories(allTouched());
    setMotionKey((key) => key + 1);
    play('randomise');
  };

  const randomizeCurrent = () => {
    if (!category) {
      randomizeAll();
      return;
    }
    setUndoSnapshot({ selections, touched: touchedCategories });
    setSelections((current) => ({ ...current, [category]: randomOption(category) }));
    setTouchedCategories((current) => ({ ...current, [category]: true }));
    setMotionKey((key) => key + 1);
    play('randomise');
  };

  const restorePrevious = () => {
    if (!undoSnapshot) return;
    setSelections(undoSnapshot.selections);
    setTouchedCategories(undoSnapshot.touched);
    setUndoSnapshot(null);
    setMotionKey((key) => key + 1);
    play('restore');
  };

  const reset = () => {
    setUndoSnapshot({ selections, touched: touchedCategories });
    setSelections(defaultSelections());
    setTouchedCategories(blankTouched());
    setActiveStep(0);
    setCompletedThrough(-1);
    setMotionKey((key) => key + 1);
    play('reset');
  };

  const startRandomized = () => {
    stop('homeTune', 180);
    randomizeAll();
    setStarted(true);
    setActiveStep(steps.length - 1);
    setCompletedThrough(steps.length - 2);
  };

  if (!started) {
    return (
      <WelcomeScreen
        soundEnabled={soundEnabled}
        onPlayTune={() => play('homeTune')}
        onToggleSound={() => {
          const nextEnabled = !soundEnabled;
          setSoundEnabled(nextEnabled);
          if (nextEnabled) play('homeTune');
        }}
        onStart={() => {
          stop('homeTune', 180);
          setStarted(true);
          window.setTimeout(() => play('welcome'), 140);
        }}
        onRandomize={startRandomized}
      />
    );
  }

  return (
    <main className="workshop-app" data-step-id={step.id}>
      <header className="app-header">
        <button className="app-logo-button" onClick={() => { setStarted(false); play('homeTune'); }} aria-label="Return to Pubbets Workshop home">
          <img src={pubbetsWorkshopLogo} alt="Pubbets Workshop" />
        </button>
        <div className="header-actions">
          <UiArtButton asset="randomiseSquare" label={category ? `Randomise ${category}` : 'Randomise build'} size="square" onClick={randomizeCurrent} title="Randomise" />
          <UiArtButton asset={soundEnabled ? 'soundOn' : 'soundOff'} label={soundEnabled ? 'Mute sound' : 'Enable sound'} size="square" onClick={() => setSoundEnabled(!soundEnabled)} title="Sound" />
        </div>
      </header>
      <StepRail steps={steps} activeStep={activeStep} completedThrough={completedThrough} onStepChange={moveTo} />
      <div className="builder-layout">
        <section className="preview-column">
          <div className="mobile-step-heading"><strong>{stepHeading}</strong></div>
          <PuppetPreview selections={selections} closeUp={['eyes', 'nose', 'glasses', 'hair'].includes(step.id)} bodyOnly={step.id === 'body'} motionKey={motionKey} />
          {undoSnapshot && <button className="restore-randomize" onClick={restorePrevious}>Restore previous</button>}
          {step.id !== 'body' && <div className="price-ticket"><span>Build total</span><strong>{formatMoney(total)}</strong></div>}
        </section>
        <section className="controls-column">
          <header className="controls-heading">
            {category !== 'body' && <span className="eyebrow">{step.title}</span>}
            <h1>{stepHeading}</h1>
            <p>{category === 'body' ? 'Body colour is required. Tap a colour to preview it live.' : category ? 'Tap a choice to see it on your Pubbet.' : 'Everything look just right?'}</p>
          </header>
          {category ? (
            <OptionPanel
              category={category}
              options={catalog[category]}
              selected={selections[category]}
              touched={touchedCategories[category]}
              onSelect={(option) => select(category, option)}
              onBack={() => moveTo(activeStep - 1)}
            />
          ) : <ReviewPanel selections={selections} total={total} />}
          <footer className="navigation-bar">
            <UiArtButton asset="back" label="Back" size="wide" onClick={() => moveTo(activeStep - 1)} disabled={activeStep === 0} />
            <UiArtButton asset="reset" label="Reset build" size="wide" onClick={reset} />
            {activeStep < steps.length - 1 && canContinue && (
              <UiArtButton asset="next" label={activeStep === 7 ? 'Review build' : 'Next step'} size="wide" onClick={next} />
            )}
          </footer>
        </section>
      </div>
    </main>
  );
}
