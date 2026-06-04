import type { DeptId, KbCategory } from './kbEntry';

export const DEPT_LABEL: Record<DeptId, string> = {
  ceo: 'NaNote CEO', fin: 'Finance', cyb: 'CyberX',
  mkt: 'Marketing & Social Media', rnd: 'AI R&D', ops: 'Operations',
};
export const DEPT_COLOR: Record<DeptId, string> = {
  ceo: '#ffdd57', fin: '#7f8cff', cyb: '#39ff9d', mkt: '#ff6b9d', rnd: '#00cfff', ops: '#ff9a3c',
};
export const CATEGORY_LABEL: Record<KbCategory, string> = {
  'market-brief': 'Market Brief', 'threat-intel': 'Threat Intel', research: 'Research',
  'content-plan': 'Content Plan', 'ops-status': 'Ops Status', 'exec-brief': 'Exec Brief',
};
export const ALL_DEPTS: DeptId[] = ['ceo', 'fin', 'cyb', 'mkt', 'rnd', 'ops'];
export const ALL_CATEGORIES: KbCategory[] = [
  'market-brief', 'threat-intel', 'research', 'content-plan', 'ops-status', 'exec-brief',
];

export function deptLabel(d: string | null): string { return d && d in DEPT_LABEL ? DEPT_LABEL[d as DeptId] : (d ?? '—'); }
export function deptColor(d: string | null): string { return d && d in DEPT_COLOR ? DEPT_COLOR[d as DeptId] : '#a78bfa'; }
export function categoryLabel(c: string | null): string { return c && c in CATEGORY_LABEL ? CATEGORY_LABEL[c as KbCategory] : (c ?? '—'); }
