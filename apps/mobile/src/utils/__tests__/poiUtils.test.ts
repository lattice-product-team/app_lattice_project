import { getCategoryMetadata, getEventMetadata, getCategoryLabel, getStableColor } from '../poiUtils';
import { MapPin, User, Utensils, SquarePlus } from 'lucide-react-native';

describe('poiUtils', () => {
  describe('getCategoryMetadata', () => {
    it('should return correct metadata for known categories', () => {
      expect(getCategoryMetadata('restaurant').icon).toBe(Utensils);
      expect(getCategoryMetadata('wc').icon).toBe(User);
      expect(getCategoryMetadata('medical').icon).toBe(SquarePlus);
    });

    it('should return default metadata for unknown categories', () => {
      expect(getCategoryMetadata('unknown').icon).toBe(MapPin);
    });

    it('should return default metadata when category is undefined', () => {
      expect(getCategoryMetadata(undefined).icon).toBe(MapPin);
    });
  });

  describe('getCategoryLabel', () => {
    it('should return correct label for categories', () => {
      expect(getCategoryLabel('restaurant')).toBe('Dining');
      expect(getCategoryLabel('wc')).toBe('Restrooms');
      expect(getCategoryLabel('medical')).toBe('Medical Services');
      expect(getCategoryLabel('unknown')).toBe('Point of Interest');
    });
  });

  describe('getStableColor', () => {
    it('should generate a consistent hex color from string ID', () => {
      const color1 = getStableColor('event-1');
      const color2 = getStableColor('event-1');
      const color3 = getStableColor('event-2');

      expect(color1).toBe(color2);
      expect(color1).toMatch(/^#[0-9A-F]{6}$/i);
      expect(color3).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });
});
