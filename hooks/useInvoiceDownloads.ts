'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Transaction } from '@/types';
import { downloadInvoice } from '@/lib/transaction';
import { getErrorMessage } from '@/utils/error-message';

export type UseInvoiceDownloadsOptions = {
  onError?: (message: string) => void;
};

export function useInvoiceDownloads(
  transactions: Transaction[],
  options?: UseInvoiceDownloadsOptions
) {
  const onErrorRef = useRef(options?.onError);
  useEffect(() => {
    onErrorRef.current = options?.onError;
  }, [options?.onError]);

  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(() => new Set());

  const downloadInvoiceFor = useCallback(
    async (transactionId: string) => {
      setDownloadingIds((prev) => new Set(prev).add(transactionId));
      try {
        const row = transactions.find((t) => t.id === transactionId);
        if (row) await downloadInvoice(transactionId, row.amount);
      } catch (error) {
        console.error('Failed to download invoice:', error);
        const msg = getErrorMessage(
          error,
          'Unable to download invoice. Please try again.'
        );
        onErrorRef.current?.(msg);
      } finally {
        setDownloadingIds((prev) => {
          const next = new Set(prev);
          next.delete(transactionId);
          return next;
        });
      }
    },
    [transactions]
  );

  return { downloadingIds, downloadInvoiceFor };
}
