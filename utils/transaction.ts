import type { Transaction, TransactionStatus } from '@/types';

export function getEffectiveTransactionStatus(
  transaction: Transaction,
  statusUpdates: Record<string, TransactionStatus>
): TransactionStatus {
  return statusUpdates[transaction.id] ?? transaction.status;
}

export function isTransactionFailed(
  transaction: Transaction,
  statusUpdates: Record<string, TransactionStatus>
): boolean {
  return getEffectiveTransactionStatus(transaction, statusUpdates) === 'Failed';
}
