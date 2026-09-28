const SMALL: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19,
};

const TENS: Record<string, number> = {
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};

export function parseNumber(value: string): number | null {
  const normalized = value.toLowerCase().replace(/[-,]/g, ' ').trim();
  const numeric = Number(normalized.replace(/\s+/g, ''));
  if (Number.isFinite(numeric) && normalized !== '') return numeric;

  const words = normalized.split(/\s+/).filter(Boolean);
  if (!words.length) return null;
  let total = 0;
  let current = 0;
  for (const word of words) {
    if (word in SMALL) current += SMALL[word]!;
    else if (word in TENS) current += TENS[word]!;
    else if (word === 'hundred') current = (current || 1) * 100;
    else if (word === 'thousand') { total += (current || 1) * 1000; current = 0; }
    else if (word === 'and') continue;
    else return null;
  }
  return total + current;
}
