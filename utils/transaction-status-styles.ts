import type { TransactionStatus } from '@/types';

export function statusTextClass(status: TransactionStatus): string {
  switch (status) {
    case 'Completed':
      return 'text-emerald-700';
    case 'Failed':
      return 'text-red-700';
    case 'Pending':
      return 'text-amber-700';
    default:
      return 'text-slate-600';
  }
}

export function statusPillClass(status: TransactionStatus): string {
  const base =
    'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset';
  switch (status) {
    case 'Completed':
      return `${base} bg-emerald-50 text-emerald-800 ring-emerald-600/15`;
    case 'Failed':
      return `${base} bg-red-50 text-red-800 ring-red-600/15`;
    case 'Pending':
      return `${base} bg-amber-50 text-amber-900 ring-amber-600/20`;
    default:
      return `${base} bg-slate-100 text-slate-700 ring-slate-500/15`;
  }
}

export function toastCardClass(status: TransactionStatus): string {
  switch (status) {
    case 'Completed':
      return 'border-l-green-500 bg-white/95 text-green-950 shadow-xl shadow-green-900/8 ring-1 ring-green-200/70 backdrop-blur-md';
    case 'Failed':
      return 'border-l-red-500 bg-white/95 text-red-950 shadow-xl shadow-red-900/8 ring-1 ring-red-200/70 backdrop-blur-md';
    case 'Pending':
      return 'border-l-amber-500 bg-white/95 text-amber-950 shadow-xl shadow-amber-900/8 ring-1 ring-amber-200/70 backdrop-blur-md';
    default:
      return 'border-l-slate-400 bg-white/95 text-slate-900 shadow-xl ring-1 ring-slate-200/80 backdrop-blur-md';
  }
}

export function statusSummaryTileClass(status: TransactionStatus): string {
  const base =
    'flex flex-col gap-1 rounded-2xl border p-5 shadow-sm ring-1 transition-shadow hover:shadow-md sm:p-6';
  switch (status) {
    case 'Completed':
      return `${base} border-emerald-200/90 bg-gradient-to-br from-emerald-50 via-teal-50/80 to-emerald-100/40 ring-emerald-600/12`;
    case 'Failed':
      return `${base} border-rose-200/90 bg-gradient-to-br from-rose-50 via-red-50/70 to-rose-100/35 ring-rose-600/12`;
    case 'Pending':
      return `${base} border-amber-200/90 bg-gradient-to-br from-amber-50 via-orange-50/60 to-amber-100/40 ring-amber-600/15`;
    default:
      return `${base} border-slate-200 bg-slate-50 ring-slate-500/10`;
  }
}

export function statusSummaryTileLabelClass(status: TransactionStatus): string {
  switch (status) {
    case 'Completed':
      return 'text-xs font-semibold uppercase tracking-wide text-emerald-800/85';
    case 'Failed':
      return 'text-xs font-semibold uppercase tracking-wide text-rose-800/90';
    case 'Pending':
      return 'text-xs font-semibold uppercase tracking-wide text-amber-900/80';
    default:
      return 'text-xs font-semibold uppercase tracking-wide text-slate-600';
  }
}

export function statusSummaryTileValueClass(status: TransactionStatus): string {
  switch (status) {
    case 'Completed':
      return 'text-3xl font-bold tabular-nums tracking-tight text-emerald-950 sm:text-4xl';
    case 'Failed':
      return 'text-3xl font-bold tabular-nums tracking-tight text-rose-950 sm:text-4xl';
    case 'Pending':
      return 'text-3xl font-bold tabular-nums tracking-tight text-amber-950 sm:text-4xl';
    default:
      return 'text-3xl font-bold tabular-nums text-slate-900 sm:text-4xl';
  }
}

export function toastStatusBadgeClass(status: TransactionStatus): string {
  switch (status) {
    case 'Completed':
      return 'rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 ring-1 ring-green-600/10';
    case 'Failed':
      return 'rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 ring-1 ring-red-600/10';
    case 'Pending':
      return 'rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900 ring-1 ring-amber-600/10';
    default:
      return 'rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800 ring-1 ring-slate-500/10';
  }
}
