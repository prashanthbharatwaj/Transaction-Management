import { describe, expect, it } from 'vitest';
import {
  statusPillClass,
  statusSummaryTileClass,
  statusSummaryTileLabelClass,
  statusSummaryTileValueClass,
  statusTextClass,
  toastCardClass,
  toastStatusBadgeClass,
} from '@/utils/transaction-status-styles';

describe('transaction-status-styles', () => {
  it('returns non-empty class strings for each status', () => {
    for (const status of ['Completed', 'Failed', 'Pending'] as const) {
      expect(statusTextClass(status).length).toBeGreaterThan(0);
      expect(statusPillClass(status)).toContain('rounded-full');
      expect(toastCardClass(status)).toContain('border-l-');
      expect(toastStatusBadgeClass(status)).toContain('rounded-full');
      expect(statusSummaryTileClass(status)).toContain('rounded-2xl');
      expect(statusSummaryTileLabelClass(status)).toContain('uppercase');
      expect(statusSummaryTileValueClass(status)).toContain('tabular-nums');
    }
  });
});
