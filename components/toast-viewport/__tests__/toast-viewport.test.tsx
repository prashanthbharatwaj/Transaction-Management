import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { ToastItem } from '@/hooks/useTimedToasts';
import { ToastViewport } from '@/components/toast-viewport';

function makeToast(overrides: Partial<ToastItem> & Pick<ToastItem, 'id' | 'message' | 'status'>): ToastItem {
  return {
    id: overrides.id,
    message: overrides.message,
    status: overrides.status,
  };
}

describe('ToastViewport', () => {
  it('renders a fixed top-right region for the toast stack', () => {
    const { container } = render(<ToastViewport toasts={[]} onDismiss={vi.fn()} />);
    const region = container.firstElementChild;
    expect(region).toHaveClass('fixed', 'right-0', 'top-0', 'z-[100]');
    expect(region).toHaveAttribute('aria-live', 'polite');
  });

  it('renders each toast message, status badge, and status-based accent classes', () => {
    const toasts: ToastItem[] = [
      makeToast({ id: 'a', message: 'Payment retry for TXN-1', status: 'Completed' }),
      makeToast({ id: 'b', message: 'Payment retry for TXN-2', status: 'Failed' }),
      makeToast({ id: 'c', message: 'Payment retry for TXN-3', status: 'Pending' }),
    ];

    const { container } = render(<ToastViewport toasts={toasts} onDismiss={vi.fn()} />);

    expect(screen.getByText('Payment retry for TXN-1')).toBeInTheDocument();
    expect(screen.getByText('Payment retry for TXN-2')).toBeInTheDocument();
    expect(screen.getByText('Payment retry for TXN-3')).toBeInTheDocument();

    const statuses = screen.getAllByText(/^(Completed|Failed|Pending)$/);
    expect(statuses).toHaveLength(3);

    const cards = container.querySelectorAll('[role="status"]');
    expect(cards[0]).toHaveClass('border-l-green-500');
    expect(cards[1]).toHaveClass('border-l-red-500');
    expect(cards[2]).toHaveClass('border-l-amber-500');
  });

  it('calls onDismiss when the close control is activated', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const toasts: ToastItem[] = [makeToast({ id: 'toast-1', message: 'Hi', status: 'Completed' })];

    render(<ToastViewport toasts={toasts} onDismiss={onDismiss} />);

    const toast = screen.getByText('Hi').closest('[role="status"]');
    expect(toast).toBeTruthy();
    await user.click(within(toast as HTMLElement).getByRole('button', { name: /dismiss notification/i }));

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledWith('toast-1');
  });
});
