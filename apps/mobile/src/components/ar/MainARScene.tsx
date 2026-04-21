import React, { useMemo } from 'react';
import { useLocationStore } from '../../store/useLocationStore';
import { useOrientationStore } from '../../store/useOrientationStore';
import { getCategoryMetadata } from '../../utils/poiUtils';

// Haversine distance formula in meters
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3;
  const p1 = lat1 * Math.PI / 180;
  const p2 = lat2 * Math.PI / 180;
  const dp = (lat2 - lat1) * Math.PI / 180;
  const dl = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(dp / 2) * Math.sin(dp / 2) +
            Math.cos(p1) * Math.cos(p2) *
            Math.sin(dl / 2) * Math.sin(dl / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// Bearing from origin to destination in degrees
const getBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const p1 = lat1 * Math.PI / 180;
  const p2 = lat2 * Math.PI / 180;
  const l1 = lon1 * Math.PI / 180;
  const l2 = lon2 * Math.PI / 180;

  const y = Math.sin(l2 - l1) * Math.cos(p2);
  const x = Math.cos(p1) * Math.sin(p2) -
            Math.sin(p1) * Math.cos(p2) * Math.cos(l2 - l1);
  const theta = Math.atan2(y, x);
  return (theta * 180 / Math.PI + 360) % 360;
};

interface ARPinProps {
  color: string;
  name: string;
  distance: number;
}

const ARPin: React.FC<ARPinProps> = ({ color, name, distance }) => {
  return (
    <group>
      {/* Subtle Anchor Dot */}
      <mesh>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Outer Glow */}
      <mesh>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <sphereGeometry args={[0.15, 16, 16]} />
        {/* eslint-disable-next-line react/no-unknown-property */}
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

interface MainARSceneProps {
  pois?: any[];
}

export const MainARScene: React.FC<MainARSceneProps> = ({ pois = [] }) => {
  const userCoords = useLocationStore((s) => s.coords);
  const heading = useOrientationStore((s) => s.heading);
  const isLandscape = useOrientationStore((s) => s.isLandscape);

  const poiNodes = useMemo(() => {
    if (!userCoords || pois.length === 0) return [];

    const [userLon, userLat] = userCoords;
    const MAX_DISTANCE = 1000; 

    return pois.map((poi, idx) => {
      const [poiLon, poiLat] = poi.geometry.coordinates;
      const distance = getDistance(userLat, userLon, poiLat, poiLon);
      
      if (distance > MAX_DISTANCE) return null;

      const bearing = getBearing(userLat, userLon, poiLat, poiLon);
      const angleDiff = bearing - heading;
      const rad = angleDiff * (Math.PI / 180);
      
      const scaledDistance = Math.min(Math.max(distance / 5, 2), 20); 

      let x = 0;
      let y = (idx % 3) * 0.5 - 0.5; 
      let z = 0;

      if (isLandscape) {
        x = 0; 
        y = Math.sin(rad) * scaledDistance; 
        z = -Math.cos(rad) * scaledDistance;
      } else {
        x = Math.sin(rad) * scaledDistance;
        y = (idx % 3) * 0.5 - 0.5;
        z = -Math.cos(rad) * scaledDistance;
      }

      const metadata = getCategoryMetadata(poi.properties.category);

      return (
        /* eslint-disable-next-line react/no-unknown-property */
        <group key={poi.properties.id || idx} position={[x, y, z]}>
          <ARPin 
            color={metadata.color} 
            name={poi.properties.name} 
            distance={distance}
          />
        </group>
      );
    }).filter(Boolean);
  }, [userCoords, heading, pois, isLandscape]);

  return (
    <group>
      {poiNodes}
    </group>
  );
};
