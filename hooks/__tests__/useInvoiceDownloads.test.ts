import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Transaction } from '@/types';
import * as transactionApi from '@/lib/transaction';
import { useInvoiceDownloads } from '@/hooks/useInvoiceDownloads';

const rows: Transaction[] = [
  { id: 'TX-1', amount: 12.99, date: '2026-01-01', status: 'Completed', description: 'Sub' },
];

describe('useInvoiceDownloads', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls downloadInvoice with id and amount then clears downloadingIds', async () => {
    const downloadSpy = vi.spyOn(transactionApi, 'downloadInvoice').mockResolvedValue(undefined);

    const { result } = renderHook(() => useInvoiceDownloads(rows));

    expect(result.current.downloadingIds.has('TX-1')).toBe(false);

    await act(async () => {
      await result.current.downloadInvoiceFor('TX-1');
    });

    expect(downloadSpy).toHaveBeenCalledWith('TX-1', 12.99);
    expect(result.current.downloadingIds.has('TX-1')).toBe(false);
  });

  it('tracks downloadingIds while downloadInvoice is in flight', async () => {
    let resolveDownload: () => void = () => {};
    const pending = new Promise<void>((r) => {
      resolveDownload = r;
    });
    vi.spyOn(transactionApi, 'downloadInvoice').mockReturnValue(pending);

    const { result } = renderHook(() => useInvoiceDownloads(rows));

    void act(() => {
      void result.current.downloadInvoiceFor('TX-1');
    });

    await waitFor(() => {
      expect(result.current.downloadingIds.has('TX-1')).toBe(true);
    });

    await act(async () => {
      resolveDownload();
      await pending;
    });

    await waitFor(() => {
      expect(result.current.downloadingIds.has('TX-1')).toBe(false);
    });
  });

  it('does not call downloadInvoice when id is missing from transactions', async () => {
    const downloadSpy = vi.spyOn(transactionApi, 'downloadInvoice').mockResolvedValue(undefined);

    const { result } = renderHook(() => useInvoiceDownloads(rows));

    await act(async () => {
      await result.current.downloadInvoiceFor('unknown');
    });

    expect(downloadSpy).not.toHaveBeenCalled();
    expect(result.current.downloadingIds.has('unknown')).toBe(false);
  });

  it('invokes onError when downloadInvoice rejects', async () => {
    const onError = vi.fn();
    vi.spyOn(transactionApi, 'downloadInvoice').mockRejectedValue(new Error('disk full'));

    const { result } = renderHook(() => useInvoiceDownloads(rows, { onError }));

    await act(async () => {
      await result.current.downloadInvoiceFor('TX-1');
    });

    expect(onError).toHaveBeenCalledWith('disk full');
  });
});
