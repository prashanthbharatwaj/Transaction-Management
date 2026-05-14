import React from 'react';
import { InlineSpinner } from './InlineSpinner';

export function TableLoadingState() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-slate-200 bg-gradient-to-b from-slate-50/80 to-white py-16 shadow-inner"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-indigo-400/15" aria-hidden />
        <span className="absolute inset-2 rounded-full bg-indigo-50" aria-hidden />
        <InlineSpinner size="md" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-800">Loading transactions</p>
        <p className="mt-1 text-xs text-slate-500">Please wait a moment…</p>
      </div>
    </div>
  );
}
