import { cn } from '../../app/lib/utils';

describe('Utils', () => {
  describe('cn function', () => {
    it('merges class names correctly', () => {
      const result = cn('base-class', 'additional-class');
      expect(result).toContain('base-class');
      expect(result).toContain('additional-class');
    });

    it('handles conditional classes', () => {
      const isActive = true;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toContain('base-class');
      expect(result).toContain('active-class');
    });

    it('filters out falsy values', () => {
      const result = cn('base-class', false && 'hidden-class', null, undefined);
      expect(result).toContain('base-class');
      expect(result).not.toContain('hidden-class');
    });
  });
});