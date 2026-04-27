import React from 'react';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { RouteGeoJSON } from '../../types';
import { useLatticeTheme } from '../../hooks/useLatticeTheme';

interface MapRouteProps {
  route: RouteGeoJSON | null;
}

export const MapRoute = React.memo(function MapRoute({ route }: MapRouteProps) {
  const theme = useLatticeTheme();
  if (!route) return null;

  return (
    <MapLibreGL.ShapeSource id="routeSource" shape={route}>
      <MapLibreGL.LineLayer
        id="routeFill"
        style={{
          lineColor: theme.colors.brand.primary,
          lineWidth: 5,
          lineJoin: 'round',
          lineCap: 'round',
          lineOpacity: 0.8,
        }}
      />
      <MapLibreGL.LineLayer
        id="routeGlow"
        style={{
          lineColor: theme.colors.brand.primary,
          lineWidth: 10,
          lineJoin: 'round',
          lineCap: 'round',
          lineOpacity: 0.2,
          lineBlur: 5,
        }}
      />
    </MapLibreGL.ShapeSource>
  );
});

MapRoute.displayName = 'MapRoute';
