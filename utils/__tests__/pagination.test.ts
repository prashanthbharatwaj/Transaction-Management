import { describe, expect, it } from 'vitest';
import { getPaginationItemRange, getPaginationSlots } from '@/utils/pagination';

describe('getPaginationSlots', () => {
  it('returns all pages when total is small', () => {
    expect(getPaginationSlots(1, 5, 7)).toEqual([1, 2, 3, 4, 5]);
  });

  it('includes ellipses and first/last when many pages', () => {
    const slots = getPaginationSlots(5, 20, 7);
    expect(slots[0]).toBe(1);
    expect(slots[slots.length - 1]).toBe(20);
    expect(slots).toContain('...');
  });
});

describe('getPaginationItemRange', () => {
  it('returns inclusive 1-based range for first page', () => {
    expect(getPaginationItemRange(1, 10, 25)).toEqual({ startItem: 1, endItem: 10 });
  });

  it('caps end at totalItems on last page', () => {
    expect(getPaginationItemRange(3, 10, 25)).toEqual({ startItem: 21, endItem: 25 });
  });
});
