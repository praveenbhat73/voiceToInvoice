import type { LineItem } from '@/types/invoice';
import { detectCurrency, type CurrencyCode } from '@/lib/currency';
import { parseNumber } from '@/lib/number-words';
import { uid } from '@/lib/utils';

const CURRENCY_WORDS = '(?:₹|\\$|€|£|د\\.إ|INR|USD|EUR|GBP|AED|CAD|AUD|SGD|rupees?|rupee|rs\\.?|dollars?|dollar|euros?|euro|pounds?|pound|dirhams?|dirham|Canadian dollars?|Australian dollars?|Singapore dollars?)';
const NUMBER_WORDS = '(?:\\d+(?:\\.\\d+)?|zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|(?:\\w+[- ])?(?:hundred|thousand))';

function cleanDescription(value: string): string {
  return value
    .replace(/^(?:installed|install|added|used|replaced|replace|fixed|fix|fitted|fit|bought|purchased)\\s+/i, '')
    .replace(/\\s+(?:of|at|for)\\s+(?:rate\\s+)?(?:\\d[\\d.,]*|[a-z -]+)\\s+(?:rupees?|dollars?|euros?|pounds?|inr|usd|eur|gbp|₹|\\$|€|£).*$/i, '')
    .replace(/\\s+(?:rate|price|cost)\\s*$/i, '')
    .replace(/[,.]+$/, '')
    .trim();
}

function addMatch(items: LineItem[], quantity: number, description: string, rate: number): void {
  if (!description || !Number.isFinite(quantity) || !Number.isFinite(rate)) return;
  items.push({ id: uid(), description: description.charAt(0).toUpperCase() + description.slice(1), quantity, rate });
}

export interface ParsedInvoiceSpeech {
  lineItems: LineItem[];
  currency: CurrencyCode;
}

/** Extracts explicit quantity/rate pairs from the user's actual spoken note. */
export function parseVoiceToInvoice(transcript: string): ParsedInvoiceSpeech {
  const text = transcript.replace(/\s+/g, ' ').trim();
  const items: LineItem[] = [];
  const currency = detectCurrency(text);

  // Handles: "installed 2 electric wire of rate hundred rupees"
  const explicitRate = new RegExp(
    `(\\d+(?:\\.\\d+)?)\\s+(.{2,80}?)\\s+(?:of\\s+)?(?:rate\\s+|at\\s+|for\\s+)?(${NUMBER_WORDS})\\s+${CURRENCY_WORDS}(?:\\b|\\s|$)`,
    'gi',
  );
  for (const match of text.matchAll(explicitRate)) {
    const quantity = parseNumber(match[1]!);
    const rate = parseNumber(match[3]!);
    if (quantity !== null && rate !== null) addMatch(items, quantity, cleanDescription(match[2]!), rate);
  }

  // Handles currency symbols placed before the number: "2 wires for $100" / "2 wires at ₹100"
  const symbolFirst = new RegExp(
    `(\\d+(?:\\.\\d+)?)\\s+(.{2,80}?)\\s+(?:at|for|@)\\s+(${CURRENCY_WORDS})\\s*(${NUMBER_WORDS})(?:\\s+each)?`,
    'gi',
  );
  for (const match of text.matchAll(symbolFirst)) {
    const quantity = parseNumber(match[1]!);
    const rate = parseNumber(match[4]!);
    if (quantity !== null && rate !== null) addMatch(items, quantity, cleanDescription(match[2]!), rate);
  }

  // Handles: "2 electric wires at 100 rupees each" / "2 wires for $100 each"
  const eachRate = new RegExp(
    `(\\d+(?:\\.\\d+)?)\\s+(.{2,80}?)\\s+(?:at|for|@)\\s+(${NUMBER_WORDS})\\s+${CURRENCY_WORDS}(?:\\s+each)?`,
    'gi',
  );
  for (const match of text.matchAll(eachRate)) {
    const quantity = parseNumber(match[1]!);
    const rate = parseNumber(match[3]!);
    if (quantity !== null && rate !== null) addMatch(items, quantity, cleanDescription(match[2]!), rate);
  }

  // Handles: "2 electric wires, rate $100" / "2 wires, price 100 rupees"
  const trailingRate = new RegExp(
    `(\\d+(?:\\.\\d+)?)\\s+(.{2,80}?)(?:,|\\s)+(?:rate|price|cost)\\s*(?:is|of|at)?\\s*(${NUMBER_WORDS})\\s+${CURRENCY_WORDS}(?:\\b|\\s|$)`,
    'gi',
  );
  for (const match of text.matchAll(trailingRate)) {
    const quantity = parseNumber(match[1]!);
    const rate = parseNumber(match[3]!);
    if (quantity !== null && rate !== null) addMatch(items, quantity, cleanDescription(match[2]!), rate);
  }

  // If the user gives one explicit price but no quantity, treat it as one unit.
  if (!items.length) {
    const single = new RegExp(`(?:installed|used|replaced|fixed|added|bought|purchased)?\\s*(.{2,80}?)\\s+(?:at|for|rate|price|cost)\\s*(?:is|of)?\\s*(${NUMBER_WORDS})\\s+${CURRENCY_WORDS}(?:\\b|\\s|$)`, 'i').exec(text);
    if (single) {
      const rate = parseNumber(single[2]!);
      if (rate !== null) addMatch(items, 1, cleanDescription(single[1]!), rate);
    }
  }

  // If there is still no explicit item/rate pair, do not resurrect demo fixtures.
  return { lineItems: items, currency };
}
