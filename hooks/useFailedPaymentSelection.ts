'use client';

import { useCallback, useEffect, useState } from 'react';

type UseFailedPaymentSelectionOptions = {
  failedIds: string[];
  onRetryClick: (selectedIds: string[]) => void;
};


export function useFailedPaymentSelection({ failedIds, onRetryClick }: UseFailedPaymentSelectionOptions) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const failedCount = failedIds.length;

  useEffect(() => {
    const allowed = new Set(failedIds);
    const frame = requestAnimationFrame(() => {
      setSelectedIds((prev) => {
        const next = new Set([...prev].filter((id) => allowed.has(id)));
        if (next.size === prev.size && [...next].every((id) => prev.has(id))) return prev;
        return next;
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [failedIds]);

  const allFailedSelected = failedCount > 0 && selectedIds.size === failedCount;

  const handleSelectAllChange = useCallback(
    (checked: boolean) => {
      setSelectedIds(checked ? new Set(failedIds) : new Set());
    },
    [failedIds]
  );

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const retrySelected = useCallback(() => {
    if (selectedIds.size === 0) return;
    onRetryClick([...selectedIds]);
  }, [onRetryClick, selectedIds]);

  return {
    selectedIds,
    failedCount,
    showSelectColumn: failedCount > 0,
    allFailedSelected,
    selectedCount: selectedIds.size,
    handleSelectAllChange,
    handleToggleSelect,
    retrySelected,
  };
}
