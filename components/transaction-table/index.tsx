'use client';

import React from 'react';
import type { Transaction, TransactionStatus } from '@/types';
import { useFailedPaymentSelection } from '@/hooks/useFailedPaymentSelection';
import { useFailedTransactionIds } from '@/hooks/useFailedTransactionIds';
import { useInvoiceDownloads } from '@/hooks/useInvoiceDownloads';
import { FailedPaymentsToolbar } from './FailedPaymentsToolbar';
import { TableLoadingState } from './TableLoadingState';
import { TransactionsTable } from './TransactionsTable';

export interface TransactionTableProps {
  transactions: Transaction[];
  onRetryClick: (selectedIds: string[]) => void;
  retryingStates: Record<string, boolean>;
  statusUpdates: Record<string, TransactionStatus>;
  isLoading?: boolean;
  /** Shown as a toast when invoice download fails. */
  onDownloadError?: (message: string) => void;
}

export function TransactionTable({
  transactions,
  onRetryClick,
  retryingStates,
  statusUpdates,
  isLoading = false,
  onDownloadError,
}: TransactionTableProps) {
  const failedIds = useFailedTransactionIds(transactions, statusUpdates);
  const {
    selectedIds,
    failedCount,
    showSelectColumn,
    allFailedSelected,
    selectedCount,
    handleSelectAllChange,
    handleToggleSelect,
    retrySelected,
  } = useFailedPaymentSelection({ failedIds, onRetryClick });
  const { downloadingIds, downloadInvoiceFor } = useInvoiceDownloads(transactions, {
    onError: onDownloadError,
  });

  return (
    <div className="w-full text-gray-900">
      {isLoading ? (
        <TableLoadingState />
      ) : (
        <>
          <FailedPaymentsToolbar
            failedCount={failedCount}
            allFailedSelected={allFailedSelected}
            selectedCount={selectedCount}
            onSelectAllChange={handleSelectAllChange}
            onRetrySelected={retrySelected}
          />
          <TransactionsTable
            transactions={transactions}
            showSelectColumn={showSelectColumn}
            statusUpdates={statusUpdates}
            selectedIds={selectedIds}
            retryingStates={retryingStates}
            downloadingIds={downloadingIds}
            onToggleSelect={handleToggleSelect}
            onDownloadInvoice={downloadInvoiceFor}
          />
        </>
      )}
    </div>
  );
}
