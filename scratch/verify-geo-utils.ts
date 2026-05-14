import { isPointInPolygon, calculatePolygonArea } from '../apps/mobile/src/utils/geoUtils';

const polygon: [number, number][] = [
  [0, 0],
  [10, 0],
  [10, 10],
  [0, 10],
  [0, 0]
];

const pointInside: [number, number] = [5, 5];
const pointOutside: [number, number] = [15, 5];

console.log('--- Testing isPointInPolygon ---');
console.log(`Point [5,5] inside square [0,0]-[10,10]: ${isPointInPolygon(pointInside, polygon)} (Expected: true)`);
console.log(`Point [15,5] inside square [0,0]-[10,10]: ${isPointInPolygon(pointOutside, polygon)} (Expected: false)`);

console.log('\n--- Testing calculatePolygonArea ---');
console.log(`Area of 10x10 square: ${calculatePolygonArea(polygon)} (Expected: 100)`);

const triangle: [number, number][] = [
  [0, 0],
  [10, 0],
  [0, 10],
  [0, 0]
];
console.log(`Area of triangle [0,0], [10,0], [0,10]: ${calculatePolygonArea(triangle)} (Expected: 50)`);
