import { useEffect, useMemo, useState } from 'react';
import { catalog, basePrice, defaultSelections, steps } from './data/catalog';
import { OptionPanel } from './components/OptionPanel';
import { PuppetPreview } from './components/PuppetPreview';
import { ReviewPanel } from './components/ReviewPanel';
import { StepRail } from './components/StepRail';
import { UiArtButton } from './components/UiArtButton';
import { WelcomeScreen } from './components/WelcomeScreen';
import { WorkshopEntrance } from './components/WorkshopEntrance';
import { useWorkshopSound } from './hooks/useWorkshopSound';
import type { AssetOption, Category, SelectionState } from './types';
import { calculateTotal, formatMoney } from './utils/pricing';
import pubbetsWorkshopLogo from '../assets/ui/logo/pubbets-workshop-logo.png';

const storageKey = 'pubbets-workshop-v1.3-selection';
const optionalCategories = new Set<Category>(['eyes', 'nose', 'glasses', 'hair', 'outfit', 'shoes', 'accessory']);
const allCategories = Object.keys(catalog) as Category[];
const closeUpSteps = new Set(['eyes', 'nose', 'glasses', 'hair']);

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
  const [enteredWorkshop, setEnteredWorkshop] = useState(false);
  const [started, setStarted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completedThrough, setCompletedThrough] = useState(-1);
  const [selections, setSelections] = useState<SelectionState>(restoreSelections);
  const [undoSnapshot, setUndoSnapshot] = useState<UndoSnapshot | null>(null);
  const [touchedCategories, setTouchedCategories] = useState<TouchedState>(() => touchedFromSelections(restoreSelections()));
  const [motionKey, setMotionKey] = useState(0);
  const [previewMode, setPreviewMode] = useState<'full' | 'close'>('full');
  const { enabled: soundEnabled, setEnabled: setSoundEnabled, play, stop, isPlaying } = useWorkshopSound();
  const step = steps[activeStep];
  const category = step.id === 'review' ? null : step.id;
  const total = useMemo(() => calculateTotal(basePrice, selections), [selections]);
  const currentStepTouched = category ? touchedCategories[category] : true;
  const canContinue = !category
    ? true
    : category === 'body'
      ? currentStepTouched && Boolean(selections.body)
      : currentStepTouched || activeStep <= completedThrough;
  const trayTitles: Record<string, string> = {
    body: 'Choose your colour',
    eyes: 'Choose your eye shape',
    nose: 'Choose your nose',
    glasses: 'Add glasses?',
    hair: 'Pick a hairstyle',
    outfit: 'Dress your Pubbet',
    shoes: 'Choose shoes',
    accessory: 'Add extras?',
    review: 'Your Pubbet'
  };
  const stepHeading = trayTitles[step.id] ?? (category === 'body' ? step.title : step.prompt);

  useEffect(() => {
    const ids = Object.fromEntries(Object.entries(selections).map(([category, option]) => [category, option?.id ?? null]));
    localStorage.setItem(storageKey, JSON.stringify(ids));
  }, [selections]);

  useEffect(() => {
    setPreviewMode(closeUpSteps.has(step.id) ? 'close' : 'full');
  }, [step.id]);

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

  if (!enteredWorkshop) {
    return (
      <WorkshopEntrance
        onEnter={() => play('homeTune')}
        onEntered={() => setEnteredWorkshop(true)}
      />
    );
  }

  if (!started) {
    return (
      <WelcomeScreen
        soundEnabled={soundEnabled}
        tunePlaying={isPlaying('homeTune')}
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
    <main className="workshop-app" data-step-id={step.id} data-preview-mode={previewMode}>
      <header className="app-header">
        <button className="app-logo-button" onClick={() => { setStarted(false); play('homeTune'); }} aria-label="Return to Pubbets Workshop home">
          <img src={pubbetsWorkshopLogo} alt="Pubbets Workshop" />
        </button>
        <div className="step-status" aria-live="polite">Step {activeStep + 1} of {steps.length}</div>
        <div className="header-actions">
          <UiArtButton asset="reset" label="Reset build" size="square" className="header-dot" onClick={reset} title="Reset" />
          <UiArtButton asset="randomiseSquare" label={category ? `Randomise ${category}` : 'Randomise build'} size="square" className="header-dot" onClick={randomizeCurrent} title="Randomise" />
          <UiArtButton asset={soundEnabled ? 'soundOn' : 'soundOff'} label={soundEnabled ? 'Mute sound' : 'Enable sound'} size="square" className="header-dot" onClick={() => setSoundEnabled(!soundEnabled)} title="Sound" />
        </div>
      </header>
      <StepRail steps={steps} activeStep={activeStep} completedThrough={completedThrough} onStepChange={moveTo} />
      <div className="builder-layout">
        <section className="preview-column">
          <button
            className="preview-mode-toggle"
            onClick={() => setPreviewMode((mode) => mode === 'full' ? 'close' : 'full')}
            type="button"
          >
            {previewMode === 'full' ? 'Close-up view' : 'Full body view'}
          </button>
          {undoSnapshot && <button className="restore-randomize" onClick={restorePrevious}>Restore previous</button>}
          <PuppetPreview selections={selections} closeUp={previewMode === 'close'} bodyOnly={step.id === 'body'} motionKey={motionKey} />
        </section>
        <section className="choice-tray">
          <header className="tray-heading">
            <h1>{stepHeading}</h1>
            {step.id !== 'review' && (
              <aside className="price-ticket" aria-label="Estimated workshop total">
                <span>Build total</span>
                <strong>{formatMoney(total)}</strong>
              </aside>
            )}
          </header>
          {category ? (
            <OptionPanel
              category={category}
              options={catalog[category]}
              selected={selections[category]}
              touched={touchedCategories[category]}
              onSelect={(option) => select(category, option)}
            />
          ) : <ReviewPanel selections={selections} total={total} />}
          <footer className="tray-actions">
            {category && optionalCategories.has(category) && (
              <UiArtButton
                asset="skipThisStep"
                label="Skip this step"
                size="wide"
                className={`tray-skip${currentStepTouched && selections[category] === null ? ' is-skip-selected' : ''}`}
                onClick={() => select(category, null)}
              />
            )}
            {activeStep < steps.length - 1 && (
              <UiArtButton
                asset="ok"
                label={canContinue ? (activeStep === 7 ? 'Review build' : 'OK?') : 'Choose an option first'}
                size="wide"
                className="tray-confirm"
                onClick={next}
                disabled={!canContinue}
              />
            )}
          </footer>
        </section>
      </div>
    </main>
  );
}
