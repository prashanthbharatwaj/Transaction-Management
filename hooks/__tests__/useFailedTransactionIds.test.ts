import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Transaction } from '@/types';
import { useFailedTransactionIds } from '@/hooks/useFailedTransactionIds';

const base: Transaction = {
  id: 'a',
  amount: 1,
  date: '2026-01-01',
  status: 'Completed',
  description: 'x',
};

describe('useFailedTransactionIds', () => {
  it('returns ids whose effective status is Failed', () => {
    const transactions: Transaction[] = [
      { ...base, id: '1', status: 'Failed' },
      { ...base, id: '2', status: 'Completed' },
    ];
    const { result } = renderHook(() => useFailedTransactionIds(transactions, {}));
    expect(result.current).toEqual(['1']);
  });

  it('includes rows overridden to Failed via statusUpdates', () => {
    const transactions: Transaction[] = [{ ...base, id: '3', status: 'Completed' }];
    const { result } = renderHook(() =>
      useFailedTransactionIds(transactions, { '3': 'Failed' })
    );
    expect(result.current).toEqual(['3']);
  });

  it('excludes rows overridden away from Failed', () => {
    const transactions: Transaction[] = [{ ...base, id: '4', status: 'Failed' }];
    const { result } = renderHook(() =>
      useFailedTransactionIds(transactions, { '4': 'Completed' })
    );
    expect(result.current).toEqual([]);
  });
});
