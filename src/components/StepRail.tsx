import type { StepDefinition } from '../types';
import { UiArtImage } from './UiArtButton';

type Props = {
  steps: StepDefinition[];
  activeStep: number;
  completedThrough: number;
  onStepChange: (index: number) => void;
};

export function StepRail({ steps, activeStep, completedThrough, onStepChange }: Props) {
  return (
    <nav className="step-rail" aria-label="Builder steps">
      {steps.map((step, index) => {
        const complete = index <= completedThrough;
        return (
          <button
            className={`step-token ${activeStep === index ? 'is-active' : ''} ${complete ? 'is-complete' : ''}`}
            key={step.id}
            onClick={() => onStepChange(index)}
            aria-current={activeStep === index ? 'step' : undefined}
            aria-label={`Step ${index + 1}: ${step.title}`}
          >
            <span className="step-token__icon" aria-hidden="true">{index + 1}</span>
            <span className="step-token__label">{step.shortLabel}</span>
            {complete && <span className="step-token__check" aria-hidden="true"><UiArtImage asset="completeTick" label="Complete" size="badge" /></span>}
          </button>
        );
      })}
    </nav>
  );
}
