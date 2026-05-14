import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Transaction } from '@/types';
import { TransactionsTable } from '@/components/transaction-table/TransactionsTable';

const t1: Transaction = {
  id: 'A',
  amount: 1,
  date: '2026-01-01',
  status: 'Completed',
  description: 'One',
};
const t2: Transaction = {
  id: 'B',
  amount: 2,
  date: '2026-01-02',
  status: 'Failed',
  description: 'Two',
};

describe('TransactionsTable', () => {
  it('omits select column when showSelectColumn is false', () => {
    render(
      <TransactionsTable
        transactions={[t1, t2]}
        showSelectColumn={false}
        statusUpdates={{}}
        selectedIds={new Set()}
        retryingStates={{}}
        downloadingIds={new Set()}
        onToggleSelect={vi.fn()}
        onDownloadInvoice={vi.fn()}
      />
    );

    expect(screen.queryByRole('columnheader', { name: /select/i })).not.toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /transaction id/i })).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('shows select column and applies statusUpdates for effective status', () => {
    render(
      <TransactionsTable
        transactions={[t1]}
        showSelectColumn
        statusUpdates={{ A: 'Failed' }}
        selectedIds={new Set(['A'])}
        retryingStates={{}}
        downloadingIds={new Set()}
        onToggleSelect={vi.fn()}
        onDownloadInvoice={vi.fn()}
      />
    );

    expect(screen.getByRole('columnheader', { name: /select/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /select failed transaction a/i })).toBeChecked();
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });
});
