import type { StepDefinition } from '../types';

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
            <span className="step-token__icon" aria-hidden="true">{step.icon}</span>
            <span className="step-token__label">{step.shortLabel}</span>
            {complete && <span className="step-token__check" aria-hidden="true">✓</span>}
          </button>
        );
      })}
    </nav>
  );
}
