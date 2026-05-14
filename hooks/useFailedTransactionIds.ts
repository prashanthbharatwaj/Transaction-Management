'use client';

import { useMemo } from 'react';
import type { Transaction, TransactionStatus } from '@/types';
import { isTransactionFailed } from '@/utils/transaction';

export function useFailedTransactionIds(
  transactions: Transaction[],
  statusUpdates: Record<string, TransactionStatus>
): string[] {
  return useMemo(
    () => transactions.filter((t) => isTransactionFailed(t, statusUpdates)).map((t) => t.id),
    [transactions, statusUpdates]
  );
}
