import { describe, expect, it } from 'vitest';
import { formatUsd } from '@/utils/format-currency';

describe('formatUsd', () => {
  it('formats amount with dollar sign and two decimals', () => {
    expect(formatUsd(12.99)).toBe('$12.99');
    expect(formatUsd(0)).toBe('$0.00');
    expect(formatUsd(1000)).toBe('$1000.00');
  });
});
