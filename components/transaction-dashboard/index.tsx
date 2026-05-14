'use client';

import React, { useCallback, useState } from 'react';
import type { Transaction } from '@/types';
import { usePaginatedTransactions } from '@/hooks/usePaginatedTransactions';
import { useTimedToasts } from '@/hooks/useTimedToasts';
import {
  useTransactionPaymentRetries,
  type RetryRequestErrorInfo,
  type RetrySettledInfo,
} from '@/hooks/useTransactionPaymentRetries';
import { TransactionTable } from '@/components/transaction-table';
import { Pagination } from '@/components/pagination';
import { ToastViewport } from '@/components/toast-viewport';

const ITEMS_PER_PAGE = 10;
const TOAST_MS = 4000;

function PageHeader() {
  return (
    <header className="mb-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600/90">Billing</p>
      <h1 className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
        Transaction history
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
        View charges, download invoices, and retry failed payments in one place.
      </p>
    </header>
  );
}

function InitialLoadScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-100 via-white to-indigo-50/40 px-4">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" aria-hidden />
      <p className="text-base font-medium text-slate-700">Loading transactions…</p>
    </div>
  );
}

export function TransactionDashboard() {
  const [statusOverrides, setStatusOverrides] = useState<Record<string, Transaction['status']>>({});

  const { toasts, pushToast, dismissToast } = useTimedToasts(TOAST_MS);

  const pushApiErrorToast = useCallback(
    (message: string) => {
      pushToast(message, 'Failed');
    },
    [pushToast]
  );

  const {
    page,
    setPage,
    transactions,
    totalPages,
    totalItems,
    isInitialLoad,
    isPageRefreshing,
  } = usePaginatedTransactions(ITEMS_PER_PAGE, { onError: pushApiErrorToast });

  const onRetrySettled = useCallback(
    ({ transactionId, status }: RetrySettledInfo) => {
      pushToast(`Payment retry for ${transactionId}`, status);
    },
    [pushToast]
  );

  const onRetryRequestError = useCallback(
    ({ transactionId, message }: RetryRequestErrorInfo) => {
      pushToast(`Could not retry payment for ${transactionId}. ${message}`, 'Failed');
    },
    [pushToast]
  );

  const { retryingById, handleRetrySelected } = useTransactionPaymentRetries({
    setStatusOverrides,
    onRetrySettled,
    onRetryRequestError,
  });

  if (isInitialLoad) {
    return (
      <>
        <ToastViewport toasts={toasts} onDismiss={dismissToast} />
        <InitialLoadScreen />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-100/35 py-8 sm:py-12">
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader />

        <section className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-xl shadow-slate-300/40 ring-1 ring-slate-900/[0.04] backdrop-blur-sm sm:p-8">
          <div className="mb-6 flex flex-col gap-1 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent activity</h2>
              <p className="text-sm text-slate-500">Rows update when you retry or change page.</p>
            </div>
          </div>

          <TransactionTable
            transactions={transactions}
            onRetryClick={handleRetrySelected}
            retryingStates={retryingById}
            statusUpdates={statusOverrides}
            isLoading={isPageRefreshing}
            onDownloadError={pushApiErrorToast}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            isLoading={isPageRefreshing}
          />
        </section>
      </div>
    </div>
  );
}
