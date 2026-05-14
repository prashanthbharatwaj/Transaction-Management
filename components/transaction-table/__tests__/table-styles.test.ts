import { describe, expect, it } from 'vitest';
import { tdClass, thClass } from '@/components/transaction-table/tableStyles';

describe('tableStyles', () => {
  it('exports header and body cell class strings used by the table', () => {
    expect(thClass).toContain('uppercase');
    expect(thClass).toContain('text-slate-500');
    expect(tdClass).toContain('border-b');
    expect(tdClass).toContain('text-slate-700');
  });
});
