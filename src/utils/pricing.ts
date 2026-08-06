import type { SelectionState } from '../types';

export function calculateTotal(basePrice: number, selections: SelectionState): number {
  return Object.values(selections).reduce((total, option) => total + (option?.price ?? 0), basePrice);
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}
