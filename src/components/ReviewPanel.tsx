import { steps } from '../data/catalog';
import type { Category, SelectionState } from '../types';
import { formatMoney } from '../utils/pricing';
import { UiArtButton } from './UiArtButton';

type Props = { selections: SelectionState; total: number; onSave: () => void };

export function ReviewPanel({ selections, total, onSave }: Props) {
  return (
    <section className="review-panel">
      <div className="review-banner"><span>OK</span><div><strong>What a character!</strong><small>Your workshop build is ready.</small></div></div>
      <div className="review-list">
        {steps.slice(0, 8).map((step, index) => {
          const option = selections[step.id as Category];
          return <div className="review-row" key={step.id}><span>{index + 1}</span><div><small>{step.shortLabel}</small><strong>{option?.label ?? 'Skipped'}</strong></div><b>{option?.price ? `+$${option.price.toFixed(2)}` : 'Included'}</b></div>;
        })}
      </div>
      <div className="review-total"><span>Workshop total</span><strong>{formatMoney(total)}</strong></div>
      <UiArtButton asset="saveBuildSheet" label="Save build sheet" size="long" onClick={onSave} />
      <p className="checkout-note">Checkout stays off until real Shopify base and add-on variants are mapped, so the amount charged can never disagree with this total.</p>
    </section>
  );
}
