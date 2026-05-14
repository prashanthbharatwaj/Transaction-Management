import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TableLoadingState } from '@/components/transaction-table/TableLoadingState';

describe('TableLoadingState', () => {
  it('exposes a polite status region with loading copy', () => {
    render(<TableLoadingState />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveTextContent(/loading transactions/i);
    expect(screen.getByText(/please wait a moment/i)).toBeInTheDocument();
  });
});
