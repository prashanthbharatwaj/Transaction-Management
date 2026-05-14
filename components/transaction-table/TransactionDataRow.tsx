import React from 'react';
import type { Transaction, TransactionStatus } from '@/types';
import { formatUsd } from '@/utils/format-currency';
import { statusPillClass } from '@/utils/transaction-status-styles';
import { InlineSpinner } from './InlineSpinner';
import { tdClass } from './tableStyles';

type TransactionDataRowProps = {
  transaction: Transaction;
  effectiveStatus: TransactionStatus;
  showSelectColumn: boolean;
  isSelected: boolean;
  isRetrying: boolean;
  isDownloading: boolean;
  onToggleSelect: (id: string) => void;
  onDownloadInvoice: (id: string) => void;
  zebra: boolean;
};

export function TransactionDataRow({
  transaction,
  effectiveStatus,
  showSelectColumn,
  isSelected,
  isRetrying,
  isDownloading,
  onToggleSelect,
  onDownloadInvoice,
  zebra,
}: TransactionDataRowProps) {
  const { id, amount, date, description } = transaction;
  const isFailed = effectiveStatus === 'Failed';

  const rowTint = zebra ? 'bg-slate-50/70' : 'bg-white';

  return (
    <tr
      className={`${rowTint} transition-colors hover:bg-indigo-50/40 group`}
    >
      {showSelectColumn ? (
        <td className={tdClass}>
          {isRetrying ? (
            <div className="flex justify-center py-0.5">
              <InlineSpinner size="sm" />
            </div>
          ) : isFailed ? (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(id)}
              className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500/30"
              aria-label={`Select failed transaction ${id}`}
            />
          ) : null}
        </td>
      ) : null}
      <td className={tdClass}>
        <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-medium tracking-tight text-slate-700 ring-1 ring-slate-200/80">
          {id}
        </span>
      </td>
      <td className={`${tdClass} tabular-nums text-base font-semibold text-slate-900`}>{formatUsd(amount)}</td>
      <td className={`${tdClass} text-slate-600`}>
        <time className="text-sm">{date}</time>
      </td>
      <td className={tdClass}>
        <span className={statusPillClass(effectiveStatus)}>{effectiveStatus}</span>
      </td>
      <td className={`${tdClass} max-w-[min(280px,32vw)] text-slate-600`}>
        <span className="line-clamp-2 text-sm leading-relaxed">{description}</span>
      </td>
      <td className={tdClass}>
        <button
          type="button"
          onClick={() => onDownloadInvoice(id)}
          disabled={isDownloading}
          className="inline-flex items-center justify-center rounded-lg bg-gradient-to-b from-emerald-500 to-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-emerald-600/25 ring-1 ring-emerald-600/20 transition hover:from-emerald-400 hover:to-emerald-500 hover:shadow-md disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none disabled:ring-0"
          aria-label={`Download invoice for ${id}`}
        >
          {isDownloading ? 'Downloading…' : 'Download'}
        </button>
      </td>
    </tr>
  );
}
