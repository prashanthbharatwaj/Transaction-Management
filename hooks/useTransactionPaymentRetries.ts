'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Transaction } from '@/types';
import { retryPayment } from '@/lib/transaction';
import { getErrorMessage } from '@/utils/error-message';

export type RetrySettledInfo = {
  transactionId: string;
  status: Transaction['status'];
};

export type RetryRequestErrorInfo = {
  transactionId: string;
  message: string;
};

type UseTransactionPaymentRetriesParams = {
  setStatusOverrides: Dispatch<SetStateAction<Record<string, Transaction['status']>>>;
  /** Called once per retry when the attempt has finished (success or simulated failure). */
  onRetrySettled: (info: RetrySettledInfo) => void;
  /** Called when `retryPayment` throws (network / server error). */
  onRetryRequestError?: (info: RetryRequestErrorInfo) => void;
};

export function useTransactionPaymentRetries({
  setStatusOverrides,
  onRetrySettled,
  onRetryRequestError,
}: UseTransactionPaymentRetriesParams) {
  const onRetrySettledRef = useRef(onRetrySettled);
  const onRetryRequestErrorRef = useRef(onRetryRequestError);
  useEffect(() => {
    onRetrySettledRef.current = onRetrySettled;
    onRetryRequestErrorRef.current = onRetryRequestError;
  }, [onRetrySettled, onRetryRequestError]);

  const [retryingById, setRetryingById] = useState<Record<string, boolean>>({});

  const handleRetrySelected = useCallback(
    async (selectedIds: string[]) => {
      setRetryingById((prev) => {
        const next = { ...prev };
        for (const id of selectedIds) next[id] = true;
        return next;
      });

      const runRetry = async (id: string) => {
        try {
          const success = await retryPayment(id);
          const newStatus: Transaction['status'] = success ? 'Completed' : 'Failed';
          setStatusOverrides((prev) => ({ ...prev, [id]: newStatus }));
          onRetrySettledRef.current?.({ transactionId: id, status: newStatus });
        } catch (error) {
          console.error(`Failed to retry payment ${id}:`, error);
          setStatusOverrides((prev) => ({ ...prev, [id]: 'Failed' }));
          const message = getErrorMessage(
            error,
            'Something went wrong while retrying this payment.'
          );
          onRetryRequestErrorRef.current?.({ transactionId: id, message });
        } finally {
          setRetryingById((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
        }
      };

      await Promise.all(selectedIds.map(runRetry));
    },
    [setStatusOverrides]
  );

  return { retryingById, handleRetrySelected };
}
