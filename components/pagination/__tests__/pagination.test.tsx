import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Pagination } from '@/components/pagination';

describe('Pagination', () => {
  it('shows range and disables prev on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={() => {}}
        totalItems={25}
        itemsPerPage={10}
        isLoading={false}
      />
    );

    expect(screen.getByText(/showing/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1' })).toHaveClass('from-indigo-600');
    const prev = screen.getByRole('button', { name: /^prev$/i });
    expect(prev).toBeDisabled();
  });
});
