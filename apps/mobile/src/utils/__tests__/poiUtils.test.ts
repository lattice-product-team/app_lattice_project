import { getCategoryMetadata, getEventMetadata, getCategoryLabel, getStableColor } from '../poiUtils';
import { Utensils, Coffee, User, MapPin, SquarePlus } from 'lucide-react-native';
import { colors } from '@app/theme';

describe('poiUtils', () => {
  describe('getCategoryMetadata', () => {
    it('should return correct metadata for known categories', () => {
      const restaurantMeta = getCategoryMetadata('restaurant');
      expect(restaurantMeta.icon).toBe(Utensils);
      expect(restaurantMeta.color).toBe(colors.semantic.dark.warning);
      expect(restaurantMeta.label).toBe('Dining');

      const wcMeta = getCategoryMetadata('wc');
      expect(wcMeta.icon).toBe(User);
      expect(wcMeta.color).toBe(colors.semantic.dark.info);
      expect(wcMeta.label).toBe('Restrooms');

      const medicalMeta = getCategoryMetadata('medical');
      expect(medicalMeta.icon).toBe(SquarePlus);
      expect(medicalMeta.color).toBe(colors.semantic.dark.error);
      expect(medicalMeta.label).toBe('Medical Services');
    });

    it('should perform fuzzy keyword matching', () => {
      const entranceMeta = getCategoryMetadata('north_entrance');
      expect(entranceMeta.label).toBe('Access Point');

      const toiletMeta = getCategoryMetadata('vip_toilet');
      expect(toiletMeta.label).toBe('Restrooms');
    });

    it('should return default metadata for unknown or undefined categories', () => {
      const unknownMeta = getCategoryMetadata('unknown_category');
      expect(unknownMeta.icon).toBe(MapPin);
      expect(unknownMeta.color).toBe(colors.brand.primary);

      const undefinedMeta = getCategoryMetadata(undefined);
      expect(undefinedMeta.icon).toBe(MapPin);
      expect(undefinedMeta.color).toBe(colors.brand.primary);
    });
  });

  describe('getEventMetadata', () => {
    it('should return correct event metadata', () => {
      const musicMeta = getEventMetadata('music');
      expect(musicMeta.label).toBe('Music');
      expect(musicMeta.color).toBe(colors.brand.primary);

      const foodMeta = getEventMetadata('food');
      expect(foodMeta.label).toBe('Gastronomy');

      const unknownMeta = getEventMetadata('unknown_type');
      expect(unknownMeta.label).toBe('Event');
      expect(unknownMeta.color).toBe(colors.brand.primary);
    });
  });

  describe('getCategoryLabel', () => {
    it('should return correct label', () => {
      expect(getCategoryLabel('restaurant')).toBe('Dining');
      expect(getCategoryLabel('wc')).toBe('Restrooms');
      expect(getCategoryLabel(undefined)).toBe('Point of Interest');
    });
  });

  describe('getStableColor', () => {
    it('should return a stable hex color string for any given ID', () => {
      const color1 = getStableColor('event-id-123');
      const color2 = getStableColor('event-id-123');
      const color3 = getStableColor('another-different-event-id');

      expect(color1).toMatch(/^#[0-9A-F]{6}$/i);
      expect(color1).toBe(color2); // stable
      expect(color1).not.toBe(color3); // different hash
    });
  });
});
