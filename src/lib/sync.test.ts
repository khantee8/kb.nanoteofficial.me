import { describe, it, expect } from 'vitest';
import { mapEntryToItem } from './sync';
import type { KbEntry } from './kbEntry';

const entry: KbEntry = {
  id: 'fin-2026-06-01', dept: 'fin', date: '2026-06-01', ts: '2026-06-01T10:00:00Z',
  category: 'market-brief', tags: ['BTC', ' btc ', 'Macro'], status: 'published',
  summary: 'S', highlight: 'H', flags: ['watch CPI'],
  artifacts: [{ kind: 'tags', title: 'T', tags: ['x'] }], markdown: '# body',
};

describe('mapEntryToItem', () => {
  it('maps fields and normalizes tags', () => {
    const r = mapEntryToItem(entry);
    expect(r.kind).toBe('company_brief');
    expect(r.externalId).toBe('fin-2026-06-01');
    expect(r.dept).toBe('fin');
    expect(r.category).toBe('market-brief');
    expect(r.bodyMd).toBe('# body');
    expect(r.sourceDate).toBe('2026-06-01');
    expect(r.tags).toEqual(['btc', 'macro']); // trimmed, lowercased, deduped
    expect(r.flags).toEqual(['watch CPI']);
    expect(r.artifacts).toHaveLength(1);
  });
});
