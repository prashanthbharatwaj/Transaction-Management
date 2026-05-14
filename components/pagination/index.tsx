'use client';

import React from 'react';
import { getPaginationItemRange, getPaginationSlots } from '@/utils/pagination';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  isLoading?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  isLoading = false,
}: PaginationProps) {
  const { startItem, endItem } = getPaginationItemRange(currentPage, itemsPerPage, totalItems);

  return (
    <div className="mt-8 flex flex-col items-center gap-5 border-t border-slate-100 pt-6">
      <p className="text-sm text-slate-600">
        Showing{' '}
        <span className="font-semibold tabular-nums text-slate-900">{startItem}</span>
        {' – '}
        <span className="font-semibold tabular-nums text-slate-900">{endItem}</span>
        <span className="text-slate-400"> of </span>
        <span className="font-semibold tabular-nums text-slate-900">{totalItems}</span>
        <span className="text-slate-500"> transactions</span>
      </p>

      <nav
        className="flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-slate-200/80 bg-slate-50/90 p-1.5 shadow-inner"
        aria-label="Pagination"
      >
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="min-h-9 min-w-[2.25rem] rounded-xl px-3 text-sm font-medium text-slate-700 transition hover:bg-white hover:shadow-sm disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent disabled:hover:shadow-none"
        >
          Prev
        </button>

        <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" aria-hidden />

        {getPaginationSlots(currentPage, totalPages).map((page, index) => (
          <button
            key={index}
            type="button"
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...' || isLoading}
            className={`min-h-9 min-w-9 rounded-xl text-sm font-semibold transition ${
              page === currentPage
                ? 'bg-gradient-to-b from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/20 ring-1 ring-indigo-500/30'
                : page === '...'
                  ? 'cursor-default text-slate-400'
                  : 'text-slate-700 hover:bg-white hover:shadow-sm'
            } ${isLoading && page !== '...' ? 'opacity-50' : ''}`}
          >
            {page}
          </button>
        ))}

        <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" aria-hidden />

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="min-h-9 min-w-[2.25rem] rounded-xl px-3 text-sm font-medium text-slate-700 transition hover:bg-white hover:shadow-sm disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent disabled:hover:shadow-none"
        >
          Next
        </button>
      </nav>
    </div>
  );
}
