import { describe, expect, it } from 'vitest';
import type { Transaction } from '@/types';
import { getEffectiveTransactionStatus, isTransactionFailed } from '@/utils/transaction';

const baseRow: Transaction = {
  id: 'TXN-1',
  amount: 1,
  date: '2026-01-01',
  status: 'Completed',
  description: 'x',
};

describe('getEffectiveTransactionStatus', () => {
  it('returns override when present', () => {
    expect(getEffectiveTransactionStatus(baseRow, { 'TXN-1': 'Failed' })).toBe('Failed');
  });

  it('falls back to transaction status', () => {
    expect(getEffectiveTransactionStatus(baseRow, {})).toBe('Completed');
  });
});

describe('isTransactionFailed', () => {
  it('is true when effective status is Failed', () => {
    expect(isTransactionFailed(baseRow, { 'TXN-1': 'Failed' })).toBe(true);
  });

  it('is false otherwise', () => {
    expect(isTransactionFailed(baseRow, {})).toBe(false);
  });
});
