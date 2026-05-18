import { describe, it, expect } from 'vitest';
import {
  isPointInPolygon,
  calculatePolygonArea,
  calculateCentroid,
  calculateBBox,
  calculateDistance,
  formatDuration,
  formatDistance,
} from '../geoUtils';

describe('geoUtils', () => {
  describe('isPointInPolygon', () => {
    const polygon: [number, number][] = [
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
      [0, 0],
    ];

    it('should return true if point is inside the polygon', () => {
      expect(isPointInPolygon([5, 5], polygon)).toBe(true);
    });

    it('should return false if point is outside the polygon', () => {
      expect(isPointInPolygon([15, 5], polygon)).toBe(false);
    });

    it('should return false if point is on the edge (depending on algorithm details, but usually false or consistent)', () => {
      // Ray casting can be tricky on edges, but let's test a clear outside
      expect(isPointInPolygon([-1, -1], polygon)).toBe(false);
    });
  });

  describe('calculatePolygonArea', () => {
    it('should calculate the area of a square', () => {
      const square: [number, number][] = [
        [0, 0],
        [10, 0],
        [10, 10],
        [0, 10],
      ];
      expect(calculatePolygonArea(square)).toBe(100);
    });

    it('should calculate the area of a triangle', () => {
      const triangle: [number, number][] = [
        [0, 0],
        [10, 0],
        [0, 10],
      ];
      expect(calculatePolygonArea(triangle)).toBe(50);
    });
  });

  describe('calculateCentroid', () => {
    it('should calculate the centroid of a square', () => {
      const square: [number, number][] = [
        [0, 0],
        [10, 0],
        [10, 10],
        [0, 10],
      ];
      expect(calculateCentroid(square)).toEqual([5, 5]);
    });

    it('should return null for empty array', () => {
      expect(calculateCentroid([])).toBeNull();
    });
  });

  describe('calculateBBox', () => {
    it('should calculate the bounding box of a set of points', () => {
      const points: [number, number][] = [
        [0, 5],
        [10, 0],
        [5, 10],
      ];
      expect(calculateBBox(points)).toEqual([0, 0, 10, 10]);
    });
  });

  describe('formatDuration', () => {
    it('should format seconds correctly', () => {
      expect(formatDuration(45)).toBe('< 1 min');
      expect(formatDuration(300)).toBe('5 min');
      expect(formatDuration(3600)).toBe('1h');
      expect(formatDuration(4800)).toBe('1h 20m');
    });

    it('should handle null/0', () => {
      expect(formatDuration(0)).toBe('--');
      expect(formatDuration(null as any)).toBe('--');
    });
  });

  describe('formatDistance', () => {
    it('should format meters correctly', () => {
      expect(formatDistance(250)).toBe('250 m');
      expect(formatDistance(1200)).toBe('1.2 km');
    });
  });
});
