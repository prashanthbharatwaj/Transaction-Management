import { describe, expect, it } from 'vitest';
import { getErrorMessage } from '@/utils/error-message';

describe('getErrorMessage', () => {
  it('uses Error.message when present', () => {
    expect(getErrorMessage(new Error('timeout'), 'fallback')).toBe('timeout');
  });

  it('uses non-empty string errors', () => {
    expect(getErrorMessage('  bad request  ', 'fallback')).toBe('bad request');
  });

  it('returns fallback for unknown shapes', () => {
    expect(getErrorMessage(null, 'fallback')).toBe('fallback');
    expect(getErrorMessage(new Error('   '), 'fallback')).toBe('fallback');
  });
});
