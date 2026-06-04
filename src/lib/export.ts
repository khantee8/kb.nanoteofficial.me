import type { Item } from './types';
import { deptLabel, categoryLabel } from './format';

export function toMarkdown(items: Item[]): string {
  return items.map(it => {
    const title = `# ${categoryLabel(it.category)} — ${deptLabel(it.dept)}`;
    const meta = `**Date:** ${it.sourceDate ?? '—'}  ·  **Tags:** ${(it.tags ?? []).map(t => `\`${t}\``).join(' ') || '—'}`;
    const flags = it.flags.length ? `\n**Flags:**\n${it.flags.map(f => `- ${f}`).join('\n')}\n` : '';
    return `${title}\n\n${meta}\n\n> ${it.highlight}\n\n${it.summary}\n${flags}\n---\n\n${it.bodyMd}\n`;
  }).join('\n\n');
}

export function toJson(items: Item[]): string {
  return JSON.stringify({ items, count: items.length, exportedAt: new Date().toISOString() }, null, 2);
}

/** PDF as a print-ready HTML doc built from escaped text only (no raw injection). */
export function toPrintableHtml(items: Item[]): string {
  const esc = (s: string) => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]!));
  const body = items.map(it => `<section><h1>${esc(categoryLabel(it.category))} — ${esc(deptLabel(it.dept))}</h1>
    <p><em>${esc(it.sourceDate ?? '')}</em></p><blockquote>${esc(it.highlight)}</blockquote>
    <p>${esc(it.summary)}</p><pre>${esc(it.bodyMd)}</pre></section>`).join('<hr>');
  return `<!doctype html><html><head><meta charset="utf-8"><title>NaNote Library export</title></head><body>${body}</body></html>`;
}
