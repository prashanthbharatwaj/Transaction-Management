import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InlineSpinner } from '@/components/transaction-table/InlineSpinner';

describe('InlineSpinner', () => {
  it('renders md size by default with spin animation class', () => {
    const { container } = render(<InlineSpinner />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass('h-8', 'w-8', 'animate-spin');
  });

  it('renders sm size when requested', () => {
    const { container } = render(<InlineSpinner size="sm" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass('h-4', 'w-4');
  });
});
