import React from 'react';

type FailedPaymentsToolbarProps = {
  failedCount: number;
  allFailedSelected: boolean;
  selectedCount: number;
  onSelectAllChange: (checked: boolean) => void;
  onRetrySelected: () => void;
};

export function FailedPaymentsToolbar({
  failedCount,
  allFailedSelected,
  selectedCount,
  onSelectAllChange,
  onRetrySelected,
}: FailedPaymentsToolbarProps) {
  if (failedCount === 0) return null;

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50 via-orange-50/40 to-rose-50/30 p-4 shadow-sm shadow-amber-900/5 ring-1 ring-amber-100/80 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-sm font-bold text-amber-800 shadow-inner shadow-amber-200/50"
          aria-hidden
        >
          !
        </span>
        <div>
          <p className="text-sm font-semibold text-amber-950">Failed payments need attention</p>
          <p className="mt-0.5 text-xs text-amber-900/75">
            {failedCount} transaction{failedCount === 1 ? '' : 's'} can be retried from this page.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
        <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-amber-200/60 bg-white/60 px-3 py-2 shadow-sm backdrop-blur-sm transition hover:bg-white/90">
          <input
            type="checkbox"
            checked={allFailedSelected}
            onChange={(e) => onSelectAllChange(e.target.checked)}
            className="h-4 w-4 cursor-pointer rounded border-amber-300 text-amber-600 focus:ring-2 focus:ring-amber-400/40"
            aria-label="Select all failed transactions"
          />
          <span className="text-sm font-medium text-amber-950">Select all failed</span>
        </label>
        <button
          type="button"
          onClick={onRetrySelected}
          disabled={selectedCount === 0}
          className="inline-flex min-h-[2.5rem] items-center justify-center rounded-xl bg-gradient-to-b from-indigo-600 to-indigo-700 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 ring-1 ring-indigo-500/30 transition hover:from-indigo-500 hover:to-indigo-600 hover:shadow-lg disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none disabled:ring-0"
        >
          Retry selected
          <span className="ml-1.5 rounded-md bg-white/15 px-1.5 py-0.5 text-xs font-bold tabular-nums">
            {selectedCount}
          </span>
        </button>
      </div>
    </div>
  );
}
