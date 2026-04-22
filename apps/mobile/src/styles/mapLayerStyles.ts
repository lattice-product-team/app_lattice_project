import { LineLayerStyle, CircleLayerStyle, SymbolLayerStyle } from '@maplibre/maplibre-react-native';

export const mapLayerStyles = {
  networkLines: {
    lineColor: '#606060',
    lineWidth: 3,
  } as LineLayerStyle,

  routeFill: {
    lineColor: '#FFFFFF',
    lineWidth: 6,
    lineJoin: 'round',
    lineCap: 'round',
  } as LineLayerStyle,

  routeGlow: {
    lineColor: '#FFFFFF',
    lineWidth: 12,
    lineJoin: 'round',
    lineCap: 'round',
    lineBlur: 6,
  } as LineLayerStyle,

  // Composite Pin Layers (Selection)
  selectedPoiPinBody: {
    circleRadius: 18,
    circleColor: '#E10600',
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
    circleTranslate: [0, -18], // Move up so tip is at coordinate
  } as CircleLayerStyle,

  selectedPoiPinTip: {
    textField: '▼', // Using a triangle character for the tip
    textSize: 24,
    textColor: '#E10600',
    textHaloColor: 'white',
    textHaloWidth: 1,
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
      'restaurant', '#FFD085',
      'food', '#FFD085',
      'parking', '#B4C5CD',
      'shop', '#C197D6',
      'shopping', '#C197D6',
      'wc', '#A2C2E1',
      'toilet', '#A2C2E1',
      'restroom', '#A2C2E1',
      'grandstand', '#A8D5BA',
      'medical', '#B39DDB',
      'hospital', '#B39DDB',
      'gate', '#9FA8DA',
      'entrance', '#9FA8DA',
      'meetup_point', '#C5E1A5',
      'info', '#80CBC4',
      '#D1D1D6' // Default
    ],
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
    circleOpacity: 0.85,
    circlePitchAlignment: 'map',
  } as CircleLayerStyle,

  savedPoiCircles: {
    circleRadius: 16,
    circleColor: '#30D158',
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
    circleOpacity: 0.9,
  } as CircleLayerStyle,

  poiIcons: {
    iconImage: 'marker', // Requires an image 'marker' to be loaded or just use text
    iconSize: 0.6,
    iconAllowOverlap: true,
  } as SymbolLayerStyle,

  poiLabels: {
    textField: ['get', 'name'],
    textSize: 11,
    textColor: 'white',
    textOffset: [0, 2.5],
    textHaloColor: 'rgba(0,0,0,0.8)',
    textHaloWidth: 2,
    textFont: ['Inter Bold'], // Cambiado a formato estándar de servidor de glifos
    textIgnorePlacement: false,
    textAllowOverlap: false,
    textOptional: true,
  } as SymbolLayerStyle,

  // Clustering Styles
  clusterCircles: {
    circleColor: '#E10600',
    circleRadius: [
      'step',
      ['get', 'point_count'],
      20, // Default size for small clusters
      10, 25, // If 10+ points, radius 25
      50, 30, // If 50+ points, radius 30
    ],
    circleStrokeWidth: 3,
    circleStrokeColor: 'rgba(255, 255, 255, 0.4)',
    circleOpacity: 0.9,
  } as CircleLayerStyle,

  clusterLabels: {
    textField: ['get', 'point_count_abbreviated'],
    textSize: 12,
    textColor: 'white',
    textIgnorePlacement: true,
    textAllowOverlap: true,
    textFont: ['Inter Bold'], // Cambiado a formato estándar de servidor de glifos
  } as SymbolLayerStyle,
};
