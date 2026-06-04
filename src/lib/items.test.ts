import { describe, it, expect } from 'vitest';
import { buildItemsWhere } from './items';

describe('buildItemsWhere', () => {
  it('defaults to non-archived', () => {
    const { clauses } = buildItemsWhere({});
    expect(clauses.join(' ')).toContain('archived = false');
  });
  it('filters by dept, category, and search', () => {
    const { clauses, params } = buildItemsWhere({ dept: 'fin', category: 'market-brief', q: 'btc' });
    expect(clauses.some(c => c.includes('i.dept ='))).toBe(true);
    expect(clauses.some(c => c.includes('i.category ='))).toBe(true);
    expect(clauses.some(c => c.includes('i.search @@'))).toBe(true);
    expect(params).toContain('fin');
    expect(params).toContain('market-brief');
  });
  it('archived=true flips the state filter', () => {
    const { clauses } = buildItemsWhere({ archived: true });
    expect(clauses.join(' ')).toContain('archived = true');
  });
  it('pinned=true adds the pinned filter', () => {
    const { clauses } = buildItemsWhere({ pinned: true });
    expect(clauses.join(' ')).toContain('pinned = true');
  });
});
