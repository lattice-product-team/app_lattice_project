import { useEffect } from 'react';
import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import { useOrientationStore } from '../store/useOrientationStore';

export const useCameraTilt = () => {
  const setHeading = useOrientationStore((s) => s.setHeading);
  const setIsLandscape = useOrientationStore((s) => s.setIsLandscape);
  const heading = useOrientationStore((s) => s.heading);
  const isLandscape = useOrientationStore((s) => s.isLandscape);
  
  // AR is active when in landscape
  const isVisible = isLandscape;

  useEffect(() => {
    // 1. Compass Heading Observer
    let locationSub: Location.LocationSubscription | null = null;
    
    const watchHeading = async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') return;
      
      locationSub = await Location.watchHeadingAsync((data) => {
        setHeading(data.trueHeading !== -1 ? data.trueHeading : data.magHeading);
      });
    };

    if (isVisible) {
      watchHeading();
    }

    return () => {
      if (locationSub) {
        locationSub.remove();
      }
    };
  }, [isVisible, setHeading]);

  useEffect(() => {
    // 2. Accelerometer Observer for physical device orientation (bypasses OS orientation locks)
    Accelerometer.setUpdateInterval(500); // 500ms is enough for orientation check
    const accelSub = Accelerometer.addListener(({ x, y, z }) => {
      const isLayingFlat = Math.abs(z) > 0.8;
      const isHorizontal = Math.abs(x) > 0.65;
      
      setIsLandscape(!isLayingFlat && isHorizontal);
    });

    return () => {
      accelSub.remove();
    };
  }, [setIsLandscape]);

  return { isVisible, isLandscape, heading };
};
