import type { CurrencyCode } from '@/lib/currency';
import { currencyLocale } from '@/lib/currency';

export function formatCurrency(value: number, currency: CurrencyCode = 'USD'): string {
  return new Intl.NumberFormat(currencyLocale(currency), {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Math.round(value * 100) / 100);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
