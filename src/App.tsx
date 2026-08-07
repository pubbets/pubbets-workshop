import { useEffect, useMemo, useState } from 'react';
import { catalog, basePrice, defaultSelections, steps } from './data/catalog';
import { OptionPanel } from './components/OptionPanel';
import { PuppetPreview } from './components/PuppetPreview';
import { ReviewPanel } from './components/ReviewPanel';
import { StepRail } from './components/StepRail';
import { WelcomeScreen } from './components/WelcomeScreen';
import { useWorkshopSound } from './hooks/useWorkshopSound';
import type { AssetOption, Category, SelectionState } from './types';
import { calculateTotal, formatMoney } from './utils/pricing';

const storageKey = 'pubbets-workshop-v1-selection';
const optionalCategories = new Set<Category>(['eyes', 'nose', 'glasses', 'hair', 'outfit', 'shoes', 'accessory']);

function restoreSelections(): SelectionState {
  const defaults = defaultSelections();
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? '{}') as Partial<Record<Category, string | null>>;
    for (const category of Object.keys(catalog) as Category[]) {
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
  const [undoSnapshot, setUndoSnapshot] = useState<SelectionState | null>(null);
  const [motionKey, setMotionKey] = useState(0);
  const { enabled: soundEnabled, setEnabled: setSoundEnabled, play } = useWorkshopSound();
  const step = steps[activeStep];
  const category = step.id === 'review' ? null : step.id;
  const total = useMemo(() => calculateTotal(basePrice, selections), [selections]);

  useEffect(() => {
    const ids = Object.fromEntries(Object.entries(selections).map(([category, option]) => [category, option?.id ?? null]));
    localStorage.setItem(storageKey, JSON.stringify(ids));
  }, [selections]);

  const select = (category: Category, option: AssetOption | null) => {
    setSelections((current) => ({ ...current, [category]: option }));
    setMotionKey((key) => key + 1);
    play(560, 0.09);
  };

  const moveTo = (index: number) => {
    setActiveStep(Math.max(0, Math.min(steps.length - 1, index)));
    play(420 + index * 24, 0.06);
  };

  const next = () => {
    setCompletedThrough((current) => Math.max(current, activeStep));
    moveTo(activeStep + 1);
  };

  const completeFeature = () => {
    play(640, 0.08);
    window.setTimeout(() => play(820, 0.09), 90);
    window.setTimeout(() => play(1040, 0.12), 180);
    next();
  };

  const randomOption = (category: Category): AssetOption | null => {
    const options = catalog[category];
    if (optionalCategories.has(category) && Math.random() < 0.18) return null;
    return options[Math.floor(Math.random() * options.length)] ?? null;
  };

  const randomizeAll = () => {
    const nextSelections = defaultSelections();
    for (const category of Object.keys(catalog) as Category[]) {
      nextSelections[category] = randomOption(category);
    }
    setUndoSnapshot(selections);
    setSelections(nextSelections);
    setMotionKey((key) => key + 1);
    play(680, 0.16);
  };

  const randomizeCurrent = () => {
    if (!category) {
      randomizeAll();
      return;
    }
    setUndoSnapshot(selections);
    setSelections((current) => ({ ...current, [category]: randomOption(category) }));
    setMotionKey((key) => key + 1);
    play(680, 0.16);
  };

  const restorePrevious = () => {
    if (!undoSnapshot) return;
    setSelections(undoSnapshot);
    setUndoSnapshot(null);
    setMotionKey((key) => key + 1);
    play(360, 0.12);
  };

  const reset = () => {
    setUndoSnapshot(selections);
    setSelections(defaultSelections());
    setActiveStep(0);
    setCompletedThrough(-1);
    setMotionKey((key) => key + 1);
    play(300, 0.14);
  };

  const startRandomized = () => {
    randomizeAll();
    setStarted(true);
    setActiveStep(steps.length - 1);
    setCompletedThrough(steps.length - 2);
  };

  const saveBuild = () => {
    const payload = {
      schema: 'pubbets-workshop-build/v1',
      createdAt: new Date().toISOString(),
      basePrice,
      total,
      selections: Object.fromEntries(Object.entries(selections).map(([category, option]) => [category, option ? { id: option.id, label: option.label, price: option.price ?? 0, riveArtboardRef: option.riveArtboardRef } : null]))
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `pubbet-build-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    play(760, 0.22);
  };

  if (!started) {
    return <WelcomeScreen onStart={() => { setStarted(true); play(640, 0.16); }} onRandomize={startRandomized} />;
  }

  return (
    <main className="workshop-app">
      <header className="app-header">
        <button className="mini-brand" onClick={() => setStarted(false)} aria-label="Return to Pubbets Workshop home"><span>Pubbets</span><small>Workshop</small></button>
        <div className="step-badge">Step {activeStep + 1} <span>of {steps.length}</span></div>
        <div className="header-actions">
          <button className="utility-button" onClick={() => moveTo(activeStep - 1)} disabled={activeStep === 0} aria-label="Previous step" title="Back">←</button>
          <button className="utility-button" onClick={reset} aria-label="Reset build" title="Reset">↻</button>
          <button className="utility-button" onClick={() => moveTo(activeStep + 1)} disabled={activeStep === steps.length - 1} aria-label="Next step" title="Forward">→</button>
          <button className="utility-button" onClick={randomizeCurrent} aria-label={category ? `Randomize ${category}` : 'Randomize build'} title="Randomize">⚂</button>
          <button className="utility-button" onClick={() => setSoundEnabled(!soundEnabled)} aria-label={`${soundEnabled ? 'Mute' : 'Enable'} sound`} title="Sound">{soundEnabled ? '♪' : '×'}</button>
        </div>
      </header>
      <div className="builder-layout">
        <StepRail steps={steps} activeStep={activeStep} completedThrough={completedThrough} onStepChange={moveTo} />
        <section className="preview-column">
          <div className="mobile-step-heading"><small>{step.title}</small><strong>{step.prompt}</strong></div>
          <PuppetPreview selections={selections} closeUp={['eyes', 'nose', 'glasses', 'hair'].includes(step.id)} motionKey={motionKey} />
          {undoSnapshot && <button className="restore-randomize" onClick={restorePrevious}>Restore previous</button>}
          <div className="price-ticket"><span>Build total</span><strong>{formatMoney(total)}</strong></div>
        </section>
        <section className="controls-column">
          <header className="controls-heading"><span className="eyebrow">{step.title}</span><h1>{step.prompt}</h1><p>{category ? 'Tap a choice to see it on your Pubbet.' : 'Everything look just right?'}</p></header>
          {category ? <OptionPanel category={category} options={catalog[category]} selected={selections[category]} onSelect={(option) => select(category, option)} onComplete={['eyes', 'nose'].includes(category) ? completeFeature : undefined} onBack={() => moveTo(activeStep - 1)} /> : <ReviewPanel selections={selections} total={total} onSave={saveBuild} />}
          <footer className={`navigation-bar ${['eyes', 'nose'].includes(category ?? '') ? 'navigation-bar--hidden' : ''}`}>
            <button className="secondary-action" onClick={() => moveTo(activeStep - 1)} disabled={activeStep === 0}>← Back</button>
            {activeStep < steps.length - 1 ? <button className="primary-action" onClick={next}>{activeStep === 7 ? 'Review build' : 'Looks good'} <span aria-hidden="true">→</span></button> : <button className="primary-action" onClick={() => { setStarted(false); reset(); }}>Build another</button>}
          </footer>
        </section>
      </div>
    </main>
  );
}
