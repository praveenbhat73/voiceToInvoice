import type { LineItem } from '@/types/invoice';
import { detectCurrency, type CurrencyCode } from '@/lib/currency';
import { parseNumber } from '@/lib/number-words';
import { uid } from '@/lib/utils';

/**
 * Words which can represent numbers in speech.
 */
const NUMBER_WORDS =
  'zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand';

/**
 * Currency words/symbols.
 */
const CURRENCY_WORDS =
  '₹|\\$|€|£|INR|USD|EUR|GBP|AED|CAD|AUD|SGD|rupees?|rupee|rs\\.?|dollars?|dollar|euros?|euro|pounds?|pound|dirhams?|dirham';

/**
 * Matches either:
 *
 * 2
 * two
 * twenty
 * one hundred
 * 100
 */
const NUMBER_PATTERN = new RegExp(
  `(?:\\d+(?:\\.\\d+)?|${NUMBER_WORDS})(?:\\s+(?:${NUMBER_WORDS}))*`,
  'i',
);

/**
 * Convert a spoken number into a real number.
 *
 * Examples:
 *
 * "2"           -> 2
 * "two"         -> 2
 * "twenty"      -> 20
 * "one hundred" -> 100
 */
function toNumber(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const text = value.trim();

  // Normal numeric value.
  if (/^\d+(?:\.\d+)?$/.test(text)) {
    const number = Number(text);

    return Number.isFinite(number) ? number : null;
  }

  // Spoken number.
  const parsed = parseNumber(text);

  if (parsed === undefined || parsed === null) {
    return null;
  }

  const number = Number(parsed);

  return Number.isFinite(number) ? number : null;
}

/**
 * Remove words which are useful for speech but should not
 * become part of the invoice description.
 */
function cleanDescription(value: string): string {
  return value
    .replace(
      /^(?:i\s+)?(?:installed|install|added|add|used|use|replaced|replace|fixed|fix|fitted|fit|bought|buy|purchased|purchase)\s+/i,
      '',
    )
    .replace(
      /^(?:quantity|qty|number|numbers|no)\s+/i,
      '',
    )
    .replace(
      /^of\s+/i,
      '',
    )
    .replace(
      /\s+(?:of|at|for)\s+(?:rate\s+|price\s+|cost\s+)?(?:\d+(?:\.\d+)?|[a-z -]+)\s+(?:rupees?|rupee|rs\.?|dollars?|dollar|euros?|euro|pounds?|pound|dirhams?|dirham|inr|usd|eur|gbp|aed|₹|\$|€|£).*$/i,
      '',
    )
    .replace(
      /\s+(?:rate|price|cost)\s*$/i,
      '',
    )
    .replace(
      /\s+each\s*$/i,
      '',
    )
    .replace(
      /[,.;]+$/,
      '',
    )
    .trim();
}

/**
 * Add an invoice item safely.
 */
function addItem(
  items: LineItem[],
  quantity: number | null,
  description: string,
  rate: number | null,
): void {
  if (
    quantity === null ||
    rate === null ||
    !description ||
    !Number.isFinite(quantity) ||
    !Number.isFinite(rate)
  ) {
    return;
  }

  if (quantity <= 0 || rate < 0) {
    return;
  }

  items.push({
    id: uid(),
    description:
      description.charAt(0).toUpperCase() +
      description.slice(1),
    quantity,
    rate,
  });
}

export interface ParsedInvoiceSpeech {
  lineItems: LineItem[];
  currency: CurrencyCode;
}

/**
 * Extract quantity from the beginning of the sentence.
 *
 * Handles:
 *
 * "two electric wires"
 * "2 electric wires"
 * "quantity two electric wires"
 * "quantity 2 electric wires"
 * "number two electric wires"
 * "two numbers of electric wires"
 * "2 numbers of electric wires"
 * "install two electric wires"
 * "installed 2 electric wires"
 */
function extractQuantityAndDescription(
  text: string,
): {
  quantity: number | null;
  description: string;
  remainingText: string;
} {
  let working = text.trim();

  /*
   * Remove common command/action words.
   *
   * install two...
   * installed two...
   * add two...
   */
  working = working.replace(
    /^(?:i\s+)?(?:installed|install|added|add|used|use|replaced|replace|fixed|fix|fitted|fit|bought|buy|purchased|purchase)\s+/i,
    '',
  );

  /*
   * Remove quantity labels.
   *
   * quantity two...
   * qty two...
   * number two...
   * numbers two...
   * no two...
   */
  working = working.replace(
    /^(?:quantity|qty|number|numbers|no)\s+/i,
    '',
  );

  /*
   * Capture the first number.
   */
  const match = NUMBER_PATTERN.exec(working);

  if (!match) {
    return {
      quantity: null,
      description: '',
      remainingText: working,
    };
  }

  const quantityText = match[0];

  const quantity = toNumber(quantityText);

  /*
   * Remove the number from the beginning.
   */
  let description = working
    .slice(match.index + quantityText.length)
    .trim();

  /*
   * Handle:
   *
   * two numbers of electric wires
   * 2 numbers of electric wires
   */
  description = description.replace(
    /^(?:numbers?|units?|pieces?|pcs?)\s+(?:of\s+)?/i,
    '',
  );

  /*
   * Handle:
   *
   * two of electric wires
   */
  description = description.replace(
    /^of\s+/i,
    '',
  );

  return {
    quantity,
    description,
    remainingText: working,
  };
}

