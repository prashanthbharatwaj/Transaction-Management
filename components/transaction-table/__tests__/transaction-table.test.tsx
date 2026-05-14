import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Transaction } from '@/types';
import * as transactionApi from '@/lib/transaction';
import { TransactionTable } from '@/components/transaction-table';

const failed: Transaction = {
  id: 'F-1',
  amount: 9,
  date: '2026-03-01',
  status: 'Failed',
  description: 'Failed row',
};

const ok: Transaction = {
  id: 'C-1',
  amount: 5,
  date: '2026-03-02',
  status: 'Completed',
  description: 'Ok row',
};

describe('TransactionTable', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading placeholder when isLoading is true', () => {
    render(
      <TransactionTable
        transactions={[failed]}
        onRetryClick={vi.fn()}
        retryingStates={{}}
        statusUpdates={{}}
        isLoading
      />
    );

    expect(screen.getByRole('status')).toHaveTextContent(/loading transactions/i);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('renders toolbar for failed rows and calls onRetryClick with selection', async () => {
    const user = userEvent.setup();
    const onRetryClick = vi.fn();
    vi.spyOn(transactionApi, 'downloadInvoice').mockResolvedValue(undefined);

    render(
      <TransactionTable
        transactions={[failed, ok]}
        onRetryClick={onRetryClick}
        retryingStates={{}}
        statusUpdates={{}}
      />
    );

    expect(screen.getByText(/failed payments need attention/i)).toBeInTheDocument();

    await user.click(screen.getByRole('checkbox', { name: /select all failed/i }));
    await user.click(screen.getByRole('button', { name: /retry selected/i }));

    expect(onRetryClick).toHaveBeenCalledWith(['F-1']);
  });

  it('does not show failed toolbar when no failed transactions', () => {
    render(
      <TransactionTable
        transactions={[ok]}
        onRetryClick={vi.fn()}
        retryingStates={{}}
        statusUpdates={{}}
      />
    );

    expect(screen.queryByText(/failed payments need attention/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: /select/i })).not.toBeInTheDocument();
  });
});
