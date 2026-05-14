import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FailedPaymentsToolbar } from '@/components/transaction-table/FailedPaymentsToolbar';

describe('FailedPaymentsToolbar', () => {
  it('renders nothing when failedCount is zero', () => {
    const { container } = render(
      <FailedPaymentsToolbar
        failedCount={0}
        allFailedSelected={false}
        selectedCount={0}
        onSelectAllChange={vi.fn()}
        onRetrySelected={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('shows plural copy and wires select-all and retry', async () => {
    const user = userEvent.setup();
    const onSelectAllChange = vi.fn();
    const onRetrySelected = vi.fn();

    render(
      <FailedPaymentsToolbar
        failedCount={2}
        allFailedSelected={false}
        selectedCount={1}
        onSelectAllChange={onSelectAllChange}
        onRetrySelected={onRetrySelected}
      />
    );

    expect(screen.getByText(/2 transactions can be retried/i)).toBeInTheDocument();

    await user.click(screen.getByRole('checkbox', { name: /select all failed/i }));
    expect(onSelectAllChange).toHaveBeenCalledWith(true);

    await user.click(screen.getByRole('button', { name: /retry selected/i }));
    expect(onRetrySelected).toHaveBeenCalled();
  });

  it('disables retry when nothing is selected', () => {
    render(
      <FailedPaymentsToolbar
        failedCount={1}
        allFailedSelected={false}
        selectedCount={0}
        onSelectAllChange={vi.fn()}
        onRetrySelected={vi.fn()}
      />
    );

    expect(screen.getByText(/1 transaction can be retried/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry selected/i })).toBeDisabled();
  });
});
