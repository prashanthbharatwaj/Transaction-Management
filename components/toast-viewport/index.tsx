'use client';

import React from 'react';
import type { ToastItem } from '@/hooks/useTimedToasts';
import { toastCardClass, toastStatusBadgeClass } from '@/utils/transaction-status-styles';

type ToastViewportProps = {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
};


export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return (
    <div
      className="pointer-events-none fixed right-0 top-0 z-[100] flex max-h-[100dvh] w-full max-w-sm flex-col gap-2 overflow-y-auto p-3 pt-4 sm:p-4 sm:pt-5"
      aria-live="polite"
      aria-relevant="additions text"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`pointer-events-auto flex flex-col gap-2 rounded-2xl border-l-4 py-3.5 pl-4 pr-3 ${toastCardClass(t.status)}`}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold leading-snug tracking-tight">{t.message}</p>
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              className="-mr-1 -mt-1 shrink-0 rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="Dismiss notification"
            >
              <span aria-hidden className="text-lg leading-none">
                ×
              </span>
            </button>
          </div>
          <span className={`inline-flex w-fit ${toastStatusBadgeClass(t.status)}`}>
            {t.status}
          </span>
        </div>
      ))}
    </div>
  );
}
