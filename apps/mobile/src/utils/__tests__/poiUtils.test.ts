import { getCategoryIcon, getCategoryColor } from '../poiUtils';

describe('poiUtils', () => {
  describe('getCategoryIcon', () => {
    it('should return correct icon for known categories', () => {
      expect(getCategoryIcon('restaurant')).toBe('coffee');
      expect(getCategoryIcon('wc')).toBe('user');
      expect(getCategoryIcon('medical')).toBe('plus-square');
    });

    it('should return default icon for unknown categories', () => {
      expect(getCategoryIcon('unknown')).toBe('map-pin');
    });

    it('should return default icon when category is undefined', () => {
      expect(getCategoryIcon(undefined)).toBe('map-pin');
    });
  });

  describe('getCategoryColor', () => {
    it('should return correct color for specific categories', () => {
      // colors.semantic.dark.info is #54A6FF
      expect(getCategoryColor('toilet')).toBe('#54A6FF');
      // colors.semantic.dark.error is #E5484D
      expect(getCategoryColor('medical')).toBe('#E5484D');
    });

    it('should return default color for unknown categories', () => {
      // colors.neutral.dark.overlay is #262624
      expect(getCategoryColor('unknown')).toBe('#262624');
    });
  });
});

