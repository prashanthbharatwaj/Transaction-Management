import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { PaginatedResponse } from '@/types';
import * as transactionApi from '@/lib/transaction';
import { TransactionDashboard } from '@/components/transaction-dashboard';

describe('TransactionDashboard', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows per-retry toast notifications with status styling after retry completes', async () => {
    const user = userEvent.setup();

    const page: PaginatedResponse = {
      transactions: [
        {
          id: 'TXN-003',
          amount: 12.99,
          date: '2026-03-15 09:45',
          status: 'Failed',
          description: 'Monthly Subscription - March 2026',
        },
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
      summary: { completed: 0, failed: 1, pending: 0 },
    };

    vi.spyOn(transactionApi, 'fetchTransactions').mockResolvedValue(page);
    vi.spyOn(transactionApi, 'retryPayment').mockResolvedValue(true);

    render(<TransactionDashboard />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /transaction history/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('checkbox', { name: /select all failed/i }));
    await user.click(screen.getByRole('button', { name: /retry selected/i }));

    await waitFor(() => {
      expect(screen.getByText(/payment retry for txn-003/i)).toBeInTheDocument();
    });

    const toast = screen.getByText(/payment retry for txn-003/i).closest('[role="status"]');
    expect(toast).toBeTruthy();
    expect(toast).toHaveClass('border-l-green-500');
    expect(within(toast as HTMLElement).getByText('Completed')).toBeInTheDocument();

    await user.click(within(toast as HTMLElement).getByRole('button', { name: /dismiss notification/i }));

    await waitFor(() => {
      expect(screen.queryByText(/payment retry for txn-003/i)).not.toBeInTheDocument();
    });
  });
});
