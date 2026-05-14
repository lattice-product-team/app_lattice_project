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

const ARBeacon: React.FC<ARPinProps> = ({ color }) => {
  return (
    <group>
      {/* Vertical Pillar / Beacon of light */}
      <mesh position={[0, 2, 0]}>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <cylinderGeometry args={[0.05, 0.2, 4, 32]} />
        {/* eslint-disable-next-line react/no-unknown-property */}
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
      
      {/* Top Floating Orb */}
      <mesh position={[0, 4.2, 0]}>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Ground Anchor Glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <circleGeometry args={[0.8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
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
    const MAX_DISTANCE = 5000; // Increased to 5km for event beacons

    return pois
      .map((poi, idx) => {
        const coords = poi.geometry?.coordinates;
        if (!coords) return null;

        const [poiLon, poiLat] = coords;
        const distance = calculateDistance(userLat, userLon, poiLat, poiLon);
        const isBeacon = poi.properties?.isBeacon;

        // Beacons are visible from further away than pins
        if (!isBeacon && distance > 1000) return null;
        if (isBeacon && distance > MAX_DISTANCE) return null;

        const bearing = getBearing(userLat, userLon, poiLat, poiLon);
        const angleDiff = bearing - heading;
        const rad = angleDiff * (Math.PI / 180);

        // Beacons are rendered further away visually to feel "monumental"
        const scaledDistance = isBeacon 
          ? Math.min(Math.max(distance / 20, 15), 50)
          : Math.min(Math.max(distance / 5, 3), 25);

        const x = Math.sin(rad) * scaledDistance;
        // Beacons start at ground level, Pins are slightly elevated
        const y = isBeacon ? -1.5 : (idx % 3) * 0.4 - 0.4;
        const z = -Math.cos(rad) * scaledDistance;

        const metadata = getCategoryMetadata(poi.properties?.category);

        return (
          /* eslint-disable-next-line react/no-unknown-property */
          <group key={poi.properties?.id || idx} position={[x, y, z]}>
            {isBeacon ? (
              <ARBeacon color={metadata.color} />
            ) : (
              <ARPin color={metadata.color} />
            )}
          </group>
        );
      })
      .filter(Boolean);
  }, [userCoords, heading, pois]);

  return <group>{poiNodes}</group>;
};
