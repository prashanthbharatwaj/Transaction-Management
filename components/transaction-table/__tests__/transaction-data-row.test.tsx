import type { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Transaction } from '@/types';
import { TransactionDataRow } from '@/components/transaction-table/TransactionDataRow';

const row: Transaction = {
  id: 'TXN-99',
  amount: 42.5,
  date: '2026-02-02 10:00',
  status: 'Completed',
  description: 'Test line',
};

function RowHost(props: ComponentProps<typeof TransactionDataRow>) {
  return (
    <table>
      <tbody>
        <TransactionDataRow {...props} />
      </tbody>
    </table>
  );
}

describe('TransactionDataRow', () => {
  it('renders id, amount, date, description, and status pill', () => {
    render(
      <RowHost
        transaction={row}
        effectiveStatus="Pending"
        showSelectColumn={false}
        isSelected={false}
        isRetrying={false}
        isDownloading={false}
        onToggleSelect={vi.fn()}
        onDownloadInvoice={vi.fn()}
        zebra={false}
      />
    );

    expect(screen.getByText('TXN-99')).toBeInTheDocument();
    expect(screen.getByText(/\$42\.50/)).toBeInTheDocument();
    expect(screen.getByText('2026-02-02 10:00')).toBeInTheDocument();
    expect(screen.getByText('Test line')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('shows checkbox for failed rows when select column is visible', async () => {
    const user = userEvent.setup();
    const onToggleSelect = vi.fn();

    render(
      <RowHost
        transaction={row}
        effectiveStatus="Failed"
        showSelectColumn
        isSelected={false}
        isRetrying={false}
        isDownloading={false}
        onToggleSelect={onToggleSelect}
        onDownloadInvoice={vi.fn()}
        zebra={false}
      />
    );

    await user.click(screen.getByRole('checkbox', { name: /select failed transaction txn-99/i }));
    expect(onToggleSelect).toHaveBeenCalledWith('TXN-99');
  });

  it('shows spinner instead of checkbox while retrying', () => {
    const { container } = render(
      <RowHost
        transaction={row}
        effectiveStatus="Failed"
        showSelectColumn
        isSelected
        isRetrying
        isDownloading={false}
        onToggleSelect={vi.fn()}
        onDownloadInvoice={vi.fn()}
        zebra={false}
      />
    );

    expect(container.querySelector('.animate-spin')).toBeTruthy();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('invokes download and shows downloading label', async () => {
    const user = userEvent.setup();
    const onDownloadInvoice = vi.fn();

    const { rerender } = render(
      <RowHost
        transaction={row}
        effectiveStatus="Completed"
        showSelectColumn={false}
        isSelected={false}
        isRetrying={false}
        isDownloading={false}
        onToggleSelect={vi.fn()}
        onDownloadInvoice={onDownloadInvoice}
        zebra={false}
      />
    );

    await user.click(screen.getByRole('button', { name: /download invoice for txn-99/i }));
    expect(onDownloadInvoice).toHaveBeenCalledWith('TXN-99');

    rerender(
      <RowHost
        transaction={row}
        effectiveStatus="Completed"
        showSelectColumn={false}
        isSelected={false}
        isRetrying={false}
        isDownloading
        onToggleSelect={vi.fn()}
        onDownloadInvoice={onDownloadInvoice}
        zebra={false}
      />
    );

    expect(screen.getByRole('button', { name: /download invoice for txn-99/i })).toHaveTextContent(
      'Downloading…'
    );
  });
});
