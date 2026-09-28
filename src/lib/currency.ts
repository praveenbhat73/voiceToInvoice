export type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'GBP' | 'AED' | 'CAD' | 'AUD' | 'SGD';

export const DEFAULT_CURRENCY: CurrencyCode = 'USD';

const currencyAliases: Array<[CurrencyCode, RegExp]> = [
  ['INR', /(?:₹|\binr\b|indian\s+rupees?|rupees?|rupee|rs\.?)/i],
  ['USD', /(?:\$|\busd\b|us\s+dollars?|dollars?|dollar)/i],
  ['EUR', /(?:€|\beur\b|euros?|euro)/i],
  ['GBP', /(?:£|\bgbp\b|pounds?|pound)/i],
  ['AED', /(?:د\.إ|\baed\b|dirhams?|dirham)/i],
  ['CAD', /(?:\bcad\b|canadian\s+dollars?)/i],
  ['AUD', /(?:\baud\b|australian\s+dollars?)/i],
  ['SGD', /(?:\bsgd\b|singapore\s+dollars?)/i],
];

export function detectCurrency(text: string): CurrencyCode {
  for (const [currency, pattern] of currencyAliases) {
    if (pattern.test(text)) return currency;
  }
  return DEFAULT_CURRENCY;
}

export function currencyLocale(currency: CurrencyCode): string {
  switch (currency) {
    case 'INR': return 'en-IN';
    case 'EUR': return 'de-DE';
    case 'GBP': return 'en-GB';
    case 'AED': return 'en-AE';
    case 'CAD': return 'en-CA';
    case 'AUD': return 'en-AU';
    case 'SGD': return 'en-SG';
    default: return 'en-US';
  }
}
