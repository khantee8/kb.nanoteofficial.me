import { describe, it, expect } from 'vitest';
import { buildItemsWhere, rowToItem } from './items';

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

describe('rowToItem', () => {
  it('coerces neon Date columns to strings so they render as React children', () => {
    const r = rowToItem({
      id: '1', kind: 'company_brief', external_id: 'fin-1', dept: 'fin', category: 'market-brief',
      summary: 'S', highlight: 'H', body_md: 'B', flags: [], artifacts: [],
      source_date: new Date('2026-06-03T00:00:00Z'),
      source_ts: new Date('2026-06-03T10:00:00Z'),
      created_at: new Date('2026-06-03T10:00:00Z'), updated_at: new Date('2026-06-03T10:00:00Z'),
      tags: ['btc'], pinned: false, archived: false, saved: false, read: false,
    });
    expect(r.sourceDate).toBe('2026-06-03');
    expect(typeof r.sourceTs).toBe('string');
    expect(typeof r.createdAt).toBe('string');
    expect(r.sourceDate).not.toBeInstanceOf(Date);
  });
});
