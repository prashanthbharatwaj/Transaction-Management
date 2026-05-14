'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { TransactionStatus } from '@/types';

export type ToastItem = {
  id: string;
  message: string;
  status: TransactionStatus;
};


export function useTimedToasts(durationMs = 3000) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismissToast = useCallback((toastId: string) => {
    const existing = timersRef.current.get(toastId);
    if (existing !== undefined) {
      clearTimeout(existing);
      timersRef.current.delete(toastId);
    }
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  }, []);

  const pushToast = useCallback(
    (message: string, status: TransactionStatus) => {
      const id =
        typeof globalThis.crypto !== 'undefined' && 'randomUUID' in globalThis.crypto
          ? globalThis.crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      setToasts((prev) => [{ id, message, status }, ...prev]);

      const timer = setTimeout(() => dismissToast(id), durationMs);
      timersRef.current.set(id, timer);
    },
    [dismissToast, durationMs]
  );

  useEffect(
    () => () => {
      for (const t of timersRef.current.values()) clearTimeout(t);
      timersRef.current.clear();
    },
    []
  );

  return { toasts, pushToast, dismissToast };
}
