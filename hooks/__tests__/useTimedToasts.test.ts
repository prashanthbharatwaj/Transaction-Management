import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTimedToasts } from '@/hooks/useTimedToasts';

describe('useTimedToasts', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('prepends a toast with message and status', () => {
    const { result } = renderHook(() => useTimedToasts(3000));

    act(() => {
      result.current.pushToast('Payment retry for TXN-001', 'Completed');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Payment retry for TXN-001');
    expect(result.current.toasts[0].status).toBe('Completed');
    expect(result.current.toasts[0].id).toBeDefined();
  });

  it('removes a toast after durationMs', () => {
    const { result } = renderHook(() => useTimedToasts(1000));

    act(() => {
      result.current.pushToast('m', 'Failed');
    });
    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('dismissToast clears the toast and its timer', () => {
    const { result } = renderHook(() => useTimedToasts(5000));

    act(() => {
      result.current.pushToast('x', 'Pending');
    });
    const id = result.current.toasts[0].id;

    act(() => {
      result.current.dismissToast(id);
    });

    expect(result.current.toasts).toHaveLength(0);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('keeps newest toast first in the list', () => {
    const { result } = renderHook(() => useTimedToasts(10_000));

    act(() => {
      result.current.pushToast('first', 'Failed');
      result.current.pushToast('second', 'Completed');
    });

    expect(result.current.toasts[0].message).toBe('second');
    expect(result.current.toasts[1].message).toBe('first');
  });
});
