import type { Category, SelectionState } from '../types';

// Skip discounts (as per James 2026-09-02 decision)
const SKIP_OUTFIT_DISCOUNT = 14.95;
const SKIP_HAIR_DISCOUNT = 9.95;

export function calculateTotal(basePrice: number, selections: SelectionState): number {
  // Start with base price
  let total = basePrice;

  // Sum up selected options
  total += Object.values(selections).reduce((sum, option) => sum + (option?.price ?? 0), 0);

  // Apply skip discounts
  const outfit = selections.outfit;
  const hair = selections.hair;

  if (!outfit) {
    total -= SKIP_OUTFIT_DISCOUNT;
  }
  if (!hair) {
    total -= SKIP_HAIR_DISCOUNT;
  }

  return total;
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}
