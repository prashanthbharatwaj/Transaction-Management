import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { PaginatedResponse, Transaction } from '@/types';
import * as transactionApi from '@/lib/transaction';
import { usePaginatedTransactions } from '@/hooks/usePaginatedTransactions';

const makePage = (overrides: Partial<PaginatedResponse> = {}): PaginatedResponse => ({
  transactions: [
    {
      id: 'TXN-A',
      amount: 10,
      date: '2026-01-01',
      status: 'Completed',
      description: 'A',
    },
  ] as Transaction[],
  total: 25,
  page: 1,
  limit: 10,
  totalPages: 3,
  summary: { completed: 20, failed: 4, pending: 1 },
  ...overrides,
});

describe('usePaginatedTransactions', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads first page, summary, and pagination metadata from fetchTransactions', async () => {
    vi.spyOn(transactionApi, 'fetchTransactions').mockResolvedValue(makePage());

    const { result } = renderHook(() => usePaginatedTransactions(10));

    expect(result.current.isInitialLoad).toBe(true);

    await waitFor(() => {
      expect(result.current.isInitialLoad).toBe(false);
    });

    expect(result.current.transactions).toHaveLength(1);
    expect(result.current.transactions[0].id).toBe('TXN-A');
    expect(result.current.totalPages).toBe(3);
    expect(result.current.totalItems).toBe(25);
    expect(result.current.summary).toEqual({ completed: 20, failed: 4, pending: 1 });
    expect(result.current.isPageRefreshing).toBe(false);
    expect(result.current.page).toBe(1);
  });

  it('refetches when page changes', async () => {
    const fetchSpy = vi
      .spyOn(transactionApi, 'fetchTransactions')
      .mockResolvedValueOnce(makePage({ page: 1 }))
      .mockResolvedValueOnce(
        makePage({
          page: 2,
          transactions: [
            {
              id: 'TXN-B',
              amount: 20,
              date: '2026-01-02',
              status: 'Failed',
              description: 'B',
            },
          ],
        })
      );

    const { result } = renderHook(() => usePaginatedTransactions(10));

    await waitFor(() => expect(result.current.transactions[0]?.id).toBe('TXN-A'));

    act(() => {
      result.current.setPage(2);
    });

    await waitFor(() => expect(result.current.transactions[0]?.id).toBe('TXN-B'));
    expect(fetchSpy).toHaveBeenLastCalledWith(2, 10);
  });

  it('invokes onError when fetchTransactions rejects', async () => {
    const onError = vi.fn();
    vi.spyOn(transactionApi, 'fetchTransactions').mockRejectedValue(new Error('service down'));

    const { result } = renderHook(() => usePaginatedTransactions(10, { onError }));

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('service down');
    });
    expect(result.current.isInitialLoad).toBe(false);
    expect(result.current.transactions).toEqual([]);
  });
});
