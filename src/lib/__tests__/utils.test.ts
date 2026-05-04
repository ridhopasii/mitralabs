import { describe, it, expect } from 'vitest';
import { cn, formatDate } from '../utils';

describe('Utility Functions', () => {
  it('cn should merge class names correctly', () => {
    expect(cn('a', 'b', false && 'c', 'd')).toBe('a b d');
    expect(cn('bg-red-500', null, 'p-4')).toBe('bg-red-500 p-4');
  });

  it('formatDate should format date strings correctly', () => {
    const date = '2024-03-12';
    expect(formatDate(date)).toContain('Maret');
    expect(formatDate(date)).toContain('2024');
  });
});
