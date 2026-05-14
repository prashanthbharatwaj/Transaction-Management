export function getPaginationSlots(
  currentPage: number,
  totalPages: number,
  maxPagesToShow = 7
): (number | string)[] {
  const pages: (number | string)[] = [];

  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  pages.push(1);

  if (currentPage > 4) {
    pages.push('...');
  }

  const startPage = Math.max(2, currentPage - 2);
  const endPage = Math.min(totalPages - 1, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 3) {
    pages.push('...');
  }

  pages.push(totalPages);
  return pages;
}

export function getPaginationItemRange(
  currentPage: number,
  itemsPerPage: number,
  totalItems: number
): { startItem: number; endItem: number } {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  return { startItem, endItem };
}
