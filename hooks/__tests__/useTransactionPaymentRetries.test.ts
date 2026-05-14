import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import * as transactionApi from '@/lib/transaction';
import { useTransactionPaymentRetries } from '@/hooks/useTransactionPaymentRetries';

describe('useTransactionPaymentRetries', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not call retryPayment when no ids are selected', async () => {
    const retrySpy = vi.spyOn(transactionApi, 'retryPayment').mockResolvedValue(true);
    const setStatusOverrides = vi.fn();
    const onRetrySettled = vi.fn();

    const { result } = renderHook(() =>
      useTransactionPaymentRetries({ setStatusOverrides, onRetrySettled })
    );

    await act(async () => {
      await result.current.handleRetrySelected([]);
    });

    expect(retrySpy).not.toHaveBeenCalled();
    expect(onRetrySettled).not.toHaveBeenCalled();
    expect(setStatusOverrides).not.toHaveBeenCalled();
  });

  it('calls onRetrySettled with Completed when retryPayment resolves true', async () => {
    vi.spyOn(transactionApi, 'retryPayment').mockResolvedValue(true);
    const setStatusOverrides = vi.fn();
    const onRetrySettled = vi.fn();

    const { result } = renderHook(() =>
      useTransactionPaymentRetries({ setStatusOverrides, onRetrySettled })
    );

    await act(async () => {
      await result.current.handleRetrySelected(['TXN-A']);
    });

    expect(onRetrySettled).toHaveBeenCalledTimes(1);
    expect(onRetrySettled).toHaveBeenCalledWith({ transactionId: 'TXN-A', status: 'Completed' });
    expect(setStatusOverrides).toHaveBeenCalled();
    expect(result.current.retryingById).toEqual({});
  });

  it('calls onRetrySettled with Failed when retryPayment resolves false', async () => {
    vi.spyOn(transactionApi, 'retryPayment').mockResolvedValue(false);
    const setStatusOverrides = vi.fn();
    const onRetrySettled = vi.fn();

    const { result } = renderHook(() =>
      useTransactionPaymentRetries({ setStatusOverrides, onRetrySettled })
    );

    await act(async () => {
      await result.current.handleRetrySelected(['TXN-B']);
    });

    expect(onRetrySettled).toHaveBeenCalledWith({ transactionId: 'TXN-B', status: 'Failed' });
  });

  it('invokes onRetryRequestError when retryPayment throws', async () => {
    vi.spyOn(transactionApi, 'retryPayment').mockRejectedValue(new Error('network'));
    const setStatusOverrides = vi.fn();
    const onRetrySettled = vi.fn();
    const onRetryRequestError = vi.fn();

    const { result } = renderHook(() =>
      useTransactionPaymentRetries({
        setStatusOverrides,
        onRetrySettled,
        onRetryRequestError,
      })
    );

    await act(async () => {
      await result.current.handleRetrySelected(['TXN-C']);
    });

    expect(onRetryRequestError).toHaveBeenCalledWith({
      transactionId: 'TXN-C',
      message: 'network',
    });
    expect(onRetrySettled).not.toHaveBeenCalled();
    expect(setStatusOverrides).toHaveBeenCalled();
  });

  it('invokes onRetrySettled once per concurrent retry', async () => {
    vi.spyOn(transactionApi, 'retryPayment').mockImplementation(async (id: string) => id === 'one');
    const setStatusOverrides = vi.fn();
    const onRetrySettled = vi.fn();

    const { result } = renderHook(() =>
      useTransactionPaymentRetries({ setStatusOverrides, onRetrySettled })
    );

    await act(async () => {
      await result.current.handleRetrySelected(['one', 'two']);
    });

    expect(onRetrySettled).toHaveBeenCalledTimes(2);
    expect(onRetrySettled).toHaveBeenCalledWith({ transactionId: 'one', status: 'Completed' });
    expect(onRetrySettled).toHaveBeenCalledWith({ transactionId: 'two', status: 'Failed' });
  });
});
