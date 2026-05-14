'use client';

import { useEffect, useRef, useState } from 'react';
import type { Transaction, TransactionSummary } from '@/types';
import { fetchTransactions } from '@/lib/transaction';
import { getErrorMessage } from '@/utils/error-message';

export type UsePaginatedTransactionsOptions = {
  onError?: (message: string) => void;
};

export function usePaginatedTransactions(
  itemsPerPage: number,
  options?: UsePaginatedTransactionsOptions
) {
  const onErrorRef = useRef(options?.onError);
  useEffect(() => {
    onErrorRef.current = options?.onError;
  }, [options?.onError]);

  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isPageRefreshing, setIsPageRefreshing] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [summary, setSummary] = useState<TransactionSummary>({
    completed: 0,
    failed: 0,
    pending: 0,
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsPageRefreshing(true);
      try {
        const data = await fetchTransactions(page, itemsPerPage);
        if (cancelled) return;
        setTransactions(data.transactions);
        setTotalPages(data.totalPages);
        setTotalItems(data.total);
        setSummary(data.summary);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        const msg = getErrorMessage(
          error,
          'Unable to load transactions. Please try again.'
        );
        onErrorRef.current?.(msg);
      } finally {
        if (!cancelled) {
          setIsInitialLoad(false);
          setIsPageRefreshing(false);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [page, itemsPerPage]);

  return {
    page,
    setPage,
    transactions,
    totalPages,
    totalItems,
    summary,
    isInitialLoad,
    isPageRefreshing,
  };
}