/**
 * Extract rate from the sentence.
 *
 * Handles:
 *
 * of rupees 100
 * of 100 rupees
 * at rupees 100
 * at 100 rupees
 * for 100 rupees
 * rate 100 rupees
 * price 100 dollars
 * cost 100 euros
 * ₹100
 * $100
 */
function extractRate(text: string): {
  rate: number | null;
  description: string;
} {
  /*
   * Currency BEFORE number.
   *
   * rupees 100
   * dollars 100
   * ₹100
   * $100
   */
  const currencyFirst = new RegExp(
    `(?:of\\s+|at\\s+|for\\s+|rate\\s*(?:is|of|at)?\\s*|price\\s*(?:is|of|at)?\\s*|cost\\s*(?:is|of|at)?\\s*)?(?:${CURRENCY_WORDS})\\s*(${NUMBER_PATTERN.source})`,
    'i',
  );

  let match = currencyFirst.exec(text);

  if (match) {
    const rate = toNumber(match[1]);

    if (rate !== null) {
      return {
        rate,
        description: text.slice(0, match.index).trim(),
      };
    }
  }

  /*
   * Number BEFORE currency.
   *
   * 100 rupees
   * 100 dollars
   * one hundred rupees
   */
  const numberFirst = new RegExp(
    `(?:of\\s+|at\\s+|for\\s+|rate\\s*(?:is|of|at)?\\s*|price\\s*(?:is|of|at)?\\s*|cost\\s*(?:is|of|at)?\\s*)?(${NUMBER_PATTERN.source})\\s+(?:${CURRENCY_WORDS})`,
    'i',
  );

  match = numberFirst.exec(text);

  if (match) {
    const rate = toNumber(match[1]);

    if (rate !== null) {
      return {
        rate,
        description: text.slice(0, match.index).trim(),
      };
    }
  }

  /*
   * No currency word.
   *
   * "two wires rate 100"
   */
  const plainRate = new RegExp(
    `(?:rate|price|cost)\\s*(?:is|of|at)?\\s*(${NUMBER_PATTERN.source})`,
    'i',
  );

  match = plainRate.exec(text);

  if (match) {
    const rate = toNumber(match[1]);

    if (rate !== null) {
      return {
        rate,
        description: text.slice(0, match.index).trim(),
      };
    }
  }

  return {
    rate: null,
    description: text,
  };
}

/**
 * Main voice-to-invoice parser.
 */
export function parseVoiceToInvoice(
  transcript: string,
): ParsedInvoiceSpeech {
  const text = (transcript || '')
    .replace(/\s+/g, ' ')
    .trim();

  const currency = detectCurrency(text);

  if (!text) {
    return {
      lineItems: [],
      currency,
    };
  }

  const items: LineItem[] = [];

  /*
   * STEP 1
   *
   * Find quantity + description.
   */
  const quantityResult =
    extractQuantityAndDescription(text);

  /*
   * STEP 2
   *
   * Find rate.
   */
  const rateResult =
    extractRate(quantityResult.description);

  /*
   * STEP 3
   *
   * Clean description.
   */
  const description =
    cleanDescription(rateResult.description);

  /*
   * STEP 4
   *
   * Add invoice item.
   */
  if (
    quantityResult.quantity !== null &&
    rateResult.rate !== null &&
    description
  ) {
    addItem(
      items,
      quantityResult.quantity,
      description,
      rateResult.rate,
    );
  }

  /*
   * STEP 5
   *
   * Fallback:
   *
   * If there was no explicit quantity, assume 1.
   *
   * Example:
   *
   * "electric wires for 100 rupees"
   */
  if (items.length === 0) {
    const fallbackRate =
      extractRate(text);

    const fallbackDescription =
      cleanDescription(fallbackRate.description);

    if (
      fallbackRate.rate !== null &&
      fallbackDescription
    ) {
      addItem(
        items,
        1,
        fallbackDescription,
        fallbackRate.rate,
      );
    }
  }

  return {
    lineItems: items,
    currency,
  };
}