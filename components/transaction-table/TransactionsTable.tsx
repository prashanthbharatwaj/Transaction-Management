import React from 'react';
import type { Transaction, TransactionStatus } from '@/types';
import { getEffectiveTransactionStatus } from '@/utils/transaction';
import { TransactionDataRow } from './TransactionDataRow';
import { thClass } from './tableStyles';

type TransactionsTableProps = {
  transactions: Transaction[];
  showSelectColumn: boolean;
  statusUpdates: Record<string, TransactionStatus>;
  selectedIds: Set<string>;
  retryingStates: Record<string, boolean>;
  downloadingIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onDownloadInvoice: (id: string) => void;
};

export function TransactionsTable({
  transactions,
  showSelectColumn,
  statusUpdates,
  selectedIds,
  retryingStates,
  downloadingIds,
  onToggleSelect,
  onDownloadInvoice,
}: TransactionsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-4px_rgba(15,23,42,0.08)]">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              {showSelectColumn ? <th className={thClass}>Select</th> : null}
              <th className={thClass}>Transaction ID</th>
              <th className={thClass}>Amount</th>
              <th className={thClass}>Date &amp; Time</th>
              <th className={thClass}>Status</th>
              <th className={thClass}>Description</th>
              <th className={thClass}>Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {transactions.map((transaction, index) => {
              const id = transaction.id;
              const status = getEffectiveTransactionStatus(transaction, statusUpdates);
              return (
                <TransactionDataRow
                  key={id}
                  transaction={transaction}
                  effectiveStatus={status}
                  showSelectColumn={showSelectColumn}
                  isSelected={selectedIds.has(id)}
                  isRetrying={Boolean(retryingStates[id])}
                  isDownloading={downloadingIds.has(id)}
                  onToggleSelect={onToggleSelect}
                  onDownloadInvoice={onDownloadInvoice}
                  zebra={index % 2 === 1}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
