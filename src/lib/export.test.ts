import { describe, it, expect } from 'vitest';
import { toMarkdown, toJson } from './export';
import type { Item } from './types';

const item: Item = {
  id: '1', kind: 'company_brief', externalId: 'fin-1', dept: 'fin', category: 'market-brief',
  summary: 'Sum', highlight: 'High', bodyMd: '## Body\ntext', flags: ['flag a'],
  artifacts: [], sourceDate: '2026-06-01', sourceTs: '2026-06-01T10:00:00Z',
  createdAt: 'x', updatedAt: 'y', tags: ['btc', 'macro'],
};

describe('export', () => {
  it('toMarkdown includes title, meta, summary, flags, body', () => {
    const md = toMarkdown([item]);
    expect(md).toContain('# Market Brief — Finance');
    expect(md).toContain('2026-06-01');
    expect(md).toContain('`btc`');
    expect(md).toContain('flag a');
    expect(md).toContain('## Body');
  });
  it('toJson round-trips the items array', () => {
    const parsed = JSON.parse(toJson([item]));
    expect(parsed.items[0].externalId).toBe('fin-1');
    expect(parsed.count).toBe(1);
  });
});
