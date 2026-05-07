import {
  LineLayerStyle,
  CircleLayerStyle,
  SymbolLayerStyle,
} from '@maplibre/maplibre-react-native';
import { colors as primitiveColors } from '@app/theme';
import { semanticColors } from './semanticColors';

export const mapLayerStyles = {
  networkLines: {
    lineColor: '#CBD5E1', // Soft slate for network
    lineWidth: 2,
  } as LineLayerStyle,

  routeFill: {
    lineColor: primitiveColors.brand.primary, // Solar Gold
    lineWidth: 6,
    lineJoin: 'round',
    lineCap: 'round',
  } as LineLayerStyle,

  routeGlow: {
    lineColor: primitiveColors.brand.primary,
    lineWidth: 12,
    lineJoin: 'round',
    lineCap: 'round',
    lineBlur: 6,
    lineOpacity: 0.3,
  } as LineLayerStyle,

  // Composite Pin Layers (Selection)
  selectedPoiPinBody: {
    circleRadius: 18,
    circleColor: primitiveColors.brand.primary, // Solar Gold
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
    circleTranslate: [0, -18],
  } as CircleLayerStyle,

  selectedPoiPinTip: {
    textField: '▼',
    textSize: 24,
    textColor: primitiveColors.brand.primary,
    textHaloColor: 'white',
    textHaloWidth: 2,
    textOffset: [0, 0.4],
    textIgnorePlacement: true,
    textAllowOverlap: true,
    textPitchAlignment: 'map',
  } as SymbolLayerStyle,

  // Bulk POI Layers
  poiCircles: {
    circleRadius: 16,
    circleColor: [
      'match',
      ['downcase', ['get', 'category']],
      'music',
      semanticColors.categories.music,
      'stage',
      semanticColors.categories.music,
      'concert',
      semanticColors.categories.music,
      'food',
      semanticColors.categories.food,
      'restaurant',
      semanticColors.categories.food,
      'drink',
      semanticColors.categories.food,
      'bar',
      semanticColors.categories.food,
      'info',
      semanticColors.categories.services,
      'services',
      semanticColors.categories.services,
      'wc',
      semanticColors.categories.services,
      'toilet',
      semanticColors.categories.services,
      'medical',
      semanticColors.categories.emergency,
      'help',
      semanticColors.categories.emergency,
      'emergency',
      semanticColors.categories.emergency,
      'shop',
      semanticColors.categories.shopping,
      'merch',
      semanticColors.categories.shopping,
      'parking',
      semanticColors.categories.parking,
      'transport',
      semanticColors.categories.transport,
      'shuttle',
      semanticColors.categories.transport,
      '#D1D1D6', // Default gray
    ],
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
    circleOpacity: 0.9,
    circlePitchAlignment: 'map',
  } as CircleLayerStyle,

  savedPoiCircles: {
    circleRadius: 16,
    circleColor: semanticColors.status.success,
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
    circleOpacity: 0.9,
  } as CircleLayerStyle,

  poiIcons: {
    iconImage: ['get', 'icon'], // Dynamic icon from metadata
    iconSize: 0.6,
    iconAllowOverlap: true,
  } as SymbolLayerStyle,

  poiLabels: {
    textField: ['get', 'name'],
    textSize: 12,
    textColor: '#000000', // Dark text for Light Map
    textOffset: [0, 2.5],
    textHaloColor: 'rgba(255, 255, 255, 0.9)', // White halo for clarity
    textHaloWidth: 2,
    textIgnorePlacement: false,
    textAllowOverlap: false,
    textOptional: true,
  } as SymbolLayerStyle,

  // Clustering Styles
  clusterCircles: {
    circleColor: primitiveColors.brand.primary, // Solar Gold for clusters
    circleRadius: ['step', ['get', 'point_count'], 20, 10, 25, 50, 30],
    circleStrokeWidth: 3,
    circleStrokeColor: 'rgba(255, 255, 255, 0.6)',
    circleOpacity: 0.9,
  } as CircleLayerStyle,

  clusterLabels: {
    textField: ['get', 'point_count_abbreviated'],
    textSize: 12,
    textColor: '#000000', // Dark text on light clusters
    textIgnorePlacement: true,
    textAllowOverlap: true,
  } as SymbolLayerStyle,
};
