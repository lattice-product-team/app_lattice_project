import React, { useMemo } from 'react';
import { useLocationStore } from '../../../../store/useLocationStore';
import { useOrientationStore } from '../../../../store/useOrientationStore';
import { getCategoryMetadata } from '../../../../utils/poiUtils';
import { calculateDistance } from '../../../../utils/geoUtils';

// Bearing from origin to destination in degrees
const getBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const l1 = (lon1 * Math.PI) / 180;
  const l2 = (lon2 * Math.PI) / 180;

  const y = Math.sin(l2 - l1) * Math.cos(p2);
  const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(l2 - l1);
  const theta = Math.atan2(y, x);
  return ((theta * 180) / Math.PI + 360) % 360;
};

interface ARPinProps {
  color: string;
}

const ARPin: React.FC<ARPinProps> = ({ color }) => {
  return (
    <group>
      {/* Subtle Anchor Dot */}
      <mesh>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <sphereGeometry args={[0.06, 24, 24]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Outer Glow */}
      <mesh>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <sphereGeometry args={[0.18, 24, 24]} />
        {/* eslint-disable-next-line react/no-unknown-property */}
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>

      {/* Internal Core */}
      <mesh>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <sphereGeometry args={[0.03, 16, 16]} />
        {/* eslint-disable-next-line react/no-unknown-property */}
        <meshBasicMaterial color={color} />
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

  const poiNodes = useMemo(() => {
    if (!userCoords || pois.length === 0) return [];

    const [userLon, userLat] = userCoords;
    const MAX_DISTANCE = 1000; // 1km limit for 3D visibility

    return pois
      .map((poi, idx) => {
        const coords = poi.geometry?.coordinates;
        if (!coords) return null;

        const [poiLon, poiLat] = coords;
        const distance = calculateDistance(userLat, userLon, poiLat, poiLon);

        if (distance > MAX_DISTANCE) return null;

        const bearing = getBearing(userLat, userLon, poiLat, poiLon);
        const angleDiff = bearing - heading;
        const rad = angleDiff * (Math.PI / 180);

        // Perspective scaling: closer objects look slightly larger and lower
        const scaledDistance = Math.min(Math.max(distance / 5, 3), 25);

        const x = Math.sin(rad) * scaledDistance;
        // Staggered height to avoid direct vertical overlap
        const y = (idx % 3) * 0.4 - 0.4;
        const z = -Math.cos(rad) * scaledDistance;

        const metadata = getCategoryMetadata(poi.properties?.category);

        return (
          /* eslint-disable-next-line react/no-unknown-property */
          <group key={poi.properties?.id || idx} position={[x, y, z]}>
            <ARPin color={metadata.color} />
          </group>
        );
      })
      .filter(Boolean);
  }, [userCoords, heading, pois]);

  return <group>{poiNodes}</group>;
};
