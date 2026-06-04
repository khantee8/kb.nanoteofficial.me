import { describe, it, expect } from 'vitest';
import { slugify, mergeTagLabels } from './tags';

describe('tags helpers', () => {
  it('slugify lowercases, trims, dashes spaces, strips junk', () => {
    expect(slugify('  Threat Intel! ')).toBe('threat-intel');
    expect(slugify('BTC/USD')).toBe('btc-usd');
  });
  it('mergeTagLabels dedupes by slug, keeps first label', () => {
    expect(mergeTagLabels(['Macro', 'macro', 'CPI'])).toEqual(['Macro', 'CPI']);
  });
});
