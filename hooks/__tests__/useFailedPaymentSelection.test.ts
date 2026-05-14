import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useFailedPaymentSelection } from '@/hooks/useFailedPaymentSelection';

describe('useFailedPaymentSelection', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'requestAnimationFrame',
      (cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      }
    );
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('hides select column when there are no failed ids', () => {
    const onRetryClick = vi.fn();
    const { result } = renderHook(() =>
      useFailedPaymentSelection({ failedIds: [], onRetryClick })
    );

    expect(result.current.showSelectColumn).toBe(false);
    expect(result.current.failedCount).toBe(0);
    expect(result.current.allFailedSelected).toBe(false);
  });

  it('select all checks every failed id and retrySelected forwards them', () => {
    const onRetryClick = vi.fn();
    const { result } = renderHook(() =>
      useFailedPaymentSelection({ failedIds: ['a', 'b'], onRetryClick })
    );

    expect(result.current.showSelectColumn).toBe(true);

    act(() => {
      result.current.handleSelectAllChange(true);
    });

    expect(result.current.allFailedSelected).toBe(true);
    expect(result.current.selectedCount).toBe(2);

    act(() => {
      result.current.retrySelected();
    });

    expect(onRetryClick).toHaveBeenCalledTimes(1);
    expect(onRetryClick).toHaveBeenCalledWith(expect.arrayContaining(['a', 'b']));
    expect(onRetryClick.mock.calls[0][0]).toHaveLength(2);
  });

  it('does not call onRetryClick when nothing is selected', () => {
    const onRetryClick = vi.fn();
    const { result } = renderHook(() =>
      useFailedPaymentSelection({ failedIds: ['x'], onRetryClick })
    );

    act(() => {
      result.current.retrySelected();
    });

    expect(onRetryClick).not.toHaveBeenCalled();
  });

  it('toggleSelect adds and removes ids', () => {
    const onRetryClick = vi.fn();
    const { result } = renderHook(() =>
      useFailedPaymentSelection({ failedIds: ['p', 'q'], onRetryClick })
    );

    act(() => {
      result.current.handleToggleSelect('p');
    });
    expect(result.current.selectedIds.has('p')).toBe(true);

    act(() => {
      result.current.handleToggleSelect('p');
    });
    expect(result.current.selectedIds.has('p')).toBe(false);
  });

  it('prunes selection when failedIds no longer includes a selected id', async () => {
    const onRetryClick = vi.fn();
    const { result, rerender } = renderHook(
      ({ failedIds }: { failedIds: string[] }) =>
        useFailedPaymentSelection({ failedIds, onRetryClick }),
      { initialProps: { failedIds: ['keep', 'drop'] } }
    );

    act(() => {
      result.current.handleSelectAllChange(true);
    });
    expect(result.current.selectedCount).toBe(2);

    rerender({ failedIds: ['keep'] });

    await waitFor(() => {
      expect(result.current.selectedIds.has('drop')).toBe(false);
      expect(result.current.selectedIds.has('keep')).toBe(true);
    });
  });
});
